"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Scroll reveal matching the motion used across the site (AboutSection,
 * ServicesSection): fade up, 0.8s, triggered once just before the element
 * enters view.
 *
 * Kept as a thin client wrapper so the blog pages themselves stay server
 * components — children are rendered on the server and passed through.
 */

type Direction = "up" | "left" | "right";

const OFFSETS: Record<Direction, { x?: number; y?: number }> = {
    up: { y: 30 },
    left: { x: -50 },
    right: { x: 50 },
};

export default function Reveal({
    children,
    delay = 0,
    direction = "up",
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    direction?: Direction;
    className?: string;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, ...OFFSETS[direction] }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}
