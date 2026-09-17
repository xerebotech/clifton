import type { Metadata } from "next";
import Link from "next/link";

import Reveal from "@/components/blog/Reveal";
import { categoriesOf, formatDate, getPosts, mediaAlt, mediaUrl, type PostSummary } from "@/lib/cms";

export const metadata: Metadata = {
    title: "Insights & Market News | Clifton Capital Real Estate",
    description:
        "Dubai property market insights, investment guides and community spotlights from the Clifton Capital Real Estate team.",
    alternates: { canonical: "/blog" },
    openGraph: {
        title: "Insights & Market News | Clifton Capital Real Estate",
        description:
            "Dubai property market insights, investment guides and community spotlights from the Clifton Capital Real Estate team.",
        url: "/blog",
        type: "website",
    },
};

// Matches the CMS client's own window: published changes appear within 5 minutes.
export const revalidate = 300;

const PER_PAGE = 9;

const CINZEL = { fontFamily: "var(--font-cinzel), serif" } as const;

const HERO_IMAGE =
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80";

/** Lead article: image and copy side by side, with the site's offset block. */
function FeaturedPost({ post }: { post: PostSummary }) {
    const image = mediaUrl(post.featuredImage);
    const categories = categoriesOf(post);
    const published = formatDate(post.publishedAt);

    return (
        <section className="mb-20 md:mb-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <Reveal direction="left" className="relative">
                    <Link href={`/blog/${post.slug}`} className="group block">
                        <span
                            aria-hidden="true"
                            className="absolute -bottom-6 -right-6 hidden h-48 w-48 bg-[#23312D] md:block"
                        />
                        <div className="relative z-10 overflow-hidden rounded-sm">
                            <div className="aspect-[4/3] w-full bg-[#23312D]/5">
                                {image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={image}
                                        alt={mediaAlt(post.featuredImage, post.title)}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                )}
                            </div>
                        </div>
                    </Link>
                </Reveal>

                <Reveal direction="right" delay={0.15}>
                    <span className="text-sm uppercase tracking-[0.3em] text-[#AE9573]">
                        Latest Insight
                    </span>

                    <h2
                        className="mt-5 text-3xl font-light leading-tight tracking-wide text-[#23312D] md:text-4xl lg:text-5xl"
                        style={CINZEL}
                    >
                        <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#AE9573]">
                            {post.title}
                        </Link>
                    </h2>

                    {post.excerpt && (
                        <p className="mt-6 text-[17px] leading-[1.9] text-[#23312D]/70">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.2em] text-[#23312D]/45">
                        {published && <span>{published}</span>}
                        {published && categories.length > 0 && (
                            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-[#AE9573]" />
                        )}
                        {categories.slice(0, 2).map((category) => (
                            <Link
                                key={category.slug}
                                href={`/blog?category=${category.slug}`}
                                className="text-[#AE9573] transition-colors hover:text-[#23312D]"
                            >
                                {category.title}
                            </Link>
                        ))}
                    </div>

                    <Link
                        href={`/blog/${post.slug}`}
                        style={CINZEL}
                        className="mt-10 inline-block rounded-sm border-2 border-[#AE9573] bg-[#AE9573] px-10 py-4 text-sm uppercase tracking-[0.2em] text-[#23312D] transition-all duration-500 hover:bg-transparent hover:text-[#23312D]"
                    >
                        Read Article
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}

function PostCard({ post, index }: { post: PostSummary; index: number }) {
    const image = mediaUrl(post.featuredImage);
    const categories = categoriesOf(post);
    const published = formatDate(post.publishedAt);

    return (
        <Reveal delay={(index % 3) * 0.1}>
            <article className="group flex h-full flex-col bg-white transition-shadow duration-500 hover:shadow-[0_25px_60px_rgba(35,49,45,0.12)]">
                <Link href={`/blog/${post.slug}`} className="relative block overflow-hidden">
                    <div className="aspect-[16/11] w-full bg-[#23312D]/5">
                        {image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={image}
                                alt={mediaAlt(post.featuredImage, post.title)}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                        )}
                    </div>
                    {categories[0] && (
                        <span className="absolute bottom-0 left-0 bg-[#AE9573] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#23312D]">
                            {categories[0].title}
                        </span>
                    )}
                </Link>

                <div className="flex flex-1 flex-col border-x border-b border-[#23312D]/8 p-8">
                    {published && (
                        <span className="text-[11px] uppercase tracking-[0.25em] text-[#23312D]/40">
                            {published}
                        </span>
                    )}

                    <h3
                        className="mt-4 text-xl font-light leading-snug tracking-wide text-[#23312D] md:text-2xl"
                        style={CINZEL}
                    >
                        <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[#AE9573]">
                            {post.title}
                        </Link>
                    </h3>

                    {post.excerpt && (
                        <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-[#23312D]/65">
                            {post.excerpt}
                        </p>
                    )}

                    <Link
                        href={`/blog/${post.slug}`}
                        className="mt-auto pt-8 text-[11px] uppercase tracking-[0.25em] text-[#23312D] transition-colors hover:text-[#AE9573]"
                    >
                        Read More
                        <span
                            aria-hidden="true"
                            className="ml-3 inline-block transition-transform duration-500 group-hover:translate-x-1"
                        >
                            &rarr;
                        </span>
                    </Link>
                </div>
            </article>
        </Reveal>
    );
}

export default async function BlogIndex({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; page?: string }>;
}) {
    const { category, page: pageParam } = await searchParams;

    const page = Math.max(1, Number(pageParam) || 1);
    const { docs, totalPages, totalDocs } = await getPosts({ page, limit: PER_PAGE, category });

    // Built from the posts on screen — the CMS has no public categories route,
    // so this reflects what is actually being shown rather than every category.
    const filters = Array.from(
        new Map(docs.flatMap((post) => categoriesOf(post)).map((c) => [c.slug, c])).values(),
    );

    // The lead slot is only meaningful on an unfiltered first page.
    const showFeatured = page === 1 && !category && docs.length > 0;
    const featured = showFeatured ? docs[0] : null;
    const rest = showFeatured ? docs.slice(1) : docs;

    const pageHref = (target: number) => {
        const query = new URLSearchParams();
        if (category) query.set("category", category);
        if (target > 1) query.set("page", String(target));
        const qs = query.toString();
        return qs ? `/blog?${qs}` : "/blog";
    };

    return (
        <main className="bg-[#F2F0EB]">
            {/* Hero — same treatment as the About and Contact pages */}
            <section className="relative flex h-[60vh] min-h-[400px] items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${HERO_IMAGE})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#23312D]/95 to-[#23312D]/75" />

                <Reveal className="relative z-10 px-6 text-center">
                    <span className="text-sm uppercase tracking-[0.3em] text-[#AE9573]">
                        Market Intelligence
                    </span>
                    <h1
                        className="mt-4 text-4xl leading-tight text-white md:text-6xl"
                        style={CINZEL}
                    >
                        Insights
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
                        Dubai property market analysis, investment guides and community spotlights
                        from our advisory team.
                    </p>
                </Reveal>
            </section>

            <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
                {filters.length > 0 && (
                    <nav
                        className="mb-16 flex flex-wrap justify-center gap-x-10 gap-y-4 border-b border-[#23312D]/10 pb-8"
                        aria-label="Filter by category"
                    >
                        <Link
                            href="/blog"
                            className={`text-xs uppercase tracking-[0.25em] transition-colors ${
                                category
                                    ? "text-[#23312D]/50 hover:text-[#AE9573]"
                                    : "text-[#AE9573]"
                            }`}
                        >
                            All
                        </Link>
                        {filters.map((filter) => (
                            <Link
                                key={filter.slug}
                                href={`/blog?category=${filter.slug}`}
                                className={`text-xs uppercase tracking-[0.25em] transition-colors ${
                                    category === filter.slug
                                        ? "text-[#AE9573]"
                                        : "text-[#23312D]/50 hover:text-[#AE9573]"
                                }`}
                            >
                                {filter.title}
                            </Link>
                        ))}
                    </nav>
                )}

                {docs.length === 0 ? (
                    <div className="mx-auto max-w-lg py-20 text-center md:py-28">
                        <span className="mx-auto mb-8 block h-px w-16 bg-[#AE9573]" />
                        <h2
                            className="text-2xl font-light tracking-wide text-[#23312D] md:text-3xl"
                            style={CINZEL}
                        >
                            No Articles Yet
                        </h2>
                        <p className="mt-5 leading-relaxed text-[#23312D]/60">
                            {category
                                ? "Nothing published in this category yet."
                                : "We are preparing our first market insights. Check back shortly."}
                        </p>
                        {category && (
                            <Link
                                href="/blog"
                                className="mt-8 inline-block text-xs uppercase tracking-[0.25em] text-[#AE9573] hover:text-[#23312D]"
                            >
                                View All Articles
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        {featured && <FeaturedPost post={featured} />}

                        {rest.length > 0 && (
                            <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                                {rest.map((post, index) => (
                                    <PostCard key={post.id} post={post} index={index} />
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <nav
                                className="mt-20 flex items-center justify-between border-t border-[#23312D]/10 pt-10"
                                aria-label="Pagination"
                            >
                                {page > 1 ? (
                                    <Link
                                        href={pageHref(page - 1)}
                                        className="text-xs uppercase tracking-[0.25em] text-[#23312D] transition-colors hover:text-[#AE9573]"
                                    >
                                        &larr; Previous
                                    </Link>
                                ) : (
                                    <span />
                                )}

                                <span className="text-xs uppercase tracking-[0.2em] text-[#23312D]/40">
                                    {page} / {totalPages} &nbsp;&middot;&nbsp; {totalDocs} Articles
                                </span>

                                {page < totalPages ? (
                                    <Link
                                        href={pageHref(page + 1)}
                                        className="text-xs uppercase tracking-[0.25em] text-[#23312D] transition-colors hover:text-[#AE9573]"
                                    >
                                        Next &rarr;
                                    </Link>
                                ) : (
                                    <span />
                                )}
                            </nav>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
