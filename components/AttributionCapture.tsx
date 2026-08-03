"use client";

import { useEffect } from 'react';
import { captureAttribution } from '@/lib/attribution';
import { captureGeo } from '@/lib/geo';

/**
 * Invisible mount-once component that persists first-touch campaign
 * attribution (UTMs, ad click-ids, referrer) for later CRM enrichment, plus the
 * visitor's approximate city.
 */
export default function AttributionCapture() {
    useEffect(() => {
        captureAttribution();

        // Deferred to idle so an optional third-party lookup never competes
        // with rendering. Both helpers no-op once their cookie exists.
        const idle = window.requestIdleCallback?.(() => captureGeo());
        if (idle === undefined) captureGeo();
        return () => {
            if (idle !== undefined) window.cancelIdleCallback?.(idle);
        };
    }, []);
    return null;
}
