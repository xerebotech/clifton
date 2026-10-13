import type { Metadata } from "next";

// Paid-campaign landing page. It repeats the homepage's sections, so it stays
// out of the index rather than competing with the homepage; links are followed.
export const metadata: Metadata = {
    robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
