"use client";

/**
 * First-party attribution capture for CRM lead enrichment.
 *
 * On the first visit that carries a campaign signal, we persist the UTM
 * parameters, ad click-ids, landing page and referrer into a first-party
 * cookie. Because it's a cookie (not URL state), the data survives client-side
 * navigation and is available at submit time on any page — this is what makes
 * source/campaign land on the CRM lead even when the user submits several
 * pages deep on a clean URL.
 *
 * Marketing *reporting* attribution is still handled by GTM/GA4 via the
 * `generate_lead` event; this cookie exists purely so the sales team can see
 * the raw source values on each lead inside Frappe CRM.
 */

import { readCookie, writeCookie } from './cookies';

export interface Attribution {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    gclid?: string;   // Google Ads
    fbclid?: string;  // Meta
    gbraid?: string;  // Google iOS (app→web)
    wbraid?: string;  // Google iOS (web→app)
    msclkid?: string; // Microsoft/Bing Ads
    ttclid?: string;  // TikTok Ads
    adset?: string;      // ad set / ad group
    ad?: string;         // specific ad / creative
    placement?: string;  // placement within the platform (ig, fb, msg, search…)
    landing_page?: string;
    referrer?: string;
    first_touch_at?: string;
}

const COOKIE_NAME = 'clf_attribution';
const MAX_AGE_DAYS = 90;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const CLICK_ID_KEYS = ['gclid', 'fbclid', 'gbraid', 'wbraid', 'msclkid', 'ttclid'] as const;
const AD_DETAIL_KEYS = ['adset', 'ad', 'placement'] as const;

/** Returns the stored first-touch attribution (empty object if none). */
export function getAttribution(): Attribution {
    const raw = readCookie(COOKIE_NAME);
    if (!raw) return {};
    try {
        return JSON.parse(raw) as Attribution;
    } catch {
        return {};
    }
}

/**
 * Captures attribution for the current page load and persists it as
 * FIRST-TOUCH — once stored it is never overwritten, so the original
 * campaign that brought the visitor in is what reaches the CRM.
 * Safe to call on every mount; it early-returns when nothing to do.
 */
export function captureAttribution(): void {
    if (typeof window === 'undefined') return;

    // First-touch wins: keep whatever was captured on the initial visit.
    if (readCookie(COOKIE_NAME)) return;

    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {};

    for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS, ...AD_DETAIL_KEYS]) {
        const value = params.get(key);
        if (value) (data as Record<string, string>)[key] = value;
    }

    const hasCampaignSignal = Object.keys(data).length > 0;
    const referrer = document.referrer || '';
    const isExternalReferrer = Boolean(referrer) && !referrer.includes(window.location.host);

    // Don't create a record for plain direct / internal visits — only when
    // there's a campaign signal or a genuine external referrer.
    if (!hasCampaignSignal && !isExternalReferrer) return;

    data.landing_page = window.location.pathname + window.location.search;
    data.referrer = referrer;
    data.first_touch_at = new Date().toISOString();

    writeCookie(COOKIE_NAME, JSON.stringify(data), MAX_AGE_DAYS);
}
