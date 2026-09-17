"use client";

import React, { useId, useState } from "react";
import { CheckCircle, RefreshCw, Send } from "lucide-react";

import HoneypotField from "@/components/ui/HoneypotField";
import PhoneInput from "@/components/ui/PhoneInput";
import { useFormStart } from "@/lib/gtm";
import type { FormFieldDoc } from "@/lib/cms";

/**
 * Renders a Form Builder form and posts it through the local proxy.
 *
 * Styling, field sizes and the submit button deliberately match the contact
 * page form, so an enquiry started on an article feels like the same company.
 * Where the contact page hardcodes its fields, these come from the CMS — the
 * layout rules below reproduce the same result from `width` and `blockType`.
 *
 * Only the field types this CMS can produce are handled. An unknown type is
 * skipped rather than rendered as a broken input — the submission simply omits
 * it, which is better than sending a value the editor never asked for.
 */

type Values = Record<string, string | boolean>;

/** Exactly the classes used on app/contact-us/page.tsx. */
const INPUT_CLASS =
    "w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50";

const TEXTAREA_CLASS =
    "w-full min-h-[150px] p-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white resize-none text-[#23312D] placeholder:text-[#23312D]/50";

const PHONE_CLASS =
    "w-full h-14 border border-[#e8e6e3] focus-within:border-[#00594F] transition-all bg-white";

/** Form Builder stores width as a percentage; anything wide gets its own row. */
const isFullWidth = (field: FormFieldDoc) => (field.width ?? 100) > 50;

const isPhone = (field: FormFieldDoc) => /phone|mobile|tel/i.test(field.name ?? "");

const initialValue = (field: FormFieldDoc): string | boolean => {
    if (field.blockType === "checkbox") return Boolean(field.defaultValue);
    return field.defaultValue == null ? "" : String(field.defaultValue);
};

export default function FormRenderer({
    formID,
    fields,
    submitLabel,
    confirmation,
    onDark = false,
    formName,
}: {
    formID: string;
    fields: FormFieldDoc[];
    submitLabel: string;
    /** Sent to the CRM as `form_name`, so sales can see which form converted. */
    formName?: string;
    /** Rendered on the server so rich text stays out of the client bundle. */
    confirmation: React.ReactNode;
    onDark?: boolean;
}) {
    // The same form can appear twice on one page — in the sidebar and in the
    // article — so element ids are scoped per instance, not per form.
    const uid = useId();
    const onFormStart = useFormStart(formName || formID);

    const inputs = fields.filter((field) => field.blockType !== "message" && field.name);

    const [values, setValues] = useState<Values>(() => {
        const next: Values = {};
        for (const field of inputs) next[field.name as string] = initialValue(field);
        return next;
    });

    const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
    const [error, setError] = useState<string | null>(null);

    const set = (name: string, value: string | boolean) =>
        setValues((prev) => ({ ...prev, [name]: value }));

    const labelClass = `text-sm mb-2 block font-medium ${onDark ? "text-white" : "text-[#23312D]"}`;

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status === "sending") return;

        // HoneypotField is uncontrolled; its value is read back from the DOM,
        // the same way the contact page does it.
        const decoy = event.currentTarget.elements.namedItem("website_url");
        if (decoy instanceof HTMLInputElement && decoy.value) {
            // Silently accept, so the bot learns nothing.
            setStatus("done");
            return;
        }

        setStatus("sending");
        setError(null);

        // `label` is carried for the CRM's form_responses block. The CMS
        // endpoint keeps only field/value and drops it.
        const submissionData = inputs.map((field) => ({
            field: field.name as string,
            label: field.label ?? undefined,
            value: String(values[field.name as string] ?? ""),
        }));

        try {
            const res = await fetch(`/api/forms/${formID}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    submissionData,
                    formName,
                    pageUrl: typeof window === "undefined" ? undefined : window.location.href,
                }),
            });

            if (res.ok) {
                setStatus("done");
                return;
            }

            const payload = await res.json().catch(() => ({}));
            setError(
                res.status === 429
                    ? "Too many submissions. Please try again in a minute."
                    : payload?.error || "Something went wrong. Please try again.",
            );
            setStatus("error");
        } catch {
            setError("We could not reach the server. Please check your connection.");
            setStatus("error");
        }
    };

    if (status === "done") {
        return (
            <div
                className={`flex flex-col items-center justify-center py-16 text-center ${
                    onDark ? "text-white" : "text-[#23312D]"
                }`}
            >
                <CheckCircle className="mb-6 h-16 w-16 text-[#3B5B5D]" />
                <p className="text-2xl" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                    Thank You!
                </p>
                <div className={`mt-2 ${onDark ? "text-white/70" : "text-[#A5A19D]"}`}>
                    {confirmation}
                </div>
            </div>
        );
    }

    return (
        <form
            id={`form-${uid}`}
            onSubmit={handleSubmit}
            onFocusCapture={onFormStart}
            className="grid gap-6 md:grid-cols-2"
        >
            <HoneypotField />

            {fields.map((field, index) => {
                const name = field.name as string;
                const id = `${uid}-${name || index}`;
                const required = Boolean(field.required);
                const span = isFullWidth(field) ? "md:col-span-2" : "";

                const label = (
                    <label htmlFor={id} className={labelClass}>
                        {field.label}
                        {required && " *"}
                    </label>
                );

                switch (field.blockType) {
                    case "message":
                        return null;

                    case "checkbox":
                        return (
                            <label
                                key={id}
                                htmlFor={id}
                                className={`flex cursor-pointer items-start gap-3 text-sm md:col-span-2 ${
                                    onDark ? "text-white/80" : "text-[#23312D]"
                                }`}
                            >
                                <input
                                    id={id}
                                    name={name}
                                    type="checkbox"
                                    required={required}
                                    checked={Boolean(values[name])}
                                    onChange={(event) => set(name, event.target.checked)}
                                    className="mt-1 h-4 w-4 accent-[#00594F]"
                                />
                                <span>
                                    {field.label}
                                    {required && " *"}
                                </span>
                            </label>
                        );

                    case "select":
                        return (
                            <div key={id} className={span}>
                                {label}
                                <select
                                    id={id}
                                    name={name}
                                    required={required}
                                    value={String(values[name] ?? "")}
                                    onChange={(event) => set(name, event.target.value)}
                                    className={INPUT_CLASS}
                                >
                                    <option value="" disabled>
                                        Select {field.label}
                                    </option>
                                    {(field.options ?? []).map((option, optionIndex) => (
                                        <option key={optionIndex} value={option.value ?? ""}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );

                    case "textarea":
                        return (
                            <div key={id} className="md:col-span-2">
                                {label}
                                <textarea
                                    id={id}
                                    name={name}
                                    required={required}
                                    placeholder="Tell us about your requirements..."
                                    value={String(values[name] ?? "")}
                                    onChange={(event) => set(name, event.target.value)}
                                    className={TEXTAREA_CLASS}
                                />
                            </div>
                        );

                    case "text":
                    case "email":
                    case "number":
                    case "country":
                    case "state":
                        // Phone numbers get the country selector the contact
                        // page uses, rather than a bare text box.
                        if (isPhone(field)) {
                            return (
                                <div key={id} className={span}>
                                    {label}
                                    <PhoneInput
                                        value={String(values[name] ?? "")}
                                        onChange={(phone) => set(name, phone)}
                                        className={PHONE_CLASS}
                                    />
                                </div>
                            );
                        }

                        return (
                            <div key={id} className={span}>
                                {label}
                                <input
                                    id={id}
                                    name={name}
                                    type={
                                        field.blockType === "email"
                                            ? "email"
                                            : field.blockType === "number"
                                              ? "number"
                                              : "text"
                                    }
                                    required={required}
                                    value={String(values[name] ?? "")}
                                    onChange={(event) => set(name, event.target.value)}
                                    className={INPUT_CLASS}
                                />
                            </div>
                        );

                    default:
                        return null;
                }
            })}

            {error && (
                <p className="text-center text-sm text-red-600 md:col-span-2" role="alert">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={status === "sending"}
                className="flex h-14 w-full items-center justify-center rounded-none bg-[#00594F] font-medium uppercase tracking-widest text-white transition-all duration-500 hover:bg-[#004a3f] disabled:opacity-50 md:col-span-2"
            >
                {status === "sending" ? (
                    <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4" />
                        {submitLabel}
                    </>
                )}
            </button>
        </form>
    );
}
