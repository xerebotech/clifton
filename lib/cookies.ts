"use client";

/**
 * First-party cookie helpers shared by the attribution and geo capture.
 * Both need to survive client-side navigation, so the values live in cookies
 * rather than component state or sessionStorage.
 */

export function readCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

export function writeCookie(name: string, value: string, days: number) {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
