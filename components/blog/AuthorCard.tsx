import { mediaAlt, mediaUrl, populated, type AuthorDoc } from "@/lib/cms";

/**
 * Byline card for the article rail. Renders nothing at all when no author is
 * attached, so a post without one simply has a shorter sidebar rather than an
 * empty box.
 *
 * Two shapes: the full card leads with a portrait sized to the rail, set
 * against the offset block used across the site; `compact` is the small
 * circular version used above the article on narrow screens.
 */

const CINZEL = { fontFamily: "var(--font-cinzel), serif" } as const;

export default function AuthorCard({
    author,
    compact = false,
}: {
    author: AuthorDoc | string | null | undefined;
    compact?: boolean;
}) {
    const doc = populated<AuthorDoc>(author);
    if (!doc?.name) return null;

    const photo = mediaUrl(doc.photo);
    const links = (doc.links ?? []).filter((link) => link?.label && link?.url);
    const initial = doc.name.trim().charAt(0).toUpperCase();

    if (compact) {
        return (
            <div className="flex items-center gap-5">
                {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={photo}
                        alt={mediaAlt(doc.photo, doc.name)}
                        className="h-16 w-16 shrink-0 rounded-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <span
                        aria-hidden="true"
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#23312D] text-lg font-light text-[#AE9573]"
                        style={CINZEL}
                    >
                        {initial}
                    </span>
                )}

                <div>
                    <span className="block text-[10px] uppercase tracking-[0.3em] text-[#AE9573]">
                        Written By
                    </span>
                    <p className="mt-2 text-lg font-light tracking-wide text-[#23312D]" style={CINZEL}>
                        {doc.name}
                    </p>
                    {doc.role && (
                        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#23312D]/45">
                            {doc.role}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="relative">
                {/* The offset block behind the portrait, as on the About section. */}
                <span
                    aria-hidden="true"
                    className="absolute -bottom-3 -right-3 h-24 w-24 bg-[#AE9573]"
                />

                {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={photo}
                        alt={mediaAlt(doc.photo, doc.name)}
                        className="relative z-10 aspect-[4/5] w-full rounded-sm object-cover object-top shadow-[0_18px_40px_rgba(35,49,45,0.18)]"
                    />
                ) : (
                    <span
                        aria-hidden="true"
                        className="relative z-10 flex aspect-[4/5] w-full items-center justify-center rounded-sm bg-[#23312D] text-6xl font-light text-[#AE9573]"
                        style={CINZEL}
                    >
                        {initial}
                    </span>
                )}
            </div>

            <div className="mt-7">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-[#AE9573]">
                    Written By
                </span>
                <p
                    className="mt-3 text-2xl font-light leading-snug tracking-wide text-[#23312D]"
                    style={CINZEL}
                >
                    {doc.name}
                </p>
                {doc.role && (
                    <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#23312D]/45">
                        {doc.role}
                    </p>
                )}

                {doc.bio && (
                    // Clamped so an over-long bio cannot crowd out the CTA
                    // sharing the rail with it.
                    <p className="mt-4 line-clamp-4 text-[13px] leading-relaxed text-[#23312D]/60">
                        {doc.bio}
                    </p>
                )}

                {links.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                        {links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] uppercase tracking-[0.25em] text-[#23312D]/50 transition-colors hover:text-[#AE9573]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
