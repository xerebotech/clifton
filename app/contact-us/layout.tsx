import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/contact-us",
    title: "Contact Clifton Capital Real Estate | Dubai",
    description:
        "Talk to Clifton Capital about buying, selling, renting or investing in Dubai property. Visit us in Oud Metha, call +971 4 585 2370, or send an enquiry.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
