/**
 * Service to submit inquiries. The lead is created in Frappe CRM via the
 * server-side /api/lead proxy (which holds the Frappe credentials); attribution
 * (UTMs, ad click-ids) is attached here from the first-party cookie, and the
 * GA4 `generate_lead` event fires on success.
 */

import { trackLead, trackFormError } from './gtm';
import { getAttribution } from './attribution';

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
    "Something went wrong. Please try again or call us at +971 55 930 4697.";
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

export async function submitInquiry(data: InquiryData, tracking?: InquiryTracking): Promise<boolean> {
    try {
        const res = await fetch('/api/lead', {
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
                attribution: getAttribution(),
            }),
        });

        if (!res.ok) {
            console.error('Lead submission failed:', res.status);
            if (tracking?.formId) trackFormError(tracking.formId, 'submit_failed');
            return false;
        }

        // Marketing attribution/reporting is handled via GTM/GA4 — fire the
        // conversion event centrally so no individual form can forget it.
        if (tracking?.formId) {
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

        return true;
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        if (tracking?.formId) trackFormError(tracking.formId, 'submit_failed');
        return false;
    }
}
