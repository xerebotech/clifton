import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Clifton Capital Real Estate LLC | Premium Dubai Properties",
  description: "Clifton Capital Real Estate LLC offers premium real estate services in Dubai. Find your dream home, invest in lucrative properties, or sell with experts.",
  metadataBase: new URL('https://www.cliftonuae.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Clifton Capital Real Estate LLC | Premium Dubai Properties',
    description: 'Expert real estate services in Dubai. Buying, selling, and property management with a premium touch.',
    url: 'https://www.cliftonuae.com',
    siteName: 'Clifton Capital Real Estate',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Clifton Capital Real Estate LLC',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clifton Capital Real Estate LLC | Dubai Premium Real Estate',
    description: 'Expert real estate services in Dubai. Find your next investment with Clifton Capital.',
    images: ['/logo.png'],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Clifton Capital Real Estate LLC",
  "url": "https://www.cliftonuae.com",
  "logo": "https://www.cliftonuae.com/logo.png",
  "description": "Premium real estate services in Dubai, specialized in luxury properties and investment consulting.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "508, Sultan business centre, Oud metha",
    "addressLocality": "Dubai",
    "addressCountry": "AE"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+971-55-930-4697",
    "contactType": "customer service",
    "email": "realestate@cliftonuae.com"
  },
  "sameAs": [
    "https://www.cliftonuae.com"
    // Add social media links here if available
  ]
};

import MainLayout from "@/components/MainLayout";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased overflow-x-hidden`}
      >
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
