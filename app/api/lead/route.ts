import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy that creates a lead in the Frappe/ERPNext "Lead" doctype.
 *
 * Why a server route: Frappe's API key/secret must never reach the browser,
 * and calling Frappe directly from the client would also hit CORS and give an
 * opaque response. This handler holds the credentials, talks to Frappe over
 * server-to-server fetch, and returns a real success/failure to the form.
 *
 * Field names below match the live "Lead" doctype (verified via the API):
 *   standard : first_name, last_name, full_name, mobile_no (reqd), email_id,
 *              organization, city, status, source, lead_owner
 *   marketing: campaign, ad_set, ad, form_name, button_name, platform,
 *              ad_platform (Select), platform_lead_id, clid
 *
 * Required env (server-only — do NOT prefix with NEXT_PUBLIC):
 *   FRAPPE_URL, FRAPPE_API_KEY, FRAPPE_API_SECRET
 */

export const runtime = 'nodejs';

const FRAPPE_URL = process.env.FRAPPE_URL || '';
const FRAPPE_API_KEY = process.env.FRAPPE_API_KEY || '';
const FRAPPE_API_SECRET = process.env.FRAPPE_API_SECRET || '';

const LEAD_DOCTYPE = 'Lead';
const LEAD_SOURCE = 'Website';   // valid option in the Source select
const LEAD_STATUS = 'New Lead';  // valid option in the Status select

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

interface LeadPayload {
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
    attribution?: Attribution;
}

/** Maps utm_source to the Ad Platform select options on the Lead doctype. */
function normalizeAdPlatform(source?: string): string {
    const s = (source || '').toLowerCase();
    if (!s) return '';
    if (/(facebook|instagram|meta|\bfb\b|\big\b|messenger)/.test(s)) return 'Meta';
    if (/(google|adwords|gads|youtube)/.test(s)) return 'Google';
    if (/linkedin/.test(s)) return 'LinkedIn';
    if (/(tiktok|\btt\b)/.test(s)) return 'TikTok';
    if (/snap/.test(s)) return 'Snap Chat';
    if (/pinterest|\bpin\b/.test(s)) return 'Pinterest';
    return 'Others';
}

/** Composes the free-text Notes body from the message + lead context. */
function buildNotes(body: LeadPayload): string {
    const a = body.attribution || {};
    const rows: Array<[string, string | undefined]> = [
        ['Property', body.propertyName],
        ['Interest', body.projectOrService],
        ['Form', body.formId],
        ['Page', body.pagePath],
        ['Landing page', a.landing_page],
        ['Referrer', a.referrer],
        ['First touch', a.first_touch_at],
    ];
    const meta = rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<p><b>${k}:</b> ${v}</p>`)
        .join('');
    const message = body.message ? `<p>${body.message}</p>` : '';
    return `${message}${message && meta ? '<hr>' : ''}${meta}`;
}

function toLead(body: LeadPayload) {
    const a = body.attribution || {};
    const firstName = body.firstName || '';
    const lastName = body.lastName || '';
    return {
        // --- standard ---
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        mobile_no: body.phone || '',
        email_id: body.email || '',
        source: LEAD_SOURCE,
        status: LEAD_STATUS,

        // --- marketing info ---
        campaign: a.utm_campaign || '',
        ad_set: a.adset || a.utm_term || '',
        ad: a.ad || a.utm_content || '',
        platform: a.placement || a.utm_medium || '',           // "Placement" field
        ad_platform: normalizeAdPlatform(a.utm_source),
        clid: a.gclid || a.fbclid || a.ttclid || a.msclkid || a.gbraid || a.wbraid || '',
        form_name: body.formId || '',
        button_name: body.buttonName || '',

        // --- notes ---
        notes: buildNotes(body),
    };
}

export async function POST(req: NextRequest) {
    if (!FRAPPE_URL || !FRAPPE_API_KEY || !FRAPPE_API_SECRET) {
        console.error('CRITICAL: Frappe env vars are missing (FRAPPE_URL / FRAPPE_API_KEY / FRAPPE_API_SECRET).');
        return NextResponse.json({ ok: false, error: 'server_not_configured' }, { status: 500 });
    }

    let body: LeadPayload;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
    }

    // mobile_no is mandatory on the Lead doctype — a lead without a usable
    // phone would be rejected by Frappe, so fail fast with a clear reason.
    const digits = (body?.phone || '').replace(/\D/g, '');
    if (digits.length < 8) {
        return NextResponse.json({ ok: false, error: 'missing_phone' }, { status: 400 });
    }

    const endpoint = `${FRAPPE_URL.replace(/\/$/, '')}/api/resource/${encodeURIComponent(LEAD_DOCTYPE)}`;

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `token ${FRAPPE_API_KEY}:${FRAPPE_API_SECRET}`,
            },
            body: JSON.stringify(toLead(body)),
        });

        const text = await res.text();

        if (!res.ok) {
            console.error('Frappe lead create failed:', res.status, text);
            return NextResponse.json({ ok: false, error: 'frappe_error', status: res.status }, { status: 502 });
        }

        let leadId: string | undefined;
        try {
            leadId = text ? JSON.parse(text)?.data?.name : undefined;
        } catch {
            /* non-JSON success body — ignore */
        }

        return NextResponse.json({ ok: true, leadId });
    } catch (err) {
        console.error('Error creating Frappe lead:', err);
        return NextResponse.json({ ok: false, error: 'network' }, { status: 502 });
    }
}
