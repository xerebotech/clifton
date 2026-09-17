import Link from "next/link";

import RichText from "./RichText";
import Reveal from "./Reveal";
import FormRenderer from "./FormRenderer";
import StatsCounter from "./StatsCounter";
import {
    getForm,
    mediaAlt,
    mediaUrl,
    plainText,
    populated,
    type FormDoc,
    type LayoutBlock,
    type MediaDoc,
} from "@/lib/cms";

/**
 * Renders the block-based `layout` a post carries in the CMS, in the site's
 * own visual language — Cinzel display type at light weight, copper accents,
 * cream section bands and the standard scroll reveal.
 *
 * An unknown blockType renders nothing rather than throwing, so adding a block
 * in the CMS before it is supported here degrades quietly.
 */

const CINZEL = { fontFamily: "var(--font-cinzel), serif" } as const;

interface CMSLink {
    label?: string | null;
    type?: string | null;
    page?: { slug?: string | null } | string | null;
    url?: string | null;
    newTab?: boolean | null;
}

/**
 * Internal links point at CMS Pages. This site routes only /blog from the CMS,
 * so a page link resolves to /<slug> and will 404 unless that route also exists
 * here — worth knowing before using them in post content.
 */
function resolveLink(link: CMSLink | null | undefined): { href: string; newTab: boolean } | null {
    if (!link?.label) return null;

    if (link.type === "external") {
        return link.url ? { href: link.url, newTab: Boolean(link.newTab) } : null;
    }

    const page = populated<{ slug?: string | null }>(link.page);
    return page?.slug ? { href: `/${page.slug}`, newTab: Boolean(link.newTab) } : null;
}

/** The site's button: copper fill that empties out on hover over 500ms. */
function LinkButton({
    link,
    variant,
    onDark = false,
}: {
    link: CMSLink;
    variant: "solid" | "outline";
    onDark?: boolean;
}) {
    const resolved = resolveLink(link);
    if (!resolved) return null;

    // Cinzel at normal weight, matching the headings. The site's older
    // buttons use Geist font-black; the blog deliberately does not.
    const base =
        "inline-block px-10 py-4 text-sm uppercase tracking-[0.2em] rounded-sm transition-all duration-500";

    const className =
        variant === "solid"
            ? `${base} border-2 border-[#AE9573] bg-[#AE9573] text-[#23312D] hover:bg-transparent ${
                  onDark ? "hover:text-white" : "hover:text-[#23312D]"
              }`
            : `${base} border-2 ${
                  onDark
                      ? "border-white/40 text-white hover:border-[#AE9573] hover:text-[#AE9573]"
                      : "border-[#23312D]/20 text-[#23312D] hover:border-[#AE9573] hover:text-[#AE9573]"
              }`;

    if (resolved.href.startsWith("/") && !resolved.newTab) {
        return (
            <Link href={resolved.href} className={className} style={CINZEL}>
                {link.label}
            </Link>
        );
    }

    return (
        <a
            href={resolved.href}
            className={className}
            style={CINZEL}
            {...(resolved.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
            {link.label}
        </a>
    );
}

const WIDTHS: Record<string, string> = {
    normal: "max-w-2xl",
    wide: "max-w-4xl",
};

const MEDIA_WIDTHS: Record<string, string> = {
    normal: "max-w-3xl",
    wide: "max-w-5xl",
    full: "max-w-none",
};

const GALLERY_COLUMNS: Record<string, string> = {
    "2": "sm:grid-cols-2",
    "3": "sm:grid-cols-2 lg:grid-cols-3",
    "4": "sm:grid-cols-2 lg:grid-cols-4",
};

function HeroBlock({ block }: { block: LayoutBlock }) {
    const heading = String(block.heading ?? "");
    const subheading = block.subheading ? String(block.subheading) : null;
    const background = mediaUrl(block.background as MediaDoc);
    const centered = block.alignment === "center";
    const links = (block.links ?? []) as { link?: CMSLink }[];

    return (
        <section className="relative my-20 overflow-hidden bg-[#23312D] px-6 py-24 text-white md:px-16 md:py-32">
            {background && (
                <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={background}
                        alt={mediaAlt(block.background as MediaDoc)}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                    />
                    {/* Brand wash, matching the About and Contact page heroes. */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#23312D]/95 to-[#23312D]/75" />
                </>
            )}

            <Reveal className={`relative mx-auto max-w-4xl ${centered ? "text-center" : ""}`}>
                <h2
                    className="text-3xl font-light leading-tight tracking-wide md:text-5xl"
                    style={CINZEL}
                >
                    {heading}
                </h2>
                {subheading && (
                    <p className="mt-6 text-lg font-light leading-relaxed text-white/75">
                        {subheading}
                    </p>
                )}
                {links.length > 0 && (
                    <div className={`mt-10 flex flex-wrap gap-4 ${centered ? "justify-center" : ""}`}>
                        {links.map((row, index) =>
                            row.link ? (
                                <LinkButton
                                    key={index}
                                    link={row.link}
                                    variant={index === 0 ? "solid" : "outline"}
                                    onDark
                                />
                            ) : null,
                        )}
                    </div>
                )}
            </Reveal>
        </section>
    );
}

function MediaBlock({ block }: { block: LayoutBlock }) {
    const src = mediaUrl(block.media as MediaDoc);
    if (!src) return null;

    const size = String(block.size ?? "normal");
    const caption = block.caption ? String(block.caption) : null;

    return (
        <Reveal>
            <figure className={`mx-auto my-16 ${MEDIA_WIDTHS[size] ?? MEDIA_WIDTHS.normal}`}>
                <div className="relative">
                    {/* Offset block behind the image, as on the About section. */}
                    <span
                        aria-hidden="true"
                        className="absolute -bottom-4 -right-4 hidden h-32 w-32 bg-[#F2F0EB] md:block"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={mediaAlt(block.media as MediaDoc, caption ?? "")}
                        className="relative z-10 w-full rounded-sm shadow-[0_20px_50px_rgba(35,49,45,0.15)]"
                        loading="lazy"
                    />
                </div>
                {caption && (
                    <figcaption className="relative z-10 mt-5 text-center text-xs uppercase tracking-[0.2em] text-[#AE9573]">
                        {caption}
                    </figcaption>
                )}
            </figure>
        </Reveal>
    );
}

function GalleryBlock({ block }: { block: LayoutBlock }) {
    const items = (block.items ?? []) as { image?: MediaDoc | string; caption?: string | null }[];
    if (!items.length) return null;

    const columns = String(block.columns ?? "3");
    const heading = block.heading ? String(block.heading) : null;

    return (
        <section className="my-20 bg-[#F2F0EB] px-6 py-16 md:py-20">
            <div className="mx-auto max-w-6xl">
                {heading && (
                    <Reveal>
                        <h3
                            className="mb-10 text-center text-2xl font-light tracking-wide text-[#23312D] md:text-4xl"
                            style={CINZEL}
                        >
                            {heading}
                        </h3>
                    </Reveal>
                )}
                <div className={`grid grid-cols-1 gap-6 ${GALLERY_COLUMNS[columns] ?? GALLERY_COLUMNS["3"]}`}>
                    {items.map((item, index) => {
                        const src = mediaUrl(item.image);
                        if (!src) return null;

                        return (
                            <Reveal key={index} delay={index * 0.08}>
                                <figure className="group overflow-hidden">
                                    <div className="overflow-hidden rounded-sm">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={src}
                                            alt={mediaAlt(item.image, item.caption ?? "")}
                                            className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    {item.caption && (
                                        <figcaption className="mt-3 text-xs uppercase tracking-[0.2em] text-[#AE9573]">
                                            {item.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function CTABlock({ block }: { block: LayoutBlock }) {
    const links = (block.links ?? []) as { link?: CMSLink }[];
    const body = block.body ? String(block.body) : null;

    return (
        <section className="my-20 bg-[#23312D] px-6 py-20 text-white md:py-24">
            <Reveal className="mx-auto max-w-3xl text-center">
                <span className="text-sm uppercase tracking-[0.3em] text-[#AE9573]">
                    Clifton Capital
                </span>
                <h3
                    className="mt-5 text-3xl font-light leading-tight tracking-wide md:text-4xl"
                    style={CINZEL}
                >
                    {String(block.heading ?? "")}
                </h3>
                {body && (
                    <p className="mx-auto mt-6 max-w-xl font-light leading-relaxed text-white/70">
                        {body}
                    </p>
                )}
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    {links.map((row, index) =>
                        row.link ? (
                            <LinkButton
                                key={index}
                                link={row.link}
                                variant={index === 0 ? "solid" : "outline"}
                                onDark
                            />
                        ) : null,
                    )}
                </div>
            </Reveal>
        </section>
    );
}

function TableRenderer({ block }: { block: LayoutBlock }) {
    const columns = (block.columns ?? []) as { label?: string | null; align?: string | null }[];
    const rows = (block.rows ?? []) as { cells?: { value?: string | null }[] | null }[];

    if (!columns.length || !rows.length) return null;

    const caption = block.caption ? String(block.caption) : null;
    const footnote = block.footnote ? String(block.footnote) : null;

    return (
        <Reveal>
            <div className="mx-auto my-16 max-w-4xl">
                {caption && (
                    <span className="mb-5 block text-[10px] uppercase tracking-[0.3em] text-[#AE9573]">
                        {caption}
                    </span>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b-2 border-[#AE9573]">
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className={`whitespace-nowrap px-4 py-4 text-[10px] font-normal uppercase tracking-[0.2em] text-[#23312D]/55 ${
                                            column.align === "right" ? "text-right" : "text-left"
                                        }`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-b border-[#23312D]/8">
                                    {/* Driven by `columns`, so a short row pads
                                        rather than collapsing the table. */}
                                    {columns.map((column, cellIndex) => {
                                        const value = row.cells?.[cellIndex]?.value ?? "";
                                        const isFirst = cellIndex === 0;

                                        return (
                                            <td
                                                key={cellIndex}
                                                className={`px-4 py-4 text-[15px] ${
                                                    column.align === "right" ? "text-right" : "text-left"
                                                } ${isFirst ? "text-[#23312D]" : "text-[#23312D]/70"}`}
                                            >
                                                {value}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {footnote && (
                    <p className="mt-4 text-xs leading-relaxed text-[#23312D]/45">{footnote}</p>
                )}
            </div>
        </Reveal>
    );
}

function StatsRenderer({ block }: { block: LayoutBlock }) {
    const items = (block.items ?? []) as { value?: string | null; label?: string | null }[];
    if (!items.length) return null;

    const heading = block.heading ? String(block.heading) : null;

    return (
        <section className="my-20 bg-[#F2F0EB] px-6 py-16 md:py-20">
            <div className="mx-auto max-w-5xl">
                {heading && (
                    <Reveal>
                        <h3
                            className="mb-12 text-center text-2xl font-light tracking-wide text-[#23312D] md:text-3xl"
                            style={CINZEL}
                        >
                            {heading}
                        </h3>
                    </Reveal>
                )}

                <div
                    className={`grid gap-10 text-center ${
                        items.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3"
                    }`}
                >
                    {items.map((item, index) => (
                        <Reveal key={index} delay={index * 0.1}>
                            <span
                                className="block text-4xl font-light text-[#23312D] md:text-5xl"
                                style={CINZEL}
                            >
                                <StatsCounter value={String(item.value ?? "")} />
                            </span>
                            <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#AE9573] md:text-xs">
                                {item.label}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQRenderer({ block }: { block: LayoutBlock }) {
    const items = (block.items ?? []) as { question?: string | null; answer?: unknown }[];
    const valid = items.filter((item) => item?.question);
    if (!valid.length) return null;

    const heading = block.heading ? String(block.heading) : null;

    // Google reads this for the expandable-answers treatment in search results.
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: valid.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
        })),
    };

    return (
        <section className="mx-auto my-20 max-w-3xl px-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {heading && (
                <Reveal>
                    <h3
                        className="mb-10 text-center text-2xl font-light tracking-wide text-[#23312D] md:text-3xl"
                        style={CINZEL}
                    >
                        {heading}
                    </h3>
                </Reveal>
            )}

            <div className="border-t border-[#23312D]/10">
                {valid.map((item, index) => (
                    <details key={index} className="group border-b border-[#23312D]/10">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                            <span
                                className="text-lg font-light leading-snug tracking-wide text-[#23312D] transition-colors group-hover:text-[#AE9573] md:text-xl"
                                style={CINZEL}
                            >
                                {item.question}
                            </span>
                            <span
                                aria-hidden="true"
                                className="relative h-4 w-4 shrink-0 text-[#AE9573] transition-transform duration-300 group-open:rotate-45"
                            >
                                <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                                <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current" />
                            </span>
                        </summary>
                        <div className="pb-6 pr-10">
                            <RichText content={item.answer} />
                        </div>
                    </details>
                ))}
            </div>
        </section>
    );
}

function CalloutRenderer({ block }: { block: LayoutBlock }) {
    const body = block.body ? String(block.body) : null;
    if (!body) return null;

    const label = block.label ? String(block.label) : null;
    const navy = block.tone === "navy";

    return (
        <Reveal>
            <aside
                className={`mx-auto my-14 max-w-2xl border-l-2 px-8 py-8 md:px-10 ${
                    navy
                        ? "border-[#AE9573] bg-[#23312D] text-white"
                        : "border-[#AE9573] bg-[#AE9573]/8 text-[#23312D]"
                }`}
            >
                {label && (
                    <span className="block text-[10px] uppercase tracking-[0.3em] text-[#AE9573]">
                        {label}
                    </span>
                )}
                <p
                    className={`mt-4 text-lg font-light leading-relaxed tracking-wide md:text-xl ${
                        navy ? "text-white" : "text-[#23312D]"
                    }`}
                    style={CINZEL}
                >
                    {body}
                </p>
            </aside>
        </Reveal>
    );
}

function AdvisorCTARenderer({ block }: { block: LayoutBlock }) {
    const photo = mediaUrl(block.photo as MediaDoc);
    const links = (block.links ?? []) as { link?: CMSLink }[];
    const body = block.body ? String(block.body) : null;
    const role = block.role ? String(block.role) : null;
    const imageRight = block.imageSide === "right";

    return (
        <section className="my-20 bg-[#F2F0EB] px-6 py-16 md:py-20">
            <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
                <Reveal
                    direction={imageRight ? "right" : "left"}
                    className={`relative ${imageRight ? "md:order-2" : ""}`}
                >
                    <span
                        aria-hidden="true"
                        className={`absolute hidden h-32 w-32 bg-[#23312D] md:block ${
                            imageRight ? "-bottom-5 -left-5" : "-bottom-5 -right-5"
                        }`}
                    />
                    {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={photo}
                            alt={mediaAlt(block.photo as MediaDoc, String(block.name ?? ""))}
                            className="relative z-10 aspect-[4/5] w-full rounded-sm object-cover"
                            loading="lazy"
                        />
                    ) : null}
                </Reveal>

                <Reveal
                    direction={imageRight ? "left" : "right"}
                    delay={0.15}
                    className={imageRight ? "md:order-1" : ""}
                >
                    <h3
                        className="text-2xl font-light leading-tight tracking-wide text-[#23312D] md:text-4xl"
                        style={CINZEL}
                    >
                        {String(block.heading ?? "")}
                    </h3>

                    {body && (
                        <p className="mt-5 leading-relaxed text-[#23312D]/70">{body}</p>
                    )}

                    <div className="mt-8 border-t border-[#23312D]/10 pt-6">
                        <p
                            className="text-lg font-light tracking-wide text-[#23312D]"
                            style={CINZEL}
                        >
                            {String(block.name ?? "")}
                        </p>
                        {role && (
                            <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#AE9573]">
                                {role}
                            </p>
                        )}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        {links.map((row, index) =>
                            row.link ? (
                                <LinkButton
                                    key={index}
                                    link={row.link}
                                    variant={index === 0 ? "solid" : "outline"}
                                />
                            ) : null,
                        )}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

const FORM_BACKGROUNDS: Record<string, string> = {
    cream: "bg-[#F2F0EB]",
    white: "bg-white",
    navy: "bg-[#23312D]",
};

async function FormBlockRenderer({ block }: { block: LayoutBlock }) {
    const inline = populated<FormDoc>(block.form as FormDoc | string);

    // At depth 2 the relationship arrives populated. Fall back to a fetch when
    // it does not, so the block still works if the depth ever changes.
    const form = inline?.fields
        ? inline
        : await getForm(String(inline?.id ?? (block.form as string) ?? ""));

    if (!form?.fields?.length) return null;

    const background = String(block.background ?? "cream");
    const onDark = background === "navy";
    const heading = block.heading ? String(block.heading) : form.title;
    const intro = block.intro ? String(block.intro) : null;

    // Message fields are rich text, so they render here rather than inside the
    // client component. They are collected above the inputs rather than kept
    // in field order — worth knowing if a form interleaves them.
    const messages = form.fields.filter((field) => field.blockType === "message");

    return (
        <section className={`my-20 px-6 py-16 md:py-20 ${FORM_BACKGROUNDS[background] ?? FORM_BACKGROUNDS.cream}`}>
            <div className="mx-auto max-w-2xl">
                {heading && (
                    <Reveal>
                        <h3
                            className={`text-2xl md:text-3xl ${onDark ? "text-white" : "text-[#23312D]"}`}
                            style={CINZEL}
                        >
                            {heading}
                        </h3>
                    </Reveal>
                )}

                {intro && (
                    <p className={`mt-4 leading-relaxed ${onDark ? "text-white/70" : "text-[#23312D]/70"}`}>
                        {intro}
                    </p>
                )}

                {messages.map((field, index) => (
                    <div key={index} className="mt-4">
                        <RichText content={field.message} />
                    </div>
                ))}

                <div className="mt-10">
                    <FormRenderer
                        formID={String(form.id)}
                        fields={form.fields}
                        submitLabel={form.submitButtonLabel || "Submit"}
                        formName={form.title || "blog-article"}
                        onDark={onDark}
                        confirmation={
                            form.confirmationMessage ? (
                                <RichText content={form.confirmationMessage} />
                            ) : (
                                <p className={onDark ? "text-white/80" : "text-[#23312D]/70"}>
                                    Thank you — we will be in touch shortly.
                                </p>
                            )
                        }
                    />
                </div>
            </div>
        </section>
    );
}

function Block({
    block,
    dropCap,
    headingIds,
}: {
    block: LayoutBlock;
    dropCap: boolean;
    headingIds?: string[];
}) {
    switch (block.blockType) {
        case "hero":
            return <HeroBlock block={block} />;

        case "richText": {
            const width = String(block.width ?? "normal");
            return (
                <div className={`mx-auto ${WIDTHS[width] ?? WIDTHS.normal}`}>
                    <RichText content={block.content} dropCap={dropCap} headingIds={headingIds} />
                </div>
            );
        }

        case "mediaBlock":
            return <MediaBlock block={block} />;

        case "gallery":
            return <GalleryBlock block={block} />;

        case "table":
            return <TableRenderer block={block} />;

        case "stats":
            return <StatsRenderer block={block} />;

        case "faq":
            return <FAQRenderer block={block} />;

        case "callout":
            return <CalloutRenderer block={block} />;

        case "cta":
            return <CTABlock block={block} />;

        case "advisorCta":
            return <AdvisorCTARenderer block={block} />;

        case "formBlock":
            return <FormBlockRenderer block={block} />;

        default:
            return null;
    }
}

export default function Blocks({
    layout,
    headingIds,
}: {
    layout: LayoutBlock[] | null | undefined;
    /** Anchor ids per layout block, from `extractHeadings`. */
    headingIds?: string[][];
}) {
    if (!layout?.length) return null;

    // The drop cap opens the article, so only the first prose block gets one.
    const firstRichTextIndex = layout.findIndex((block) => block.blockType === "richText");

    return (
        <>
            {layout.map((block, index) => (
                <Block
                    key={block.id ?? `${block.blockType}-${index}`}
                    block={block}
                    dropCap={index === firstRichTextIndex}
                    headingIds={headingIds?.[index]}
                />
            ))}
        </>
    );
}
