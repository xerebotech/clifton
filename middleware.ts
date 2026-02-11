import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host')?.split(':')[0];

    // Redirect www subdomain to non-www for consistency
    if (hostname === 'www.realestate.cliftonuae.com') {
        const redirectUrl = new URL(request.url);
        redirectUrl.host = 'realestate.cliftonuae.com';
        return NextResponse.redirect(redirectUrl, 301); // Permanent redirect
    }

    // Check if the user is visiting your subdomain
    if (hostname === 'realestate.cliftonuae.com') {
        // If they are at the root "/", show them "/landing" content
        if (url.pathname === '/') {
            url.pathname = '/landing';
            return NextResponse.rewrite(url);
        }
    }

    return NextResponse.next();
}

// Only run this for the home page to keep it fast
export const config = {
    matcher: '/',
};
