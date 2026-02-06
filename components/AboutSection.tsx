"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 md:py-32 bg-[#F2F0EB]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Images */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative z-10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
                                alt="Luxury Property"
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                        <motion.div
                            className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#23312D] z-0"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        />
                        <motion.img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&q=80"
                            alt="Interior"
                            className="absolute -bottom-16 right-4 w-48 h-48 object-cover border-4 border-white shadow-2xl z-20"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        />
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">About Us</span>
                        <h2
                            className="text-4xl md:text-5xl text-[#23312D] mt-4 mb-8 leading-tight"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            CLIFTON CAPITAL<br />
                            <span className="text-[#4D6969]">REAL ESTATE LLC</span>
                        </h2>
                        <div className="space-y-6 text-[#5a5a5a] leading-relaxed">
                            <p>
                                We turn dream homes into reality and help sellers get top dollar for their properties. With our deep market expertise and personal service, we make real estate transactions seamless and stress free.
                            </p>
                            <p>
                                We specialize in real estate portfolio management, guiding investors to optimal investment choices and ensuring robust returns.
                            </p>
                        </div>
                        <div className="mt-10 flex gap-12">
                            <div>
                                <span
                                    className="text-5xl font-light text-[#23312D]"
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    100%
                                </span>
                                <p className="text-sm text-[#A5A19D] mt-2 tracking-wide">Client Satisfaction</p>
                            </div>
                            <div>
                                <span
                                    className="text-5xl font-light text-[#23312D]"
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    15+
                                </span>
                                <p className="text-sm text-[#A5A19D] mt-2 tracking-wide">Years Experience</p>
                            </div>
                            <div>
                                <span
                                    className="text-5xl font-light text-[#23312D]"
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    100M+
                                </span>
                                <p className="text-sm text-[#A5A19D] mt-2 tracking-wide">Portfolio Value(AED)</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
