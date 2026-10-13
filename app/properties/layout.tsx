import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/properties",
    title: "Dubai Investment Properties for Sale | Clifton Capital",
    description:
        "Browse Dubai investment properties with prices, estimated monthly payments and gross rental yields, selected by Clifton Capital Real Estate.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
