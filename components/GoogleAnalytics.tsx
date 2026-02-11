"use client";

import Script from "next/script";

export default function GoogleTag() {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=AW-17933543375"
            />
            <Script
                id="google-tag"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'AW-17933543375');
            `,
                }}
            />
        </>
    );
}
