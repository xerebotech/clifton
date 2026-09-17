import FormModal from "./FormModal";
import RichText from "./RichText";
import type { FormDoc } from "@/lib/cms";

/**
 * The call-to-action box in the article rail, under the author and contents.
 *
 * Server component, so the confirmation rich text is rendered here and handed
 * to the client dialog as a node — the Lexical renderer never ships to the
 * browser.
 */
export default function SidebarForm({
    form,
    heading,
    blurb,
}: {
    form: FormDoc;
    heading?: string | null;
    blurb?: string | null;
}) {
    if (!form.fields?.length) return null;

    return (
        <FormModal
            formID={String(form.id)}
            fields={form.fields}
            submitLabel={form.submitButtonLabel || "Submit"}
            formName={form.title || "blog-sidebar"}
            heading={heading || form.title || "Speak to an advisor"}
            blurb={blurb}
            buttonLabel={form.submitButtonLabel || "Get In Touch"}
            confirmation={
                form.confirmationMessage ? (
                    <RichText content={form.confirmationMessage} />
                ) : (
                    <p className="text-[#23312D]/70">Thank you — we will be in touch shortly.</p>
                )
            }
        />
    );
}
