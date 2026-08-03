"use client";

/**
 * Approximate visitor city, resolved from their IP address and cached in a
 * first-party cookie. It fills the `city` column on the CRM lead, which the
 * forms never ask for — sales can see roughly where an enquiry came from
 * without adding a field the visitor has to type.
 *
 * Uses ipwho.is: HTTPS, no API key, no signup, free. The lookup runs from the
 * browser so it sees the visitor's own IP; a server-side call would only ever
 * resolve the server's location.
 *
 * Accuracy is city-level and imperfect — mobile networks and VPNs routinely
 * resolve to the carrier's hub rather than the user. Treat it as a hint for
 * routing and prioritisation, never as the customer's stated address.
 */

import { readCookie, writeCookie } from './cookies';

const COOKIE_NAME = 'clf_geo';
const MAX_AGE_DAYS = 30;
const LOOKUP_URL = 'https://ipwho.is/';
const TIMEOUT_MS = 4000;

export interface Geo {
    city?: string;
    region?: string;
    country?: string;
}

/** Returns the cached geo (empty object if the lookup never succeeded). */
export function getGeo(): Geo {
    const raw = readCookie(COOKIE_NAME);
    if (!raw) return {};
    try {
        return JSON.parse(raw) as Geo;
    } catch {
        return {};
    }
}

/**
 * Resolves the city once per 30 days and caches it. Never throws and never
 * blocks anything: if the service is slow, down, or blocked by a privacy
 * extension, the lead simply goes to the CRM without a city.
 */
export async function captureGeo(): Promise<void> {
    if (typeof window === 'undefined') return;
    if (readCookie(COOKIE_NAME)) return;

    // Privacy extensions block IP-geolocation endpoints often enough that this
    // must be treated as best-effort, and a hung request must never leak.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const res = await fetch(LOOKUP_URL, { signal: controller.signal });
        if (!res.ok) return;

        const data = await res.json();
        if (!data?.success || !data.city) return;

        writeCookie(
            COOKIE_NAME,
            JSON.stringify({ city: data.city, region: data.region, country: data.country }),
            MAX_AGE_DAYS,
        );
    } catch {
        /* offline, blocked, or timed out — city is optional, so fail quietly */
    } finally {
        clearTimeout(timeout);
    }
}
