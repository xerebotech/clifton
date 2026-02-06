"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const developers = [
    { name: "Emaar", logo: "/emaar.png" },
    { name: "DAMAC", logo: "/damac.png" },
    { name: "Nakheel", logo: "/nakheel.png" },
    { name: "Meraas", logo: "/meraas.png" },
    { name: "Deyaar", logo: "/deyaar.png" }
];

export default function DevelopersSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 bg-gradient-to-b from-white to-[#F2F0EB] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#AE9573] text-sm tracking-[0.2em] uppercase mb-4 block">Trusted Partners</span>
                    <h2
                        className="text-3xl md:text-5xl text-[#23312D] mb-6"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        Associated Developers
                    </h2>
                    <div className="w-24 h-1 bg-[#AE9573] mx-auto rounded-full opacity-60" />
                </motion.div>

                {/* Infinite scroll animation */}
                <div className="relative py-8">
                    {/* Gradient Masks for smooth fade edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#Fcfbf9] to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F4F2EE] to-transparent z-10 pointer-events-none" />

                    <div className="flex animate-scroll w-[max-content]">
                        {/* We duplicate the developer list 3 times to ensure smooth infinite scrolling */}
                        {[...developers, ...developers, ...developers].map((developer, index) => (
                            <motion.div
                                key={index}
                                className="mx-6 group"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 + (index % 5) * 0.1 }}
                            >
                                <div className="h-56 w-96 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-8 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-[#AE9573]/30">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={developer.logo}
                                        alt={developer.name}
                                        className="max-h-full max-w-full object-contain grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                                        onError={(e) => {
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                e.currentTarget.style.display = 'none';
                                                parent.innerHTML = `<span class="text-[#23312D] text-2xl font-light tracking-wider opacity-60 group-hover:opacity-100 transition-opacity duration-300" style="font-family: 'Cinzel', serif">${developer.name}</span>`;
                                            }
                                        }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
