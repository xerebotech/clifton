"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import FormRenderer from "./FormRenderer";
import type { FormFieldDoc } from "@/lib/cms";

/**
 * Call-to-action box that opens the enquiry form in a dialog.
 *
 * The form lives behind a click rather than sitting open in the rail: a
 * five-field form is taller than the sticky column, and a box that asks for
 * nothing until you want it reads better beside an article.
 *
 * `confirmation` arrives as an already-rendered node from the server, so the
 * Lexical renderer stays out of this client bundle.
 *
 * The overlay is portalled to document.body. This component renders inside the
 * article rail, which is `position: sticky` — and a sticky element always
 * creates a stacking context, so a `fixed` child with z-[100] is still confined
 * to it, painting below the site header and below article content that comes
 * later in the DOM.
 */

const CINZEL = { fontFamily: "var(--font-cinzel), serif" } as const;

export default function FormModal({
    formID,
    fields,
    submitLabel,
    confirmation,
    heading,
    blurb,
    buttonLabel,
    formName,
}: {
    formID: string;
    fields: FormFieldDoc[];
    submitLabel: string;
    /** Passed through to the CRM as `form_name`. */
    formName?: string;
    confirmation: React.ReactNode;
    heading: string;
    blurb?: string | null;
    buttonLabel: string;
}) {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
        };

        // Captured now rather than read in cleanup, where the ref may have moved on.
        const trigger = triggerRef.current;

        // Stop the page scrolling behind the dialog, and put focus inside it.
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", onKeyDown);
        panelRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKeyDown);
            // Send focus back where it came from, or the reader loses their place.
            trigger?.focus();
        };
    }, [open, close]);

    const dialog = (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            role="presentation"
            onClick={close}
        >
            <div className="absolute inset-0 bg-[#23312D]/70" />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${formID}-dialog-title`}
                tabIndex={-1}
                // The backdrop closes on click; the panel must not.
                onClick={(event) => event.stopPropagation()}
                className="no-scrollbar relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white p-8 shadow-2xl outline-none sm:p-10"
            >
                <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="absolute right-5 top-5 text-[#23312D]/40 transition-colors hover:text-[#AE9573]"
                >
                    <X className="h-5 w-5" />
                </button>

                <span className="block text-[10px] uppercase tracking-[0.3em] text-[#AE9573]">
                    Enquiry
                </span>

                <h2
                    id={`${formID}-dialog-title`}
                    className="mt-3 pr-8 text-2xl leading-snug text-[#23312D] md:text-3xl"
                    style={CINZEL}
                >
                    {heading}
                </h2>

                {blurb && <p className="mt-3 text-sm leading-relaxed text-[#23312D]/60">{blurb}</p>}

                <div className="mt-8">
                    <FormRenderer
                        formID={formID}
                        fields={fields}
                        submitLabel={submitLabel}
                        formName={formName}
                        confirmation={confirmation}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="bg-[#23312D] p-7 text-white">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-[#AE9573]">
                    Enquiry
                </span>

                <p className="mt-3 text-xl leading-snug" style={CINZEL}>
                    {heading}
                </p>

                {blurb && <p className="mt-3 text-[13px] leading-relaxed text-white/60">{blurb}</p>}

                <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setOpen(true)}
                    style={CINZEL}
                    className="mt-6 w-full rounded-sm border-2 border-[#AE9573] bg-[#AE9573] px-6 py-3.5 text-xs uppercase tracking-[0.2em] text-[#23312D] transition-all duration-500 hover:bg-transparent hover:text-white"
                >
                    {buttonLabel}
                </button>
            </div>

            {/* `open` can only be true after a click, so document always
                exists by the time this portal is created. */}
            {open && createPortal(dialog, document.body)}
        </>
    );
}
