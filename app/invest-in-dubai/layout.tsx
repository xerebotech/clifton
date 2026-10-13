import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/invest-in-dubai",
    title: "Invest in Dubai Real Estate | Clifton Capital",
    description:
        "Why Dubai property works for investors: capital appreciation, strong rental yields and expert guidance on where to buy, from Clifton Capital Real Estate.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
