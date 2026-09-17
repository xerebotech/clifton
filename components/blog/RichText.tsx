import React from "react";
import Link from "next/link";

import { mediaAlt, mediaUrl, type MediaDoc } from "@/lib/cms";

/**
 * Renders the Lexical JSON that Payload stores for a rich text field.
 *
 * Typography follows the site: Cinzel at light weight with wide tracking for
 * headings, copper (#AE9573) as the only accent, generous measure and leading.
 *
 * Only the node types this editor can produce are handled; anything
 * unrecognised falls through to its children, so a new node type degrades to
 * plain content instead of disappearing.
 */

interface LexicalNode {
    type: string;
    children?: LexicalNode[];
    [key: string]: unknown;
}

// Lexical stores text styling as a bitmask on each text node.
const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;

function renderText(node: LexicalNode, key: string): React.ReactNode {
    const text = String(node.text ?? "");
    if (!text) return null;

    const format = Number(node.format ?? 0);
    let element: React.ReactNode = text;

    if (format & IS_CODE) {
        element = (
            <code className="rounded-sm bg-[#23312D]/6 px-1.5 py-0.5 font-mono text-[0.88em] text-[#23312D]">
                {element}
            </code>
        );
    }
    if (format & IS_BOLD) element = <strong className="font-semibold text-[#23312D]">{element}</strong>;
    if (format & IS_ITALIC) element = <em>{element}</em>;
    if (format & IS_UNDERLINE) element = <u className="decoration-[#AE9573] underline-offset-4">{element}</u>;
    if (format & IS_STRIKETHROUGH) element = <s>{element}</s>;

    return <React.Fragment key={key}>{element}</React.Fragment>;
}

const CINZEL = { fontFamily: "var(--font-cinzel), serif" } as const;

const HEADING_CLASSES: Record<string, string> = {
    h1: "mt-16 mb-6 text-3xl md:text-5xl font-light leading-tight tracking-wide text-[#23312D]",
    h2: "mt-16 mb-6 text-2xl md:text-4xl font-light leading-tight tracking-wide text-[#23312D]",
    h3: "mt-12 mb-4 text-xl md:text-2xl font-light leading-snug tracking-wide text-[#23312D]",
    h4: "mt-10 mb-3 text-lg md:text-xl font-normal tracking-wide text-[#23312D]",
    h5: "mt-8 mb-3 text-base md:text-lg font-normal tracking-wide text-[#23312D]",
    h6: "mt-8 mb-3 text-xs md:text-sm font-normal uppercase tracking-[0.3em] text-[#AE9573]",
};

function linkHref(node: LexicalNode): string | null {
    const fields = (node.fields ?? {}) as {
        url?: string | null;
        linkType?: string | null;
        doc?: { value?: { slug?: string } | string } | null;
    };

    if (fields.linkType === "internal") {
        const value = fields.doc?.value;
        const slug = value && typeof value === "object" ? value.slug : null;
        return slug ? `/${slug}` : null;
    }

    return fields.url || null;
}

/**
 * The opening paragraph carries a drop cap, the way the print-style editorial
 * layouts on this site open a section. Only ever applied once per article.
 */
const DROP_CAP =
    "first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:text-[4rem] first-letter:leading-[0.8] first-letter:font-light first-letter:text-[#AE9573] md:first-letter:text-[5rem]";

function renderNode(
    node: LexicalNode,
    key: string,
    isFirstParagraph: boolean,
    headingId?: string,
): React.ReactNode {
    const children = () => renderNodes(node.children);

    switch (node.type) {
        case "text":
            return renderText(node, key);

        case "linebreak":
            return <br key={key} />;

        case "horizontalrule":
            return (
                <div key={key} className="my-14 flex items-center justify-center gap-4" role="separator">
                    <span className="h-px w-16 bg-[#23312D]/15" />
                    <span className="h-1.5 w-1.5 rotate-45 bg-[#AE9573]" />
                    <span className="h-px w-16 bg-[#23312D]/15" />
                </div>
            );

        case "paragraph": {
            if (!node.children?.length) return null;
            return (
                <p
                    key={key}
                    className={`my-6 text-[17px] leading-[1.9] text-[#23312D]/75 md:text-[19px] ${
                        isFirstParagraph ? DROP_CAP : ""
                    }`}
                >
                    {children()}
                </p>
            );
        }

        case "heading": {
            const tag = String(node.tag ?? "h2");
            const Tag = tag as keyof React.JSX.IntrinsicElements;
            const isDisplay = tag === "h1" || tag === "h2" || tag === "h3";

            return (
                <Tag
                    key={key}
                    id={headingId}
                    // Clears the site's 120px fixed header, with room to spare,
                    // when jumped to from the table of contents.
                    className={`${HEADING_CLASSES[tag] ?? HEADING_CLASSES.h2} scroll-mt-40`}
                    style={isDisplay ? CINZEL : undefined}
                >
                    {children()}
                </Tag>
            );
        }

        case "quote":
            return (
                <blockquote key={key} className="relative my-12 px-8 py-2 text-center md:px-16">
                    <span
                        aria-hidden="true"
                        className="block text-5xl leading-none text-[#AE9573]/40"
                        style={CINZEL}
                    >
                        &ldquo;
                    </span>
                    <div
                        className="mt-2 text-xl font-light leading-relaxed tracking-wide text-[#23312D] md:text-2xl"
                        style={CINZEL}
                    >
                        {children()}
                    </div>
                    <span className="mx-auto mt-6 block h-px w-16 bg-[#AE9573]" />
                </blockquote>
            );

        case "list": {
            const ordered = node.listType === "number";
            const Tag = ordered ? "ol" : "ul";
            return (
                <Tag
                    key={key}
                    className={`my-8 space-y-3 pl-6 text-[17px] leading-[1.9] text-[#23312D]/75 md:text-[19px] ${
                        ordered ? "list-decimal" : "list-disc"
                    } marker:text-[#AE9573]`}
                >
                    {children()}
                </Tag>
            );
        }

        case "listitem":
            return (
                <li key={key} className="pl-2">
                    {children()}
                </li>
            );

        case "link":
        case "autolink": {
            const href = linkHref(node);
            if (!href) return <React.Fragment key={key}>{children()}</React.Fragment>;

            const newTab = Boolean((node.fields as { newTab?: boolean } | undefined)?.newTab);
            const className =
                "text-[#23312D] underline decoration-[#AE9573] decoration-1 underline-offset-[6px] transition-colors hover:text-[#AE9573]";

            if (href.startsWith("/")) {
                return (
                    <Link key={key} href={href} className={className}>
                        {children()}
                    </Link>
                );
            }

            return (
                <a
                    key={key}
                    href={href}
                    className={className}
                    {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                    {children()}
                </a>
            );
        }

        case "upload": {
            const src = mediaUrl(node.value as MediaDoc);
            if (!src) return null;
            return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={key}
                    src={src}
                    alt={mediaAlt(node.value as MediaDoc)}
                    className="my-12 w-full rounded-sm shadow-[0_20px_50px_rgba(35,49,45,0.15)]"
                    loading="lazy"
                />
            );
        }

        default:
            return node.children?.length ? (
                <React.Fragment key={key}>{children()}</React.Fragment>
            ) : null;
    }
}

/** Concatenated text of a node's subtree — mirrors `collectText` in lib/cms. */
function nodeText(node: LexicalNode): string {
    if (node.type === "text") return String(node.text ?? "");
    return (node.children ?? []).map(nodeText).join("");
}

/**
 * `headingIds` are supplied by the page, which derived them with
 * `extractHeadings` for the table of contents. They are consumed in document
 * order under the same rules, so the anchors and the TOC cannot drift apart.
 */
function renderNodes(
    nodes: LexicalNode[] | undefined,
    dropCap = false,
    headingIds?: string[],
): React.ReactNode {
    let dropCapUsed = !dropCap;
    let headingCursor = 0;

    return (nodes ?? []).map((node, index) => {
        const isFirstParagraph =
            !dropCapUsed && node.type === "paragraph" && Boolean(node.children?.length);
        if (isFirstParagraph) dropCapUsed = true;

        let headingId: string | undefined;
        if (
            headingIds &&
            node.type === "heading" &&
            (node.tag === "h2" || node.tag === "h3") &&
            nodeText(node).trim()
        ) {
            headingId = headingIds[headingCursor];
            headingCursor += 1;
        }

        return renderNode(node, `${node.type}-${index}`, isFirstParagraph, headingId);
    });
}

export default function RichText({
    content,
    dropCap = false,
    headingIds,
}: {
    content: unknown;
    dropCap?: boolean;
    headingIds?: string[];
}) {
    const root = (content as { root?: LexicalNode } | null)?.root;
    if (!root?.children?.length) return null;

    return <>{renderNodes(root.children, dropCap, headingIds)}</>;
}
