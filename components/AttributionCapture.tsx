"use client";

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/attribution';

/**
 * Invisible mount-once component that persists first-touch campaign
 * attribution (UTMs, ad click-ids, referrer) for later CRM enrichment.
 */
export default function AttributionCapture() {
    useEffect(() => {
        captureAttribution();
    }, []);
    return null;
}
