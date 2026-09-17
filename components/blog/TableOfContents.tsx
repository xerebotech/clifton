"use client";

import React, { useEffect, useState } from "react";

import type { TocItem } from "@/lib/cms";

/**
 * Table of contents with a scroll spy.
 *
 * Position is derived from a scroll listener rather than IntersectionObserver:
 * the article has long sections, so at any moment there may be no heading
 * intersecting at all, and an observer would leave nothing highlighted. Taking
 * the last heading above the reading line always yields an answer.
 */

/**
 * Distance below the viewport top that counts as "currently reading". Sits
 * below the site's 120px fixed header, so a heading is only marked active once
 * it has actually cleared it.
 */
const READING_LINE = 180;

export default function TableOfContents({
    items,
    onNavigate,
}: {
    items: TocItem[];
    onNavigate?: () => void;
}) {
    const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

    useEffect(() => {
        if (!items.length) return;

        let frame = 0;

        const update = () => {
            frame = 0;

            let current = items[0].id;

            for (const item of items) {
                const element = document.getElementById(item.id);
                if (!element) continue;
                if (element.getBoundingClientRect().top <= READING_LINE) current = item.id;
            }

            // At the very bottom the last section may never reach the reading
            // line, so pin to it once the page is scrolled out.
            const atBottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 80;
            if (atBottom) current = items[items.length - 1].id;

            setActiveId(current);
        };

        const onScroll = () => {
            if (!frame) frame = window.requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        return () => {
            if (frame) window.cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [items]);

    if (!items.length) return null;

    return (
        // The heading lives in whatever opens this — currently TocDrawer — so
        // the list does not carry one of its own.
        <nav aria-label="Table of contents">
            <ul className="space-y-1 border-l border-[#23312D]/10">
                {items.map((item) => {
                    const isActive = item.id === activeId;

                    return (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                onClick={onNavigate}
                                aria-current={isActive ? "true" : undefined}
                                className={`-ml-px block border-l py-2 text-[13px] leading-snug transition-colors duration-300 ${
                                    item.level === 3 ? "pl-8" : "pl-5"
                                } ${
                                    isActive
                                        ? "border-[#AE9573] text-[#23312D]"
                                        : "border-transparent text-[#23312D]/45 hover:text-[#AE9573]"
                                }`}
                            >
                                {item.text}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
