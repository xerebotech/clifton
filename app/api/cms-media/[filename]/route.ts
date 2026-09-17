import { NextResponse } from "next/server";

/**
 * Image proxy for CMS uploads.
 *
 * Media in the CMS is tenant-scoped, so its `read` access rule also guards the
 * file route — an anonymous browser request for an image returns 403. The API
 * key that satisfies that rule is a server-side secret, so the browser asks us
 * and we fetch the file with the key attached.
 *
 * Responses are cached at the edge rather than in Next's data cache: these are
 * binaries, and keeping them out of the data cache avoids bloating it.
 */

const CMS_URL = (process.env.CMS_URL || "http://localhost:3000").replace(/\/$/, "");
const CMS_API_KEY = process.env.CMS_API_KEY || "";

/** Upload filenames are flat — anything with a path separator is not one. */
const SAFE_FILENAME = /^[A-Za-z0-9._-]+$/;

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ filename: string }> },
) {
    if (!CMS_API_KEY) {
        return NextResponse.json({ error: "CMS is not configured" }, { status: 503 });
    }

    const { filename } = await params;
    const decoded = decodeURIComponent(filename);

    if (!SAFE_FILENAME.test(decoded)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const upstream = await fetch(`${CMS_URL}/api/media/file/${encodeURIComponent(decoded)}`, {
        headers: { Authorization: `users API-Key ${CMS_API_KEY}` },
        cache: "no-store",
    });

    if (!upstream.ok || !upstream.body) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(upstream.body, {
        headers: {
            "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
            "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
    });
}
