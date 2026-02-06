"use client";

import React from 'react';
import { motion } from 'framer-motion';

const developers = [
    "EMAAR", "DAMAC", "SELECT GROUP", "SOBHA", "NAKHEEL", "MBI"
];

export default function TrustSection() {
    return (
        <section className="py-20 bg-white border-b border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-gray-400 text-xs tracking-[0.3em] uppercase mb-12"
                    >
                        Our Trusted Strategic Partners
                    </motion.p>

                    <div className="w-full relative">
                        {/* Static version for now, could be infinite scroll */}
                        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                            {developers.map((dev, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-2xl md:text-3xl font-bold tracking-tighter text-[#23312D] cursor-default whitespace-nowrap"
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    {dev}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
