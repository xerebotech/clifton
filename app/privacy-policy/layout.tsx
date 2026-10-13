import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/privacy-policy",
    title: "Privacy Policy | Clifton Capital Real Estate",
    description:
        "How Clifton Capital Real Estate LLC collects, uses and protects your personal data when you use our website.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
