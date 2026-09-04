/**
 * Service to submit inquiries. The lead is created in Frappe CRM by posting
 * directly to the public `xcrm.api.web_lead.create` guest endpoint, so no API
 * credentials live in this app at all. Attribution (UTMs, ad click-ids) is
 * attached here from the first-party cookie, and the GA4 `generate_lead` event
 * fires on success.
 *
 * The endpoint is shared with the plain-HTML embed snippet, so it already
 * handles the server-side hardening: honeypot rejection, a per-IP rate limit,
 * HTML stripping and a 140-char cap on every mapped field.
 */

import { trackLead, trackFormError } from './gtm';
import { getAttribution, type Attribution } from './attribution';
import { getGeo } from './geo';

const CRM_LEAD_ENDPOINT =
    process.env.NEXT_PUBLIC_CRM_LEAD_ENDPOINT ||
    'https://crm.cliftonuae.com/api/method/xcrm.api.web_lead.create';

/** Name of the decoy input the CRM endpoint checks. Must match HoneypotField. */
export const HONEYPOT_FIELD = 'website_url';

export interface InquiryData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    projectOrService: string;
    message: string;
}

/** Shared error copy shown when a submission fails. */
export const SUBMIT_ERROR_MESSAGE =
    "Something went wrong. Please try again or call us at +971 50 164 9369.";
export const PHONE_ERROR_MESSAGE = "Please enter a valid phone number.";

/** A usable phone needs at least 8 digits (the CRM requires mobile_no). */
export function isValidPhone(phone: string): boolean {
    return (phone || '').replace(/\D/g, '').length >= 8;
}

export interface InquiryTracking {
    /** Stable form identifier for the generate_lead event, e.g. 'home-contact-form' */
    formId: string;
    /** Property title when the lead is tied to a listing */
    propertyName?: string;
    /** Label of the CTA the visitor used, e.g. 'Book Strategy Session' */
    buttonName?: string;
}

/**
 * `ad_platform` on the Lead doctype is a Select, and the endpoint writes
 * utm_source into it verbatim. Frappe rejects a Select value that isn't one of
 * the declared options, which would fail the insert and lose the lead — and raw
 * utm_source ("facebook", "google-ads", "ig") is never a valid option. Map it
 * onto the allowed set before sending.
 */
function matchAdPlatform(source?: string): string {
    const s = (source || '').toLowerCase();
    if (!s) return '';
    if (/(facebook|instagram|meta|\bfb\b|\big\b|messenger)/.test(s)) return 'Meta';
    if (/(google|adwords|gads|youtube)/.test(s)) return 'Google';
    if (/linkedin/.test(s)) return 'LinkedIn';
    if (/(tiktok|\btt\b)/.test(s)) return 'TikTok';
    if (/snap/.test(s)) return 'Snap Chat';
    if (/pinterest|\bpin\b/.test(s)) return 'Pinterest';
    return '';
}

/**
 * Resolves the ad platform, preferring utm_source but falling back to the click
 * id. That fallback matters: Google and Meta append gclid/fbclid to the landing
 * URL themselves, so an ad whose UTMs were mistyped or never set still
 * identifies its own network — without it those leads land with a blank
 * Ad Platform and drop out of channel reporting.
 */
function resolveAdPlatform(a: Attribution): string {
    const fromSource = matchAdPlatform(a.utm_source);
    if (fromSource) return fromSource;
    if (a.gclid || a.gbraid || a.wbraid) return 'Google';
    if (a.fbclid) return 'Meta';
    if (a.ttclid) return 'TikTok';
    if (a.msclkid) return 'Others';   // Microsoft Ads has no option of its own
    return a.utm_source ? 'Others' : '';
}

/**
 * `lead_type` is a mandatory Select with exactly three options — Property
 * Listing / Property Buyer / Promotional Event — and no default. It must always
 * be sent, and always as one of those literal strings, or Frappe rejects the
 * lead outright.
 *
 * Everything arriving through the site or a paid campaign is demand-side, so
 * Property Buyer is the default; only someone offering up a property of their
 * own (selling, letting it out, handing it to management) is a Property Listing.
 * Promotional Event is reserved for offline/event capture — no web form maps to it.
 */
const PROPERTY_LISTING_INTENT = /sell|listing|landlord|manage/i;

function normalizeLeadType(projectOrService?: string): string {
    return PROPERTY_LISTING_INTENT.test(projectOrService || '')
        ? 'Property Listing'
        : 'Property Buyer';
}

/**
 * Everything the endpoint has no dedicated column for — the visitor's message
 * plus the lead context the sales team needs (which property, which page, where
 * the visit originated). Plain text on purpose: `form_responses` is a Text
 * field, so it renders escaped in the CRM.
 */
function buildFormResponses(
    data: InquiryData,
    tracking: InquiryTracking | undefined,
    a: Attribution,
): string {
    const rows: Array<[string, string | undefined]> = [
        ['Message', data.message],
        ['Property', tracking?.propertyName],
        ['Interest', data.projectOrService],
        ['Form', tracking?.formId],
        ['Page', typeof window !== 'undefined' ? window.location.pathname : ''],
        ['Landing page', a.landing_page],
        ['Referrer', a.referrer],
        ['First touch', a.first_touch_at],
    ];
    return rows
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
}

/**
 * Reads the decoy field back out of the submitting form. Every form renders
 * <HoneypotField /> and carries its formId as the element id, so no form needs
 * to thread an extra piece of state through its own handler.
 */
function readHoneypot(formId: string): string {
    if (typeof document === 'undefined' || !formId) return '';
    const field = document
        .getElementById(formId)
        ?.querySelector<HTMLInputElement>(`input[name="${HONEYPOT_FIELD}"]`);
    return field?.value || '';
}

/**
 * Last resort when the CRM will not take the lead: email the whole submission
 * to the sales inbox so it is never silently lost. Deliberately a separate
 * server route rather than a second CRM call — if the CRM is the thing that is
 * broken, anything routed through it goes down with it.
 */
async function sendFallbackEmail(
    data: InquiryData,
    tracking: InquiryTracking | undefined,
    a: Attribution,
    crmError: string,
): Promise<boolean> {
    try {
        const res = await fetch('/api/lead-fallback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                projectOrService: data.projectOrService,
                message: data.message,
                propertyName: tracking?.propertyName || '',
                formId: tracking?.formId || '',
                buttonName: tracking?.buttonName || '',
                pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
                attribution: a,
                crmError,
            }),
        });
        return res.ok;
    } catch (error) {
        console.error('Fallback lead email failed:', error);
        return false;
    }
}

/** GA4 conversion event. Fired once per captured lead, CRM or fallback. */
function fireLeadEvent(data: InquiryData, tracking: InquiryTracking) {
    trackLead({
        formId: tracking.formId,
        leadType: data.projectOrService,
        propertyName: tracking.propertyName,
        // For Enhanced Conversions / CAPI only — route to Ads/Meta tags, never GA4.
        userData: {
            email: data.email,
            phone: data.phone,
            firstName: data.firstName,
            lastName: data.lastName,
        },
    });
}

export async function submitInquiry(data: InquiryData, tracking?: InquiryTracking): Promise<boolean> {
    const a = getAttribution();

    const body = new FormData();
    const append = (key: string, value?: string) => {
        if (value) body.append(key, value);
    };

    append('first_name', data.firstName);
    append('last_name', data.lastName);
    append('mobile_no', data.phone);
    append('email_id', data.email);

    // Approximate, resolved from the visitor's IP — no form asks for it. Absent
    // whenever the lookup was blocked or hadn't finished, which is fine.
    append('city', getGeo().city);

    // Marketing — these keys are the ones the endpoint's FIELD_MAP recognises.
    // Values come from the first-touch cookie, not the current URL, so the
    // campaign still lands on the lead when the visitor converts several pages
    // deep on a clean URL.
    append('utm_campaign', a.utm_campaign);
    append('utm_adset', a.adset || a.utm_term);
    append('utm_ad', a.ad || a.utm_content);
    append('utm_source', resolveAdPlatform(a));
    append('platform', a.placement || a.utm_medium);
    append('clid', a.gclid || a.fbclid || a.ttclid || a.msclkid || a.gbraid || a.wbraid);
    append('form_name', tracking?.formId);
    append('button_name', tracking?.buttonName);

    // Ignored by the endpoint until `lead_type` is added to its FIELD_MAP — and
    // that must not happen before the Select options exist on the doctype, or
    // Frappe will reject the value and lose the lead.
    append('lead_type', normalizeLeadType(data.projectOrService));

    append('form_responses', buildFormResponses(data, tracking, a));

    // A filled decoy means a bot. The CRM swallows those, and we must not treat
    // the resulting empty response as an outage worth emailing to sales.
    const honeypot = readHoneypot(tracking?.formId || '');
    append(HONEYPOT_FIELD, honeypot);

    /**
     * Emails the lead to sales and reports whether it was captured. The visitor
     * is shown success when the email lands — their details did reach the team,
     * and telling them it failed only invites a duplicate submission or a lost
     * customer.
     */
    const recover = async (reason: string): Promise<boolean> => {
        const emailed = await sendFallbackEmail(data, tracking, a, reason);
        if (tracking?.formId) {
            // Either way this is worth seeing in GA4: it measures how often the
            // CRM path is failing, which is otherwise invisible.
            trackFormError(tracking.formId, emailed ? 'crm_failed_emailed' : 'submit_failed');
            if (emailed) fireLeadEvent(data, tracking);
        }
        return emailed;
    };

    try {
        // Sent as FormData deliberately: multipart/form-data is a CORS-safelisted
        // content type, so the browser skips the preflight OPTIONS request that a
        // JSON body would trigger.
        const res = await fetch(CRM_LEAD_ENDPOINT, { method: 'POST', body });

        if (!res.ok) {
            console.error('Lead submission failed:', res.status);
            return recover(`CRM responded ${res.status}`);
        }

        // A swallowed honeypot hit also answers 200, but only a genuine insert
        // comes back with a lead name. Gate on that so a discarded submission
        // never reports success or fires a phantom conversion.
        const payload = await res.json().catch(() => null);
        if (!payload?.message?.lead) {
            if (honeypot) return false;
            console.error('Lead was not created by the CRM (no lead id returned).');
            return recover('CRM returned 200 but created no lead');
        }

        if (tracking?.formId) fireLeadEvent(data, tracking);
        return true;
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        return recover(error instanceof Error ? error.message : 'network error');
    }
}
