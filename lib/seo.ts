import type { Metadata } from "next";

/**
 * Per-page metadata with a self-referencing canonical.
 *
 * Next.js replaces `openGraph` and `twitter` wholesale rather than merging them
 * with the root layout's, so the shared fields (site name, image, locale) are
 * repeated here or a page would lose its share image.
 */

const SITE_NAME = "Clifton Capital Real Estate";
const SHARE_IMAGE = {
    url: "/logo.png",
    width: 1200,
    height: 630,
    alt: "Clifton Capital Real Estate LLC",
};

export function pageMetadata({
    path,
    title,
    description,
}: {
    /** Route path with a leading slash, e.g. "/about-us". */
    path: string;
    title: string;
    description: string;
}): Metadata {
    return {
        title,
        description,
        alternates: { canonical: path },
        openGraph: {
            title,
            description,
            url: path,
            siteName: SITE_NAME,
            images: [SHARE_IMAGE],
            locale: "en_US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [SHARE_IMAGE.url],
        },
    };
}
