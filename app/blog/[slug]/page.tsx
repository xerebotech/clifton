import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import AuthorCard from "@/components/blog/AuthorCard";
import Blocks from "@/components/blog/Blocks";
import Reveal from "@/components/blog/Reveal";
import SidebarForm from "@/components/blog/SidebarForm";
import TocDrawer from "@/components/blog/TocDrawer";
import {
    categoriesOf,
    extractHeadings,
    formatDate,
    getForm,
    getPost,
    getSiteSettings,
    mediaAlt,
    mediaUrl,
    populated,
    readingTime,
    type AuthorDoc,
    type FormDoc,
} from "@/lib/cms";

export const revalidate = 300;

const CINZEL = { fontFamily: "var(--font-cinzel), serif" } as const;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        return { title: "Article not found | Clifton Capital Real Estate" };
    }

    const title = post.meta?.title || `${post.title} | Clifton Capital Real Estate`;
    const description = post.meta?.description || post.excerpt || undefined;
    const image = mediaUrl(post.meta?.image) || mediaUrl(post.featuredImage);
    const author = populated<AuthorDoc>(post.author)?.name;

    return {
        title,
        description,
        ...(author ? { authors: [{ name: author }] } : {}),
        alternates: { canonical: `/blog/${post.slug}` },
        openGraph: {
            title,
            description,
            url: `/blog/${post.slug}`,
            type: "article",
            publishedTime: post.publishedAt || undefined,
            modifiedTime: post.updatedAt || undefined,
            ...(image ? { images: [{ url: image }] } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };
}

export default async function BlogPost({ params }: Params) {
    const { slug } = await params;

    // In parallel: the sidebar form is site-wide, so it never depends on the post.
    const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()]);

    if (!post) notFound();

    // The settings endpoint runs at depth 1, so the form normally arrives with
    // its fields already populated; the fetch is only a fallback.
    let sidebarForm = populated<FormDoc>(settings?.sidebarForm);
    if (typeof settings?.sidebarForm === "string") {
        sidebarForm = await getForm(settings.sidebarForm);
    } else if (sidebarForm && !sidebarForm.fields?.length) {
        sidebarForm = await getForm(String(sidebarForm.id));
    }
    const hasSidebarForm = Boolean(sidebarForm?.fields?.length);

    const image = mediaUrl(post.featuredImage);
    const categories = categoriesOf(post);
    const published = formatDate(post.publishedAt);
    const minutes = readingTime(post.layout);
    const author = populated<AuthorDoc>(post.author);
    const { items: toc, idsByBlock } = extractHeadings(post.layout);

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt || undefined,
        datePublished: post.publishedAt || undefined,
        dateModified: post.updatedAt || post.publishedAt || undefined,
        author: author?.name
            ? { "@type": "Person", name: author.name, jobTitle: author.role || undefined }
            : { "@type": "Organization", name: "Clifton Capital Real Estate LLC" },
        publisher: {
            "@type": "Organization",
            name: "Clifton Capital Real Estate LLC",
            logo: {
                "@type": "ImageObject",
                url: "https://www.cliftonuae.com/logo.png",
            },
        },
        mainEntityOfPage: `https://www.cliftonuae.com/blog/${post.slug}`,
    };

    return (
        <main className="bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <TocDrawer items={toc} />

            {/* Hero — same treatment as the About and Contact pages. `min-h`
                rather than a fixed height because post titles vary in length. */}
            <header className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-[#23312D] px-6 py-24 text-center text-white">
                {image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={image}
                        alt={mediaAlt(post.featuredImage, post.title)}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#23312D]/95 to-[#23312D]/75" />

                <div className="relative z-10 mx-auto max-w-4xl">
                    {categories.length > 0 && (
                        <div className="mb-4 flex flex-wrap justify-center gap-x-4">
                            {categories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/blog?category=${category.slug}`}
                                    className="text-sm uppercase tracking-[0.3em] text-[#AE9573] transition-colors hover:text-white"
                                >
                                    {category.title}
                                </Link>
                            ))}
                        </div>
                    )}

                    <h1 className="text-3xl leading-tight text-white md:text-5xl" style={CINZEL}>
                        {post.title}
                    </h1>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.2em] text-white/70">
                        {author?.name && <span>By {author.name}</span>}
                        {author?.name && published && (
                            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-[#AE9573]" />
                        )}
                        {published && <time dateTime={post.publishedAt ?? undefined}>{published}</time>}
                        {published && minutes > 0 && (
                            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-[#AE9573]" />
                        )}
                        {minutes > 0 && <span>{minutes} min read</span>}
                    </div>
                </div>
            </header>

            {/* Standfirst — the excerpt, set apart above the body */}
            {post.excerpt && (
                <section className="bg-[#F2F0EB] px-6 py-16 md:py-20">
                    <Reveal className="mx-auto max-w-3xl text-center">
                        <p
                            className="text-xl font-light leading-relaxed tracking-wide text-[#23312D] md:text-2xl"
                            style={CINZEL}
                        >
                            {post.excerpt}
                        </p>
                        <span className="mx-auto mt-8 block h-px w-20 bg-[#AE9573]" />
                    </Reveal>
                </section>
            )}

            <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
                <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-16 xl:gap-24">
                    {/* Sticky rail — desktop only */}
                    <aside className="hidden lg:block">
                        {/* top-36 (144px) clears the fixed header, which is 120px
                            tall on this page: an h-24 logo inside py-3. */}
                        {/* Byline and CTA only — the contents list lives in the
                            drawer, so nothing here needs to scroll or clip. */}
                        <div className="sticky top-36 space-y-10">
                            <AuthorCard author={post.author} />

                            {hasSidebarForm && sidebarForm && (
                                <>
                                    {author && <span className="block h-px w-full bg-[#23312D]/10" />}
                                    <SidebarForm
                                        form={sidebarForm}
                                        heading={settings?.sidebarFormHeading}
                                        blurb={settings?.sidebarFormBlurb}
                                    />
                                </>
                            )}
                        </div>
                    </aside>

                    <div className="min-w-0">
                        {/* Compact byline and collapsible contents — small screens */}
                        <div className="mb-12 lg:hidden">
                            <AuthorCard author={post.author} compact />
                        </div>

                        <article>
                            <Blocks layout={post.layout} headingIds={idsByBlock} />
                        </article>

                        {hasSidebarForm && sidebarForm && (
                            <div className="mt-16 border-t border-[#23312D]/10 pt-10 lg:hidden">
                                <SidebarForm
                                    form={sidebarForm}
                                    heading={settings?.sidebarFormHeading}
                                    blurb={settings?.sidebarFormBlurb}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Closing CTA, in the site's standard band */}
            <section className="relative overflow-hidden bg-[#23312D] px-6 py-20 text-white md:py-28">
                <Reveal className="mx-auto max-w-3xl text-center">
                    <span className="text-sm uppercase tracking-[0.3em] text-[#AE9573]">
                        Speak To An Advisor
                    </span>
                    <h2
                        className="mt-5 text-3xl font-light leading-tight tracking-wide md:text-5xl"
                        style={CINZEL}
                    >
                        Thinking About Dubai Property?
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl font-light leading-relaxed text-white/70">
                        Our advisors will walk you through the numbers on any listing — rental
                        yields, service charges and Golden Visa eligibility.
                    </p>
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/contact-us"
                            style={CINZEL}
                            className="inline-block rounded-sm border-2 border-[#AE9573] bg-[#AE9573] px-10 py-4 text-sm uppercase tracking-[0.2em] text-[#23312D] transition-all duration-500 hover:bg-transparent hover:text-white"
                        >
                            Book A Consultation
                        </Link>
                        <Link
                            href="/properties"
                            style={CINZEL}
                            className="inline-block rounded-sm border-2 border-white/40 px-10 py-4 text-sm uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-[#AE9573] hover:text-[#AE9573]"
                        >
                            Browse Properties
                        </Link>
                    </div>
                </Reveal>
            </section>

            <div className="bg-[#F2F0EB] px-6 py-10 text-center">
                <Link
                    href="/blog"
                    className="text-xs uppercase tracking-[0.3em] text-[#23312D]/60 transition-colors hover:text-[#AE9573]"
                >
                    &larr; All Insights
                </Link>
            </div>
        </main>
    );
}
