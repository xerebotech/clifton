import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/about-us",
    title: "About Clifton Capital | Dubai Real Estate Agency",
    description:
        "Meet Clifton Capital Real Estate LLC, the Dubai agency advising buyers, sellers, landlords and investors on residential property across the city.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
