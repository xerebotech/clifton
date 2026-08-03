import { NextRequest, NextResponse } from 'next/server';

/**
 * Emergency lead capture. The browser posts leads straight to the CRM's public
 * web_lead endpoint; when that call fails — CRM down, validation rejected,
 * network unreachable — the form falls back to this route, which emails the
 * submission to the sales inbox so the lead is never silently lost.
 *
 * Delivery goes through a Google Apps Script web app (see
 * scripts/lead-fallback-mailer.gs) which sends the mail from your own Google
 * account — free, no third-party service, no SMTP password, no domain
 * verification.
 *
 * Why a server route rather than calling the script from the browser: the
 * script URL and token are what stop strangers mailing your inbox, and
 * anything reachable from browser JS is public. Keeping the call server-side
 * also avoids Apps Script's cross-origin redirect quirks and lets us read the
 * real result instead of guessing.
 *
 * Required env (server-only — do NOT prefix with NEXT_PUBLIC):
 *   LEAD_FALLBACK_SCRIPT_URL  the Apps Script web-app /exec URL
 *   LEAD_FALLBACK_TOKEN       shared secret matching SHARED_TOKEN in the script
 *
 * The recipient lives inside the Apps Script, not here — so even a leaked
 * token cannot be used to mail an arbitrary address.
 */

export const runtime = 'nodejs';

const SCRIPT_URL = process.env.LEAD_FALLBACK_SCRIPT_URL || '';
const SCRIPT_TOKEN = process.env.LEAD_FALLBACK_TOKEN || '';

/** Matches the CRM endpoint's own limit so both paths reject the same traffic. */
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_FIELD_LENGTH = 2000;

/**
 * In-memory per-IP limiter. Deliberately simple: this route only fires when the
 * CRM is already failing, so it sees a trickle of traffic, not a stream. It is
 * per-instance — if the app is ever scaled to multiple instances the effective
 * limit multiplies, which is acceptable for a safety net whose only downside is
 * duplicate mail to one fixed inbox.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);

    // Opportunistic cleanup so the map cannot grow without bound.
    if (hits.size > 500) {
        for (const [key, times] of hits) {
            if (times.every(t => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(key);
        }
    }
    return recent.length > RATE_LIMIT_MAX;
}

interface Attribution {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;
    fbclid?: string;
    gbraid?: string;
    wbraid?: string;
    msclkid?: string;
    ttclid?: string;
    adset?: string;
    ad?: string;
    placement?: string;
    landing_page?: string;
    referrer?: string;
    first_touch_at?: string;
}

interface FallbackPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    projectOrService?: string;
    message?: string;
    propertyName?: string;
    formId?: string;
    buttonName?: string;
    pagePath?: string;
    crmError?: string;
    attribution?: Attribution;
}

/** The email body is HTML, so every value the visitor typed must be escaped. */
function esc(value: unknown): string {
    return String(value ?? '')
        .slice(0, MAX_FIELD_LENGTH)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildRows(body: FallbackPayload): Array<[string, string | undefined]> {
    const a = body.attribution || {};
    const clickId = a.gclid || a.fbclid || a.ttclid || a.msclkid || a.gbraid || a.wbraid;
    const name = `${body.firstName || ''} ${body.lastName || ''}`.trim();

    return [
        ['Name', name],
        ['Phone', body.phone],
        ['Email', body.email],
        ['Interest', body.projectOrService],
        ['Property', body.propertyName],
        ['Message', body.message],
        ['Form', body.formId],
        ['Button', body.buttonName],
        ['Page', body.pagePath],
        ['Campaign', a.utm_campaign],
        ['Source', a.utm_source],
        ['Medium', a.utm_medium],
        ['Ad set', a.adset || a.utm_term],
        ['Ad', a.ad || a.utm_content],
        ['Placement', a.placement],
        ['Click ID', clickId],
        ['Landing page', a.landing_page],
        ['Referrer', a.referrer],
        ['First touch', a.first_touch_at],
        ['CRM error', body.crmError],
    ];
}

function buildHtml(body: FallbackPayload): string {
    const rows = buildRows(body)
        .filter(([, v]) => v)
        .map(
            ([k, v]) =>
                `<tr><td style="padding:6px 14px 6px 0;color:#6b7280;white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
                `<td style="padding:6px 0;color:#111827"><b>${esc(v)}</b></td></tr>`,
        )
        .join('');

    return `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:640px">
<p style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px 16px;color:#991b1b;margin:0 0 20px">
<b>This lead was NOT saved to the CRM.</b><br>
It arrived by email because the CRM submission failed. Add it manually and check the CRM.
</p>
<table style="border-collapse:collapse;font-size:14px">${rows}</table>
</div>`;
}

function buildText(body: FallbackPayload): string {
    const lines = buildRows(body)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${String(v).slice(0, MAX_FIELD_LENGTH)}`);
    return `THIS LEAD WAS NOT SAVED TO THE CRM — add it manually.\n\n${lines.join('\n')}`;
}

export async function POST(req: NextRequest) {
    if (!SCRIPT_URL || !SCRIPT_TOKEN) {
        console.error(
            'CRITICAL: lead fallback email is unconfigured (LEAD_FALLBACK_SCRIPT_URL / LEAD_FALLBACK_TOKEN missing).',
        );
        return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 500 });
    }

    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        req.headers.get('x-real-ip') ||
        'unknown';
    if (rateLimited(ip)) {
        return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    }

    let body: FallbackPayload;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
    }

    // Same bar the CRM applies — no point emailing an uncontactable lead.
    if ((body?.phone || '').replace(/\D/g, '').length < 8) {
        return NextResponse.json({ ok: false, error: 'missing_phone' }, { status: 400 });
    }

    const name = `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'Unknown';

    try {
        const res = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Apps Script answers the web-app URL with a redirect to
            // googleusercontent.com; fetch follows it automatically.
            redirect: 'follow',
            body: JSON.stringify({
                token: SCRIPT_TOKEN,
                subject: `⚠️ CRM SAVE FAILED — new lead: ${name}`,
                html: buildHtml(body),
                text: buildText(body),
                // Lets sales reply straight to the lead from their inbox.
                replyTo: body.email || '',
            }),
        });

        // Apps Script always answers HTTP 200, even for an auth failure or an
        // internal error — the real outcome is in the JSON body, so a status
        // check alone would report success for every rejected send.
        const result = await res.json().catch(() => null);
        if (!res.ok || !result?.ok) {
            console.error('Fallback mailer rejected the send:', res.status, result?.error ?? '(unparseable body)');
            return NextResponse.json({ ok: false, error: 'send_failed' }, { status: 502 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('Error sending fallback lead email:', err);
        return NextResponse.json({ ok: false, error: 'network' }, { status: 502 });
    }
}
