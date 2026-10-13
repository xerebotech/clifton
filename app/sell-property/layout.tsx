import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/sell-property",
    title: "Sell Your Property in Dubai | Clifton Capital",
    description:
        "Get the best value for your Dubai property. Clifton Capital handles the whole sale for you, from valuation and marketing through to closing.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
