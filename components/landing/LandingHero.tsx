"use client";

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MousePointer2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingHero() {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

    return (
        <section ref={containerRef} id="home" className="relative h-screen lg:h-[110vh] w-full overflow-hidden bg-[#23312D]">
            {/* Background Image with Parallax */}
            <motion.div
                style={{ y: y1, scale }}
                className="absolute inset-0 z-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&q=80")',
                    }}
                />
                {/* Enhanced overlays for readability */}
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#23312D]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center pt-20 lg:pt-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-5xl"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="mb-8"
                    >
                        <span className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-[#AE9573] text-[10px] md:text-xs uppercase font-bold tracking-[0.3em]">
                            <span className="w-1.5 h-1.5 bg-[#AE9573] rounded-full animate-pulse" />
                            RERA Licensed Brokerage
                        </span>
                    </motion.div>

                    <h1
                        className="text-5xl md:text-8xl xl:text-[9rem] font-normal text-white mb-6 md:mb-10 leading-[0.85] tracking-tighter flex flex-col items-center"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="block"
                        >
                            Dubai's Finest
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.8 }}
                            className="bg-gradient-to-r from-[#AE9573] via-[#E2D1B6] to-[#AE9573] bg-clip-text text-transparent italic font-light text-2xl md:text-6xl lg:text-7xl tracking-tight mt-2 drop-shadow-sm"
                        >
                            Property Investments
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-white text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 font-light leading-relaxed drop-shadow-md"
                    >
                        10 curated properties from Emaar, Meraas & Ellington. Yields up to 6.5%. Golden Visa eligible. We handle everything — purchase, visa, and beyond.
                    </motion.p>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8 max-w-4xl mx-auto mb-10 md:mb-12"
                    >
                        {[
                            { val: '6.5%', label: 'Yield Up To' },
                            { val: '0%', label: 'Income Tax' },
                            { val: '10yr', label: 'Golden Visa' },
                            { val: '20%', label: 'Down Payment' }
                        ].map((stat, i) => (
                            <div key={i} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-b from-[#AE9573]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                                <div className="relative p-3 md:p-6 border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl">
                                    <div className="text-xl md:text-3xl font-cinzel text-white mb-1">{stat.val}</div>
                                    <div className="text-[8px] md:text-xs text-[#AE9573] font-bold uppercase tracking-[0.2em]">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                        <Link
                            href="#properties"
                            className="w-full sm:w-auto group relative px-8 py-4 md:px-10 md:py-5 bg-[#AE9573] text-white overflow-hidden transition-all duration-500 rounded-sm"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest uppercase text-xs md:text-sm font-bold">
                                Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>

                        <Link
                            href="#contact"
                            className="w-full sm:w-auto group px-8 py-4 md:px-10 md:py-5 bg-transparent border border-white/30 text-white backdrop-blur-md hover:bg-white hover:text-[#23312D] transition-all duration-500 rounded-sm"
                        >
                            <span className="tracking-widest uppercase text-xs md:text-sm font-bold flex items-center justify-center">Book a Private Viewing</span>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Floating Elements / Decorative */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4"
            >
                <div className="w-[1px] h-24 bg-gradient-to-b from-white to-transparent" />
                <span className="text-white/40 text-[10px] tracking-[0.5em] uppercase vertical-text">Scroll To Discover</span>
            </motion.div>

            {/* Side Accents */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-20">
                <div className="w-[2px] h-4 bg-white" />
                <div className="w-[2px] h-4 bg-white" />
                <div className="w-[2px] h-4 bg-white" />
            </div>
        </section>
    );
}

const styles = `
.vertical-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
}
`;
