import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Cache invalidation hook, called by the CMS when content changes.
 *
 * Without this, published edits take up to the 300s fetch TTL to appear — and
 * because that TTL is stale-while-revalidate, the first visitor after expiry
 * still sees the old page. Editors need Publish to mean published.
 *
 * Tags match the ones `lib/cms.ts` attaches to each fetch:
 *   posts | post:<slug> | forms | form:<id> | site-settings
 */

export const dynamic = "force-dynamic";

const SECRET = process.env.REVALIDATE_SECRET || "";

/** Only these may be purged, so a leaked secret cannot flush the whole cache. */
const ALLOWED_PREFIXES = ["posts", "post:", "forms", "form:", "site-settings"];

const isAllowed = (tag: string) =>
    ALLOWED_PREFIXES.some((prefix) =>
        prefix.endsWith(":") ? tag.startsWith(prefix) : tag === prefix,
    );

/** Constant-time compare so the secret cannot be recovered by timing. */
function secretMatches(provided: string | undefined): boolean {
    if (!provided) return false;

    const a = Buffer.from(provided);
    const b = Buffer.from(SECRET);

    // timingSafeEqual throws on length mismatch, which would itself leak length.
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
    if (!SECRET) {
        return NextResponse.json({ error: "Revalidation is not configured" }, { status: 503 });
    }

    const provided =
        request.headers.get("x-revalidate-secret") ??
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!secretMatches(provided ?? undefined)) {
        return new NextResponse(null, { status: 401 });
    }

    let body: { tags?: unknown };
    try {
        body = (await request.json()) as { tags?: unknown };
    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const requested = Array.isArray(body.tags)
        ? body.tags.filter((tag): tag is string => typeof tag === "string" && tag.length > 0)
        : [];

    if (!requested.length) {
        return NextResponse.json({ error: "tags must be a non-empty array." }, { status: 400 });
    }

    const revalidated: string[] = [];
    const rejected: string[] = [];

    for (const tag of requested) {
        if (!isAllowed(tag)) {
            rejected.push(tag);
            continue;
        }

        // `{ expire: 0 }` rather than a bare call: Next 16 deprecates the
        // single-argument form, and the documented alternative "max" is a
        // stale-while-revalidate profile that would still serve the old page to
        // the next visitor. An explicit zero-expire profile takes the same
        // immediate-purge path as the legacy call, without the warning.
        revalidateTag(tag, { expire: 0 });
        revalidated.push(tag);
    }

    // The sitemap is a route, not a tagged fetch, so tag purging never reaches it.
    if (revalidated.some((tag) => tag === "posts" || tag.startsWith("post:"))) {
        revalidatePath("/sitemap.xml");
    }

    return NextResponse.json({ revalidated, rejected, at: Date.now() });
}
