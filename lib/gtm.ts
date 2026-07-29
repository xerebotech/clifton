"use client";

import { useCallback, useRef } from 'react';

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const pushToDataLayer = (payload: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push(payload);
    }
};

const currentPath = () =>
    typeof window !== 'undefined' ? window.location.pathname : '';

export const pageview = (url: string) => {
    pushToDataLayer({ event: 'pageview', page: url });
};

export const event = (action: string, params: object) => {
    pushToDataLayer({ event: action, ...params });
};

/**
 * User-provided data for ad-platform conversion matching (Google Ads Enhanced
 * Conversions / Meta CAPI). This is the ONLY sanctioned use — it must be routed
 * to those tags (which hash it), NEVER mapped to a GA4 tag.
 */
export interface LeadUserData {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
}

export interface LeadEventMeta {
    /** Stable identifier for the form, e.g. 'home-contact-form' */
    formId: string;
    /** Maps to the inquiry's projectOrService, e.g. 'Strategy Session' */
    leadType?: string;
    /** Property title when the lead is tied to a listing */
    propertyName?: string;
    /** Contact fields for Enhanced Conversions / CAPI (do NOT send to GA4). */
    userData?: LeadUserData;
}

/**
 * GA4-recommended conversion event. Fired once per successful submission.
 * GTM/GA4 attribute this back to the session's original UTM source, so the
 * form itself never needs to carry UTM parameters.
 *
 * `user_data` (email/phone/name) is attached for Google Ads Enhanced
 * Conversions / Meta CAPI ONLY. Never map `user_data` into a GA4 tag — sending
 * PII to GA4 violates Google policy.
 */
export const trackLead = ({ formId, leadType, propertyName, userData }: LeadEventMeta) => {
    pushToDataLayer({
        event: 'generate_lead',
        form_id: formId,
        form_location: currentPath(),
        lead_type: leadType || '',
        ...(propertyName ? { property_name: propertyName } : {}),
        ...(userData
            ? {
                user_data: {
                    email: userData.email || '',
                    phone_number: userData.phone || '',
                    address: {
                        first_name: userData.firstName || '',
                        last_name: userData.lastName || '',
                    },
                },
            }
            : {}),
    });
};

/** Funnel event: first interaction with a form (fired once). */
export const trackFormStart = (formId: string) => {
    pushToDataLayer({
        event: 'form_start',
        form_id: formId,
        form_location: currentPath(),
    });
};

/**
 * Returns an onFocus handler that fires `form_start` exactly once for a form.
 * Attach to the form element via `onFocusCapture` so any field focus counts.
 */
export function useFormStart(formId: string) {
    const started = useRef(false);
    return useCallback(() => {
        if (started.current) return;
        started.current = true;
        trackFormStart(formId);
    }, [formId]);
}

/* ────────────────────────── Engagement ────────────────────────── */

/** Scroll milestone reached (25 / 50 / 75 / 100). Fired once per threshold per page. */
export const trackScrollDepth = (percent: number) => {
    pushToDataLayer({ event: 'scroll_depth', percent, page_path: currentPath() });
};

/** Active engagement-time milestone in seconds (15 / 30 / 60 / 120). */
export const trackEngagementTime = (seconds: number) => {
    pushToDataLayer({ event: 'user_engagement_time', seconds, page_path: currentPath() });
};

/* ────────────────────────── Interaction ───────────────────────── */

/** Any primary CTA click (opens a modal, navigates, etc.). */
export const trackCtaClick = (ctaText: string, ctaLocation: string, destination = '') => {
    pushToDataLayer({
        event: 'cta_click',
        cta_text: ctaText,
        cta_location: ctaLocation,
        destination,
        page_path: currentPath(),
    });
};

/** WhatsApp click (high-intent contact). */
export const trackWhatsappClick = (location = 'floating_button') => {
    pushToDataLayer({ event: 'whatsapp_click', location, page_path: currentPath() });
};

/* ─────────────────────── Form diagnostics ─────────────────────── */

export const trackFormError = (formId: string, errorType: string) => {
    pushToDataLayer({ event: 'form_error', form_id: formId, error_type: errorType, page_path: currentPath() });
};

export const trackFormStep = (formId: string, step: number) => {
    pushToDataLayer({ event: 'form_step', form_id: formId, step, page_path: currentPath() });
};

/* ──────────────────────────── Consent ─────────────────────────── */

export const trackConsent = (choice: 'all' | 'none' | 'custom', analytics: boolean, marketing: boolean) => {
    pushToDataLayer({ event: 'consent_update', choice, analytics_consent: analytics, marketing_consent: marketing });
};

/* ──────────────── Property (GA4 e-commerce semantics) ──────────── */

export interface AnalyticsItem {
    item_id: string;
    item_name: string;
    price?: number;
    item_category?: string;   // property type
    item_category2?: string;  // location
    item_brand?: string;      // developer
}

interface PropertyLike {
    id: string | number;
    title: string;
    priceNumeric?: number;
    type?: string;
    location?: string;
    developer?: string;
}

/** Maps a Property (or similar) to a GA4 item object. */
export const toAnalyticsItem = (p: PropertyLike): AnalyticsItem => ({
    item_id: String(p.id),
    item_name: p.title,
    ...(p.priceNumeric ? { price: p.priceNumeric } : {}),
    ...(p.type ? { item_category: p.type } : {}),
    ...(p.location ? { item_category2: p.location } : {}),
    ...(p.developer ? { item_brand: p.developer } : {}),
});

// GA4 recommends clearing the ecommerce object before each ecommerce push.
const pushEcommerce = (event: string, ecommerce: Record<string, unknown>) => {
    pushToDataLayer({ ecommerce: null });
    pushToDataLayer({ event, ecommerce });
};

export const trackViewItem = (item: AnalyticsItem, currency = 'AED') =>
    pushEcommerce('view_item', { currency, value: item.price || 0, items: [item] });

export const trackViewItemList = (itemListName: string, items: AnalyticsItem[]) =>
    pushEcommerce('view_item_list', { item_list_name: itemListName, items });

export const trackSelectItem = (itemListName: string, item: AnalyticsItem) =>
    pushEcommerce('select_item', { item_list_name: itemListName, items: [item] });

export const trackAddToWishlist = (item: AnalyticsItem, currency = 'AED') =>
    pushEcommerce('add_to_wishlist', { currency, value: item.price || 0, items: [item] });

/** ROI calculator interaction (debounce at the call site). */
export const trackRoiCalculatorUse = (field: string, value: number | string, propertyName = '') => {
    pushToDataLayer({ event: 'roi_calculator_use', field, value, property_name: propertyName, page_path: currentPath() });
};
