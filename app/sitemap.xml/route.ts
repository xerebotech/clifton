import { getPosts } from "@/lib/cms";

/**
 * Sitemap for www.cliftonuae.com.
 *
 * A route handler rather than `app/sitemap.ts` because the metadata API cannot
 * emit the `<?xml-stylesheet?>` line that makes the file readable in a browser
 * (see public/sitemap.xsl). Crawlers ignore the stylesheet.
 *
 * The static routes below are hardcoded on purpose. An earlier sitemap fetched
 * the properties Google Sheet at build time — and when that URL was unset the
 * build broke. Nothing here may depend on a network call succeeding.
 *
 * Blog posts are the one dynamic part. `getPosts` swallows its own errors and
 * returns an empty list, and the call is wrapped again below, so the worst case
 * is a sitemap without blog URLs — never a failed deployment.
 *
 * Property detail pages are deliberately absent: fetching them is exactly what
 * broke the build before. Add them only behind a source that cannot fail.
 */

const BASE_URL = "https://www.cliftonuae.com";

// Revalidate daily; blog additions arrive sooner via the revalidate route,
// which calls revalidatePath("/sitemap.xml").
export const revalidate = 86400;

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

interface Entry {
    url: string;
    lastModified?: Date;
    changeFrequency: ChangeFrequency;
    priority: number;
}

// Static routes carry no lastModified on purpose. Stamping them with the time
// the sitemap was generated made every page look changed on every read, which
// teaches Google to ignore <lastmod> for the whole site — blog posts included.
const staticRoutes: Entry[] = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/properties`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about-us`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact-us`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/buy-property`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sell-property`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/rent-property`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/invest-in-dubai`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
];

async function blogRoutes(): Promise<Entry[]> {
    try {
        const { docs } = await getPosts({ limit: 100 });

        return docs
            .filter((post) => post.slug)
            .map((post) => {
                // Last edit wins; publish date is the fallback for older CMS builds
                // that do not send updatedAt in the list response.
                const modified = post.updatedAt ?? post.publishedAt;
                return {
                    url: `${BASE_URL}/blog/${post.slug}`,
                    lastModified: modified ? new Date(modified) : undefined,
                    changeFrequency: "monthly" as const,
                    priority: 0.7,
                };
            });
    } catch (error) {
        // Never fail the build over the sitemap.
        console.error("[sitemap] could not load blog posts:", error);
        return [];
    }
}

const escapeXml = (value: string): string =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

function toXml(entries: Entry[]): string {
    const urls = entries.map((entry) => {
        const lastmod =
            entry.lastModified && Number.isFinite(entry.lastModified.getTime())
                ? `\n<lastmod>${entry.lastModified.toISOString()}</lastmod>`
                : "";
        return `<url>
<loc>${escapeXml(entry.url)}</loc>${lastmod}
<changefreq>${entry.changeFrequency}</changefreq>
<priority>${entry.priority}</priority>
</url>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

export async function GET(): Promise<Response> {
    const xml = toXml([...staticRoutes, ...(await blogRoutes())]);

    return new Response(xml, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
