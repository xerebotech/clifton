import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

// page.tsx is a client component and cannot export metadata, so it lives here.
export const metadata: Metadata = pageMetadata({
    path: "/rent-property",
    title: "Rent Out Your Dubai Property | Clifton Capital",
    description:
        "Maximise your rental income in Dubai. Clifton Capital's property management team handles tenants and day-to-day management while you enjoy the returns.",
});

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
