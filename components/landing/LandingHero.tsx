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
        <section ref={containerRef} id="home" className="relative h-[110vh] w-full overflow-hidden bg-[#23312D]">
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
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#23312D]" />
            </motion.div>

            {/* Content */}
            <div className="relative z-0 h-full flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="max-w-5xl"
                >
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.1em" }}
                        animate={{ opacity: 1, letterSpacing: "0.4em" }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        className="text-[#AE9573] text-sm md:text-base mb-6 block uppercase font-medium"
                    >
                        Redefining Luxury Living
                    </motion.span>

                    <h1
                        className="text-5xl md:text-8xl lg:text-9xl font-normal text-white mb-8 leading-[0.9] tracking-tighter"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        THE ART OF <br />
                        <span className="italic font-light">EXCLUSIVITY</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Clifton Capital brings you the most prestigious real estate portfolio in Dubai.
                        Where architectural mastery meets unparalleled lifestyle.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="#properties"
                            className="group relative px-10 py-5 bg-[#AE9573] text-white overflow-hidden transition-all duration-500 rounded-sm"
                        >
                            <span className="relative z-10 flex items-center gap-2 tracking-widest uppercase text-sm font-bold">
                                Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </Link>

                        <Link
                            href="#contact"
                            className="group px-10 py-5 bg-transparent border border-white/30 text-white backdrop-blur-md hover:bg-white hover:text-[#23312D] transition-all duration-500 rounded-sm"
                        >
                            <span className="tracking-widest uppercase text-sm font-bold">Book a Private Viewing</span>
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
