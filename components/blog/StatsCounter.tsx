"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Count-up figure, matching the animated counters on the About page.
 *
 * Values are authored as free text ("7.2%", "AED 1.4M", "21"), so the numeric
 * part is parsed out and animated while any prefix and suffix are held
 * constant. A value with no leading number renders as-is — worth keeping,
 * because an editor will eventually type something like "Varies".
 */

const DURATION_MS = 1800;

const PARTS = /^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/;

export default function StatsCounter({ value }: { value: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [display, setDisplay] = useState<string | null>(null);

    const match = value.match(PARTS);
    const prefix = match?.[1] ?? "";
    const raw = match?.[2] ?? "";
    const suffix = match?.[3] ?? "";

    const target = raw ? Number(raw.replace(/,/g, "")) : NaN;
    const decimals = raw.includes(".") ? (raw.split(".")[1]?.length ?? 0) : 0;
    const grouped = raw.includes(",");

    useEffect(() => {
        if (!isInView || Number.isNaN(target)) return;

        const format = (n: number) => {
            const fixed = n.toFixed(decimals);
            if (!grouped) return fixed;
            const [whole, fraction] = fixed.split(".");
            const withSeparators = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return fraction ? `${withSeparators}.${fraction}` : withSeparators;
        };

        let frame = 0;
        let start: number | null = null;

        const step = (now: number) => {
            if (start === null) start = now;
            const progress = Math.min((now - start) / DURATION_MS, 1);
            // Ease out, so the number settles rather than stopping dead.
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplay(format(target * eased));

            if (progress < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [isInView, target, decimals, grouped]);

    // Before the animation starts — and for unparseable values — show the
    // authored text, so nothing is ever blank or wrong if JS is slow.
    const body = Number.isNaN(target) || display === null ? value : `${prefix}${display}${suffix}`;

    return <span ref={ref}>{body}</span>;
}
