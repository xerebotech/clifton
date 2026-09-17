/**
 * Forwards a CMS form submission to the Frappe CRM.
 *
 * Server-side on purpose. The browser copy in lib/inquiryService.ts posts
 * directly from the page, which is fine for the hand-built forms, but a blog
 * reader may navigate away the moment they hit submit. Doing it here means the
 * lead reaches the CRM even then, needs no CORS, and cannot be blocked by an
 * extension.
 *
 * Field names below are the ones the endpoint's FIELD_MAP recognises — they
 * match lib/inquiryService.ts. Changing one without changing it there too will
 * silently drop that value.
 */

const CRM_LEAD_ENDPOINT =
    process.env.CRM_LEAD_ENDPOINT ||
    process.env.NEXT_PUBLIC_CRM_LEAD_ENDPOINT ||
    "https://crm.cliftonuae.com/api/method/xcrm.api.web_lead.create";

/** Written first-touch by lib/attribution.ts; SameLax + path=/, so it reaches us. */
const ATTRIBUTION_COOKIE = "clf_attribution";

export interface LeadEntry {
    field: string;
    label?: string;
    value: string;
}

type Attribution = Record<string, string | undefined>;

function readAttribution(cookieHeader: string | null): Attribution {
    if (!cookieHeader) return {};

    const row = cookieHeader
        .split("; ")
        .find((entry) => entry.startsWith(`${ATTRIBUTION_COOKIE}=`));

    if (!row) return {};

    try {
        const raw = decodeURIComponent(row.split("=").slice(1).join("="));
        const parsed: unknown = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? (parsed as Attribution) : {};
    } catch {
        // A malformed cookie must never cost us the lead.
        return {};
    }
}

/**
 * `ad_platform` is a Select on the Lead doctype. Sending anything outside its
 * options makes Frappe throw a ValidationError and reject the whole lead with a
 * 417 — so the raw utm_source must be mapped, never passed through.
 *
 * Mirrors matchAdPlatform/resolveAdPlatform in lib/inquiryService.ts.
 */
function matchAdPlatform(source?: string): string {
    const s = (source || "").toLowerCase();
    if (!s) return "";
    if (/(facebook|instagram|meta|\bfb\b|\big\b|messenger)/.test(s)) return "Meta";
    if (/(google|adwords|gads|youtube)/.test(s)) return "Google";
    if (/linkedin/.test(s)) return "LinkedIn";
    if (/(tiktok|\btt\b)/.test(s)) return "TikTok";
    if (/snap/.test(s)) return "Snap Chat";
    if (/pinterest|\bpin\b/.test(s)) return "Pinterest";
    return "";
}

function resolveAdPlatform(a: Attribution): string {
    const fromSource = matchAdPlatform(a.utm_source);
    if (fromSource) return fromSource;
    if (a.gclid || a.gbraid || a.wbraid) return "Google";
    if (a.fbclid) return "Meta";
    if (a.ttclid) return "TikTok";
    if (a.msclkid) return "Others"; // Microsoft Ads has no option of its own
    return a.utm_source ? "Others" : "";
}

/**
 * `lead_type` is a mandatory Select with three literal options. Only someone
 * offering up a property of their own is a Listing; everything else is demand.
 * Same rule as normalizeLeadType in lib/inquiryService.ts.
 */
const PROPERTY_LISTING_INTENT = /sell|listing|landlord|manage/i;

const find = (entries: LeadEntry[], pattern: RegExp): string =>
    entries.find((entry) => pattern.test(entry.field) && entry.value.trim())?.value.trim() ?? "";

/** "Akhil Saja Vijay" → first "Akhil", last "Saja Vijay". */
function splitName(full: string): { first: string; last: string } {
    const parts = full.trim().split(/\s+/);
    if (parts.length < 2) return { first: full.trim(), last: "" };
    return { first: parts[0], last: parts.slice(1).join(" ") };
}

/**
 * Everything the CRM has no dedicated field for, as one readable block — the
 * same approach inquiryService takes, so leads look consistent in Frappe.
 */
function buildFormResponses(entries: LeadEntry[], used: Set<string>): string {
    return entries
        .filter((entry) => !used.has(entry.field) && entry.value.trim())
        .map((entry) => `${entry.label || entry.field}: ${entry.value.trim()}`)
        .join("\n");
}

export async function forwardLeadToCRM(options: {
    entries: LeadEntry[];
    formName: string;
    cookieHeader: string | null;
    pageUrl?: string;
}): Promise<{ ok: boolean; reason?: string }> {
    const { entries, formName, cookieHeader, pageUrl } = options;

    const attribution = readAttribution(cookieHeader);

    const name = find(entries, /name/i);
    const phone = find(entries, /phone|mobile|tel/i);
    const email = find(entries, /e-?mail/i);

    // The CRM requires a mobile number; without one the lead is rejected, and
    // there is no point spending a request to find that out.
    if (!phone && !email) {
        return { ok: false, reason: "no phone or email in the submission" };
    }

    const { first, last } = splitName(name);
    const used = new Set(
        entries
            .filter((entry) => /name/i.test(entry.field) || /phone|mobile|tel/i.test(entry.field) || /e-?mail/i.test(entry.field))
            .map((entry) => entry.field),
    );

    const body = new FormData();
    const append = (key: string, value?: string) => {
        if (value) body.append(key, value);
    };

    append("first_name", first);
    append("last_name", last);
    append("mobile_no", phone);
    append("email_id", email);

    append("utm_campaign", attribution.utm_campaign);
    append("utm_adset", attribution.adset || attribution.utm_term);
    append("utm_ad", attribution.ad || attribution.utm_content);
    append("utm_source", resolveAdPlatform(attribution));
    append("platform", attribution.placement || attribution.utm_medium);
    append(
        "clid",
        attribution.gclid ||
            attribution.fbclid ||
            attribution.ttclid ||
            attribution.msclkid ||
            attribution.gbraid ||
            attribution.wbraid,
    );

    append("form_name", formName);

    // Derived from the Service of Interest field, so a seller does not land in
    // the buyer queue and get the wrong follow-up.
    const interest = find(entries, /service|interest/i);
    append("lead_type", PROPERTY_LISTING_INTENT.test(interest) ? "Property Listing" : "Property Buyer");

    const responses = [
        buildFormResponses(entries, used),
        pageUrl ? `Page: ${pageUrl}` : "",
        attribution.landing_page ? `Landing page: ${attribution.landing_page}` : "",
        attribution.referrer ? `Referrer: ${attribution.referrer}` : "",
    ]
        .filter(Boolean)
        .join("\n");

    append("form_responses", responses);

    try {
        const res = await fetch(CRM_LEAD_ENDPOINT, {
            method: "POST",
            body,
            cache: "no-store",
        });

        if (!res.ok) {
            return { ok: false, reason: `CRM responded ${res.status}` };
        }

        return { ok: true };
    } catch (error) {
        return { ok: false, reason: error instanceof Error ? error.message : "request failed" };
    }
}
