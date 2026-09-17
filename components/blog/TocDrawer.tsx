"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, X } from "lucide-react";

import TableOfContents from "./TableOfContents";
import type { TocItem } from "@/lib/cms";

/**
 * Table of contents behind a tab fixed to the left edge of the screen.
 *
 * Keeping the contents out of the article rail leaves the byline and the
 * enquiry CTA room to sit at their natural height, and makes the list
 * reachable from anywhere in the article rather than only while the rail is
 * in view.
 *
 * The list is mounted only while the drawer is open, so its scroll listener
 * does no work the rest of the time.
 */

const CINZEL = { fontFamily: "var(--font-cinzel), serif" } as const;

export default function TocDrawer({ items }: { items: TocItem[] }) {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const tabRef = useRef<HTMLButtonElement>(null);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };

        const tab = tabRef.current;
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);
        panelRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKeyDown);
            tab?.focus();
        };
    }, [open, close]);

    if (!items.length) return null;

    return (
        <>
            {/* z-index note: the site header is fixed at z-50, so the backdrop
                (60) and panel (70) deliberately sit above it. The tab stays
                below, where it never overlaps the header anyway. */}
            <button
                ref={tabRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-label="Open the table of contents"
                className="fixed left-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2 rounded-r-sm bg-[#23312D] py-5 pl-3 pr-2.5 text-[#AE9573] shadow-lg transition-colors duration-300 hover:bg-[#AE9573] hover:text-[#23312D]"
            >
                <List className="h-4 w-4 shrink-0" />
                <span
                    className="text-[10px] uppercase tracking-[0.3em]"
                    // Reads bottom-to-top, so the tab stays narrow.
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                    Contents
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-[60] bg-[#23312D]/60"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={close}
                        />

                        <motion.div
                            ref={panelRef}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Table of contents"
                            tabIndex={-1}
                            // Sized to its contents and centred on the tab,
                            // rather than a full-height sidebar that is mostly
                            // empty under ten headings. y is animated too,
                            // because motion owns the whole transform and would
                            // otherwise drop the vertical centring.
                            className="no-scrollbar fixed left-0 top-1/2 z-[70] max-h-[80vh] w-[85vw] max-w-[320px] overflow-y-auto rounded-r-sm bg-white px-8 py-9 shadow-2xl outline-none"
                            initial={{ x: "-100%", y: "-50%" }}
                            animate={{ x: 0, y: "-50%" }}
                            exit={{ x: "-100%", y: "-50%" }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <span className="block text-[10px] uppercase tracking-[0.3em] text-[#AE9573]">
                                        In This Article
                                    </span>
                                    <p
                                        className="mt-2 text-xl leading-snug text-[#23312D]"
                                        style={CINZEL}
                                    >
                                        Contents
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={close}
                                    aria-label="Close"
                                    className="mt-1 text-[#23312D]/40 transition-colors hover:text-[#AE9573]"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Closing on navigate: the anchor jump happens first,
                                then the drawer gets out of the way. */}
                            <TableOfContents items={items} onNavigate={close} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
