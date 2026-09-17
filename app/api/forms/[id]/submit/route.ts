import { NextResponse } from "next/server";

import { forwardLeadToCRM, type LeadEntry } from "@/lib/crmLead";

/**
 * Submission proxy for CMS forms.
 *
 * A browser cannot post to the CMS directly. The public submit endpoint
 * resolves the tenant from an API key or, failing that, from the Host header
 * matched against `tenants.domain` — and a browser request arrives with the
 * CMS's own host, which matches nothing. So the post goes through here, where
 * the API key can be attached server-side.
 *
 * The visitor's IP is forwarded because the CMS rate-limits per IP per form;
 * without it every submission would look like it came from this server and a
 * single visitor could lock out everyone else.
 *
 * Once the CMS has stored the submission, the lead is also pushed to the Frappe
 * CRM. The CMS write is the source of truth and happens first: if the CRM is
 * down we still have the lead, and the visitor still sees success.
 */

const CMS_URL = (process.env.CMS_URL || "http://localhost:3000").replace(/\/$/, "");
const CMS_API_KEY = process.env.CMS_API_KEY || "";

interface SubmitBody {
    submissionData?: LeadEntry[];
    formName?: string;
    pageUrl?: string;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!CMS_API_KEY) {
        return NextResponse.json({ error: "CMS is not configured" }, { status: 503 });
    }

    const { id } = await params;

    let body: SubmitBody;
    try {
        body = (await request.json()) as SubmitBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    // Only headers the platform sets itself. `x-forwarded-for` arrives from the
    // visitor's browser and is entirely attacker-controlled — passing it through
    // would let anyone defeat the CMS rate limiter (which keys on it) by sending
    // a different value on every request.
    const forwardedFor =
        request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-real-ip");

    let upstream: Response;
    let text: string;

    try {
        upstream = await fetch(`${CMS_URL}/api/public/forms/${encodeURIComponent(id)}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `users API-Key ${CMS_API_KEY}`,
                ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
            },
            // The CMS endpoint keeps only `field` and `value`; the extra `label`
            // we carry for the CRM is dropped there rather than stored.
            body: JSON.stringify(body),
            cache: "no-store",
        });

        text = await upstream.text();
    } catch (error) {
        console.error("[forms] submit proxy failed:", error);
        return NextResponse.json({ error: "Could not reach the form service." }, { status: 502 });
    }

    // Only forward real submissions — not validation failures or rate limits.
    if (upstream.ok && Array.isArray(body.submissionData) && body.submissionData.length) {
        const crm = await forwardLeadToCRM({
            entries: body.submissionData,
            formName: body.formName || "blog-enquiry",
            cookieHeader: request.headers.get("cookie"),
            pageUrl: body.pageUrl,
        });

        if (!crm.ok) {
            // Logged, not surfaced: the submission is already stored, and telling
            // the visitor it failed would only produce a duplicate.
            console.error(`[forms] CRM forward failed (${crm.reason}) for form ${id}`);
        }
    }

    return new NextResponse(text, {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
    });
}
