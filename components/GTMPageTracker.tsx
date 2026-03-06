'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { pageview, event } from '@/lib/gtm';

export default function GTMPageTracker() {
    const pathname = usePathname();

    // Track page views on route change
    useEffect(() => {
        if (pathname) {
            pageview(pathname);
        }
    }, [pathname]);

    // Global click listener for automated tracking
    useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const element = target.closest('a, button') as HTMLElement; // Find closest link or button

            if (!element) return; // Ignore clicks that aren't on links or buttons

            // 1. Custom defined GTM Event via HTML attributes
            const gtmEvent = element.getAttribute('data-gtm-event');
            if (gtmEvent) {
                event(gtmEvent, {
                    link_text: element.innerText || element.getAttribute('title') || '',
                    link_url: element.getAttribute('href') || ''
                });
                return; // Prioritize explicit custom event over default ones
            }

            // 2. Auto-detect Phone calls and Email clicks
            if (element.tagName === 'A') {
                const href = element.getAttribute('href');
                if (href?.startsWith('tel:')) {
                    event('phone_click', {
                        link_type: 'phone',
                        link_value: href.replace('tel:', '').replace(/\s+/g, '') // remove spaces from tel
                    });
                } else if (href?.startsWith('mailto:')) {
                    event('contact_link_click', {
                        link_type: 'email',
                        link_value: href.replace('mailto:', '')
                    });
                }
            }
        };

        document.addEventListener('click', handleGlobalClick);

        return () => {
            document.removeEventListener('click', handleGlobalClick);
        };
    }, []);

    return null;
}
