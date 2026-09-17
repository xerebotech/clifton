import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/cms";

/**
 * Sitemap for www.cliftonuae.com.
 *
 * The static routes below are hardcoded on purpose. A previous `app/sitemap.ts`
 * was deleted in favour of a hand-written public/sitemap.xml ("better
 * deployment compatibility") because it fetched the properties Google Sheet at
 * build time — and when that URL was unset the build broke. Nothing here may
 * depend on a network call succeeding.
 *
 * Blog posts are the one dynamic part. `getPosts` swallows its own errors and
 * returns an empty list, and the call is wrapped again below, so the worst case
 * is a sitemap without blog URLs — never a failed deployment.
 *
 * Property detail pages are deliberately absent: fetching them is exactly what
 * broke the build before. Add them only behind a source that cannot fail.
 */

const BASE_URL = "https://www.cliftonuae.com";

// Revalidate daily; blog additions arrive sooner via the revalidate route.
export const revalidate = 86400;

type Entry = MetadataRoute.Sitemap[number];

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
            .map((post) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                lastModified: post.publishedAt ? new Date(post.publishedAt) : undefined,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            }));
    } catch (error) {
        // Never fail the build over the sitemap.
        console.error("[sitemap] could not load blog posts:", error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    return [
        ...staticRoutes.map((route) => ({ lastModified: now, ...route })),
        ...(await blogRoutes()),
    ];
}
