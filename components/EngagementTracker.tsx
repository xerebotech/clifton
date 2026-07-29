"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { trackScrollDepth, trackEngagementTime } from '@/lib/gtm';

/**
 * Emits engagement signals to the dataLayer, reset per route:
 *  - `scroll_depth` at 25 / 50 / 75 / 100 % (once each)
 *  - `user_engagement_time` at 15 / 30 / 60 / 120 s of ACTIVE time
 *    (the timer pauses while the tab is hidden, so it reflects real attention)
 */
export default function EngagementTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // ── scroll depth ──
        const thresholds = [25, 50, 75, 100];
        const firedScroll = new Set<number>();
        const onScroll = () => {
            const el = document.documentElement;
            const scrollable = el.scrollHeight - el.clientHeight;
            if (scrollable <= 0) return;
            // Round so fractional-pixel scroll positions still reach the 100% mark.
            const pct = Math.round((el.scrollTop / scrollable) * 100);
            for (const t of thresholds) {
                if (pct >= t && !firedScroll.has(t)) {
                    firedScroll.add(t);
                    trackScrollDepth(t);
                }
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // ── active engagement time ──
        const milestones = [15, 30, 60, 120];
        const firedTime = new Set<number>();
        let seconds = 0;
        let timer: ReturnType<typeof setInterval> | null = null;

        const stop = () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };
        const tick = () => {
            seconds += 1;
            for (const m of milestones) {
                if (seconds >= m && !firedTime.has(m)) {
                    firedTime.add(m);
                    trackEngagementTime(m);
                }
            }
            if (firedTime.size === milestones.length) stop();
        };
        const start = () => {
            if (!timer && document.visibilityState === 'visible' && firedTime.size < milestones.length) {
                timer = setInterval(tick, 1000);
            }
        };
        const onVisibility = () => (document.visibilityState === 'visible' ? start() : stop());
        document.addEventListener('visibilitychange', onVisibility);
        start();

        return () => {
            window.removeEventListener('scroll', onScroll);
            document.removeEventListener('visibilitychange', onVisibility);
            stop();
        };
    }, [pathname]);

    return null;
}
