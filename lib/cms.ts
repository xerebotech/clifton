/**
 * Read-only client for the multi-tenant Payload CMS that serves this site.
 *
 * Server-side only — CMS_API_KEY must never reach the browser, so nothing in
 * here may be imported from a "use client" component.
 *
 * The CMS identifies us by API key: the key belongs to a service user holding a
 * single tenant-viewer membership for Clifton, so every response is already
 * scoped to this tenant and filtered to published documents.
 */

const CMS_URL = (process.env.CMS_URL || "http://localhost:3000").replace(/\/$/, "");
const CMS_API_KEY = process.env.CMS_API_KEY || "";

/** How long a CMS response is reused before Next refetches it, in seconds. */
const REVALIDATE = 300;

export const cmsConfigured = Boolean(CMS_API_KEY);

export interface MediaDoc {
    id?: string;
    url?: string | null;
    alt?: string | null;
    width?: number | null;
    height?: number | null;
    mimeType?: string | null;
}

export interface CategoryDoc {
    id?: string;
    title?: string | null;
    slug?: string | null;
}

export interface PostSummary {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: MediaDoc | string | null;
    categories?: (CategoryDoc | string)[] | null;
    publishedAt?: string | null;
}

/** A block row from a post's `layout`. Shapes are narrowed in the renderer. */
export interface LayoutBlock {
    id?: string;
    blockType: string;
    [key: string]: unknown;
}

export interface AuthorDoc {
    id?: string;
    name?: string | null;
    role?: string | null;
    bio?: string | null;
    photo?: MediaDoc | string | null;
    links?: { label?: string | null; url?: string | null }[] | null;
}

export interface PostDoc extends PostSummary {
    author?: AuthorDoc | string | null;
    layout?: LayoutBlock[] | null;
    updatedAt?: string | null;
    meta?: {
        title?: string | null;
        description?: string | null;
        image?: MediaDoc | string | null;
    } | null;
}

export interface PostList {
    docs: PostSummary[];
    totalDocs: number;
    totalPages: number;
    page: number;
}

const EMPTY_LIST: PostList = { docs: [], totalDocs: 0, totalPages: 0, page: 1 };

/**
 * A missing key is a configuration state, not a crash: the blog renders an
 * empty state so the rest of the site keeps working.
 */
async function cmsFetch<T>(path: string, tags: string[]): Promise<T | null> {
    if (!CMS_API_KEY) {
        console.warn("[cms] CMS_API_KEY is not set — skipping request for", path);
        return null;
    }

    try {
        const res = await fetch(`${CMS_URL}${path}`, {
            headers: { Authorization: `users API-Key ${CMS_API_KEY}` },
            // The endpoints send Cache-Control: no-store, so caching is opted
            // into explicitly here rather than inherited from the response.
            next: { revalidate: REVALIDATE, tags },
        });

        if (res.status === 404) return null;

        if (!res.ok) {
            console.error(`[cms] ${res.status} ${res.statusText} for ${path}`);
            return null;
        }

        return (await res.json()) as T;
    } catch (error) {
        console.error(`[cms] request failed for ${path}:`, error);
        return null;
    }
}

export async function getPosts(options: {
    page?: number;
    limit?: number;
    category?: string;
} = {}): Promise<PostList> {
    const { page = 1, limit = 9, category } = options;

    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) query.set("category", category);

    const result = await cmsFetch<PostList>(`/api/public/posts?${query}`, ["posts"]);
    return result ?? EMPTY_LIST;
}

/** One field of a Form Builder form. `blockType` decides how it renders. */
export interface FormFieldDoc {
    id?: string;
    blockType?: string;
    name?: string;
    label?: string | null;
    required?: boolean | null;
    width?: number | null;
    defaultValue?: string | number | boolean | null;
    options?: { label?: string | null; value?: string | null }[] | null;
    message?: unknown;
}

export interface FormDoc {
    id: string;
    title?: string | null;
    fields?: FormFieldDoc[] | null;
    submitButtonLabel?: string | null;
    confirmationType?: string | null;
    confirmationMessage?: unknown;
}

export interface SiteSettingsDoc {
    siteName?: string | null;
    tagline?: string | null;
    contactEmail?: string | null;
    /** Populated at depth 1 by the endpoint, so the form arrives with its fields. */
    sidebarForm?: FormDoc | string | null;
    sidebarFormHeading?: string | null;
    sidebarFormBlurb?: string | null;
}

export async function getSiteSettings(): Promise<SiteSettingsDoc | null> {
    return cmsFetch<SiteSettingsDoc>("/api/public/site-settings", ["site-settings"]);
}

export async function getForm(id: string): Promise<FormDoc | null> {
    return cmsFetch<FormDoc>(`/api/public/forms/${encodeURIComponent(id)}`, ["forms", `form:${id}`]);
}

export async function getPost(slug: string): Promise<PostDoc | null> {
    return cmsFetch<PostDoc>(`/api/public/posts/${encodeURIComponent(slug)}`, [
        "posts",
        `post:${slug}`,
    ]);
}

/** Relationship fields arrive as an ID or a populated document, depending on depth. */
export function populated<T extends object>(value: T | string | null | undefined): T | null {
    return value && typeof value === "object" ? value : null;
}

export function categoriesOf(post: PostSummary): CategoryDoc[] {
    return (post.categories ?? [])
        .map((c) => populated<CategoryDoc>(c))
        .filter((c): c is CategoryDoc => Boolean(c?.slug));
}

/**
 * Media reads in the CMS are tenant-scoped, so a browser requesting the file
 * directly gets a 403 — the API key lives on the server. Every image is
 * rewritten to the local proxy in app/api/cms-media, which attaches the key.
 */
export function mediaUrl(media: MediaDoc | string | null | undefined): string | null {
    const doc = populated<MediaDoc>(media);
    if (!doc?.url) return null;

    const filename = doc.url.split("/").pop();
    if (!filename) return null;

    return `/api/cms-media/${encodeURIComponent(filename)}`;
}

export function mediaAlt(media: MediaDoc | string | null | undefined, fallback = ""): string {
    return populated<MediaDoc>(media)?.alt || fallback;
}

/** Collects every `text` node in a Lexical tree, for word counting. */
function collectText(node: unknown, out: string[]): void {
    if (!node || typeof node !== "object") return;

    const candidate = node as { type?: string; text?: string; children?: unknown[] };

    if (candidate.type === "text" && typeof candidate.text === "string") out.push(candidate.text);
    if (Array.isArray(candidate.children)) {
        for (const child of candidate.children) collectText(child, out);
    }
}

/** Flattens a Lexical value to plain text — used for structured data. */
export function plainText(content: unknown): string {
    const words: string[] = [];
    collectText((content as { root?: unknown } | null)?.root, words);
    return words.join("").replace(/\s+/g, " ").trim();
}

export interface TocItem {
    id: string;
    text: string;
    level: 2 | 3;
}

function slugifyHeading(value: string): string {
    return (
        value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 60) || "section"
    );
}

/**
 * Pulls the h2/h3 headings out of a post's rich text for the table of contents.
 *
 * Also returns the ids grouped by layout block, so RichText can stamp exactly
 * the same ids onto the rendered headings. Deriving them twice independently
 * would drift the moment two headings share a title, which is why the ids are
 * handed down rather than recomputed.
 */
export function extractHeadings(layout: LayoutBlock[] | null | undefined): {
    items: TocItem[];
    idsByBlock: string[][];
} {
    const items: TocItem[] = [];
    const idsByBlock: string[][] = [];
    const seen = new Map<string, number>();

    for (const block of layout ?? []) {
        const ids: string[] = [];

        if (block.blockType === "richText") {
            const root = (block.content as { root?: { children?: unknown[] } } | null)?.root;

            for (const child of root?.children ?? []) {
                const node = child as { type?: string; tag?: string };
                if (node.type !== "heading") continue;

                const level = node.tag === "h2" ? 2 : node.tag === "h3" ? 3 : null;
                if (!level) continue;

                const words: string[] = [];
                collectText(child, words);
                const text = words.join("").trim();
                if (!text) continue;

                const base = slugifyHeading(text);
                const count = (seen.get(base) ?? 0) + 1;
                seen.set(base, count);
                const id = count === 1 ? base : `${base}-${count}`;

                ids.push(id);
                items.push({ id, text, level: level as 2 | 3 });
            }
        }

        idsByBlock.push(ids);
    }

    return { items, idsByBlock };
}

/** Rounded-up reading time in minutes, at 200 wpm. Returns 0 for empty posts. */
export function readingTime(layout: LayoutBlock[] | null | undefined): number {
    if (!layout?.length) return 0;

    const words: string[] = [];

    for (const block of layout) {
        if (block.blockType !== "richText") continue;
        const root = (block.content as { root?: unknown } | null)?.root;
        collectText(root, words);
    }

    const count = words.join(" ").trim().split(/\s+/).filter(Boolean).length;
    return count ? Math.max(1, Math.round(count / 200)) : 0;
}

export function formatDate(value: string | null | undefined): string {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
