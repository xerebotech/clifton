"use client";

import { HONEYPOT_FIELD } from '@/lib/inquiryService';

/**
 * Invisible decoy input. Bots fill every field they can find; a human never
 * sees this one, so the CRM endpoint silently discards any submission that
 * arrives with a value in it.
 *
 * Positioned off-screen rather than `display: none` — the latter is trivial for
 * a bot to detect and skip. `aria-hidden` + `tabIndex={-1}` keep it out of the
 * tab order and away from screen readers.
 *
 * Render it inside a <form> whose id is the same formId passed to
 * submitInquiry; the value is read back from the DOM at submit time, so the
 * form needs no extra state of its own.
 */
export default function HoneypotField() {
    return (
        <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
        />
    );
}
