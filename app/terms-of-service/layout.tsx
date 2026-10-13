import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/terms-of-service",
    title: "Terms of Service | Clifton Capital Real Estate",
    description:
        "The terms that apply when you use the Clifton Capital Real Estate LLC website and its services.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
