"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, ChevronDown, ChevronUp } from 'lucide-react';

const routeMap: Record<string, string> = {
    'Home': '/',
    'Properties': '/properties',
    'About': '/about-us',
    'InvestInDubai': '/invest-in-dubai',
    'BuyProperty': '/buy-property',
    'SellProperty': '/sell-property',
    'RentProperty': '/rent-property',
    'Contact': '/contact-us',
    'PrivacyPolicy': '/privacy-policy',
    'TermsOfService': '/terms-of-service'
};

const createPageUrl = (page: string) => routeMap[page] || '/';

interface NavItem {
    name: string;
    page?: string;
    href?: string;
    children?: { name: string; page: string }[];
}

const navItems: NavItem[] = [
    { name: 'Home', page: 'Home' },
    { name: 'Properties', page: 'Properties' },
    { name: 'About Us', page: 'About' },
    {
        name: 'Our Services',
        children: [
            { name: 'Invest in Dubai', page: 'InvestInDubai' },
            { name: 'Buy a Property', page: 'BuyProperty' },
            { name: 'Sell Your Property', page: 'SellProperty' },
            { name: 'Rent Your Property', page: 'RentProperty' }
        ]
    },
    { name: 'Contact Us', page: 'Contact' }
];

const landingNavItems: NavItem[] = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Properties', href: '#properties' },
    { name: 'FAQ', href: '#faq' }
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [isLandingPage, setIsLandingPage] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);

    useEffect(() => {
        if (pathname !== prevPathname) {
            setPrevPathname(pathname);
            setMobileMenuOpen(false);
        }
    }, [pathname, prevPathname]);

    const isHomePage = pathname === '/' || pathname === '/landing' ||
        (typeof window !== 'undefined' && (
            window.location.hostname === 'realestate.cliftonuae.com' ||
            window.location.hostname === 'www.realestate.cliftonuae.com'
        ));

    useEffect(() => {
        setIsLandingPage(
            pathname === '/landing' ||
            (typeof window !== 'undefined' && (
                window.location.hostname === 'realestate.cliftonuae.com' ||
                window.location.hostname === 'www.realestate.cliftonuae.com'
            ))
        );
    }, [pathname]);

    const isPropertiesPage = pathname === '/properties';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const isCurrentPage = (pageName: string) => {
        const path = createPageUrl(pageName);
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || (!isHomePage && !isPropertiesPage)
                    ? 'bg-white shadow-lg py-3'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href={createPageUrl('Home')} className="flex items-center gap-3">
                        <div className={`transition-all duration-500 ${isScrolled || (!isHomePage && !isPropertiesPage) ? '' : 'brightness-0 invert'}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo.png" alt="Clifton Capital" className="h-24 w-auto object-contain" />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {(isLandingPage ? landingNavItems : navItems).map((item, index) => (
                            <div key={index} className="relative group">
                                {('children' in item) ? (
                                    <div>
                                        <button className={`flex items-center gap-1 text-base tracking-wider transition-colors duration-300 ${isScrolled || (!isHomePage && !isPropertiesPage) ? 'text-[#23312D] hover:text-[#AE9573]' : 'text-white hover:text-[#B4A68C]'
                                            }`}>
                                            {item.name}
                                            <ChevronDown className="w-4 h-4" />
                                        </button>
                                        <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                            <div className="bg-white shadow-xl py-4 min-w-[200px] rounded-lg border border-gray-100">
                                                {item.children?.map((child, childIndex) => (
                                                    <Link
                                                        key={childIndex}
                                                        href={createPageUrl(child.page)}
                                                        className="block px-6 py-3 text-base text-[#868787] hover:bg-[#F2F0EB] hover:text-[#23312D] transition-colors"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={'href' in item && item.href ? item.href : createPageUrl(item.page || 'Home')}
                                        className={`text-base tracking-wider transition-colors duration-300 ${isScrolled || (!isHomePage && !isPropertiesPage) ? 'text-[#23312D] hover:text-[#AE9573]' : 'text-white hover:text-[#B4A68C]'
                                            } ${!('href' in item) && item.page && isCurrentPage(item.page) ? 'text-[#B4A68C]' : ''}`}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <Link
                            href={isLandingPage ? '#contact' : createPageUrl('Contact')}
                            className={`px-6 py-3 text-sm tracking-widest uppercase transition-all duration-500 rounded-sm ${isScrolled || (!isHomePage && !isPropertiesPage)
                                ? 'bg-[#00594F] text-white hover:bg-[#AE9573]'
                                : 'bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-[#23312D]'
                                }`}
                        >
                            {isLandingPage ? 'Book a Meeting' : 'Get In Touch'}
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`lg:hidden p-2 transition-colors ${isScrolled || (!isHomePage && !isPropertiesPage) ? 'text-[#23312D]' : 'text-white'}`}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white border-t max-h-[85vh] overflow-y-auto"
                        >
                            <nav className="max-w-7xl mx-auto px-6 py-6 space-y-4">
                                {(isLandingPage ? landingNavItems : navItems).map((item, index) => (
                                    <div key={index}>
                                        {('children' in item) ? (
                                            <div>
                                                <button
                                                    onClick={() => setServicesOpen(!servicesOpen)}
                                                    className="flex items-center justify-between w-full py-2 text-[#23312D]"
                                                >
                                                    {item.name}
                                                    {servicesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                                {servicesOpen && (
                                                    <div className="pl-4 space-y-2 mt-2 border-l-2 border-gray-100 ml-2">
                                                        {item.children?.map((child, childIndex) => (
                                                            <Link
                                                                key={childIndex}
                                                                href={createPageUrl(child.page)}
                                                                className="block py-2 text-base text-[#5a5a5a]"
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                href={'href' in item && item.href ? item.href : createPageUrl(item.page || 'Home')}
                                                className={`block py-2 text-[#23312D] ${!('href' in item) && item.page && isCurrentPage(item.page) ? 'text-[#AE9573]' : ''}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content */}
            <main className={!isHomePage && pathname !== '/properties' ? 'pt-24' : ''}>
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#1a1a1a] text-white -mt-px relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Logo & Description */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/logo.png" alt="Clifton Capital" className="h-32 w-auto object-contain brightness-0 invert" />
                            </div>
                            <p className="text-white/60 leading-relaxed mb-6 max-w-md">
                                We turn dream homes into reality and help sellers get top dollar for their properties. With our deep market expertise and personal service, we make real estate transactions seamless.
                            </p>
                            <div className="flex gap-4">
                                {[Facebook, Instagram, Linkedin, Twitter].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href="https://www.instagram.com/cliftonrealestate/"
                                        className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-[#AE9573] hover:border-[#AE9573] transition-all duration-300 rounded-full"
                                    >
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links / Navigation */}
                        <div>
                            <h4 className="text-lg mb-6 font-bold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                {isLandingPage ? 'Navigation' : 'Quick Links'}
                            </h4>
                            <ul className="space-y-3">
                                {(isLandingPage
                                    ? [
                                        { name: 'Home', href: '#home' },
                                        { name: 'Services', href: '#services' },
                                        { name: 'Properties', href: '#properties' },
                                        { name: 'FAQ', href: '#faq' }
                                    ]
                                    : [
                                        { name: 'Home', page: 'Home' },
                                        { name: 'About Us', page: 'About' },
                                        { name: 'Contact Us', page: 'Contact' }
                                    ]
                                ).map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={'href' in link ? link.href : createPageUrl(link.page as string)}
                                            className="text-white/60 hover:text-[#AE9573] transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal / Services */}
                        <div>
                            <h4 className="text-lg mb-6 font-bold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                {isLandingPage ? 'Legal' : 'Services'}
                            </h4>
                            <ul className="space-y-3">
                                {(isLandingPage
                                    ? [
                                        { name: 'Privacy Policy', page: 'PrivacyPolicy' },
                                        { name: 'Terms of Service', page: 'TermsOfService' }
                                    ]
                                    : [
                                        { name: 'Invest in Dubai', page: 'InvestInDubai' },
                                        { name: 'Buy a Property', page: 'BuyProperty' },
                                        { name: 'Sell Your Property', page: 'SellProperty' },
                                        { name: 'Rent Your Property', page: 'RentProperty' }
                                    ]
                                ).map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={createPageUrl(link.page as string)}
                                            className="text-white/60 hover:text-[#AE9573] transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                            <img src="/permit.png" alt="RERA Permit" className="h-16 w-16 object-contain bg-white p-1 rounded-sm" />
                            <div>
                                <p className="text-white/40 text-sm">
                                    © {new Date().getFullYear()} Clifton Capital Real Estate LLC. All rights reserved.
                                </p>
                                <p className="text-white/20 text-[10px] mt-1 uppercase tracking-widest">RERA: 40255 | License: 1289051</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <Link href={createPageUrl('PrivacyPolicy')} className="text-white/40 text-sm hover:text-white/60 transition-colors">Privacy Policy</Link>
                            <Link href={createPageUrl('TermsOfService')} className="text-white/40 text-sm hover:text-white/60 transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
