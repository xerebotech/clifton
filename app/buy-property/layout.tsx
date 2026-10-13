import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/buy-property",
    title: "Buy Property in Dubai | Clifton Capital Real Estate",
    description:
        "Find your home or investment in Dubai with Clifton Capital. A curated selection of premium properties and a seamless, stress-free buying process.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
