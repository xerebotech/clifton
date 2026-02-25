"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Key, Home, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const services = [
    {
        title: "Investment Advisory",
        description: "Data-driven strategies for high-yield Dubai real estate. ROI calculators, yield analysis, and 5-year projections.",
        icon: TrendingUp,
        path: "#contact",
        color: "bg-[#23312D]"
    },
    {
        title: "Premium Off-Plan Sales",
        description: "Exclusive access to curated off-plan villas and apartments. Emaar, Meraas, Ellington. Developer-direct pricing.",
        icon: Home,
        path: "#contact",
        color: "bg-[#AE9573]"
    },
    {
        title: "Golden Visa Services",
        description: "End-to-end UAE Golden Visa processing. 10-year residency for you and your family through property investment.",
        icon: Shield,
        path: "#contact",
        color: "bg-[#4D6969]"
    },
    {
        title: "Concierge & PRO",
        description: "Post-purchase support: tenant finding, property management, DEWA setup, POA, and annual PRO services.",
        icon: Key,
        path: "#contact",
        color: "bg-[#23312D]"
    }
];

export default function LuxuryServices() {
    return (
        <section id="services" className="py-32 bg-[#F2F0EB]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-end mb-20">
                    <div>
                        <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase block mb-4">Unmatched Expertise</span>
                        <h2
                            className="text-5xl md:text-6xl text-[#23312D] leading-tight"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            TAILORED SOLUTIONS <br />
                            FOR DISCERNING <span className="text-[#AE9573] italic">INVESTORS</span>
                        </h2>
                    </div>
                    <div className="max-w-md">
                        <p className="text-gray-600 leading-relaxed text-lg">
                            A comprehensive ecosystem of real estate services, ensuring every transaction is handled with the highest level of professionalism.

                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className="h-full"
                        >
                            <Link href={service.path} className="group flex flex-col bg-white p-10 h-full border border-gray-100 hover:border-[#AE9573]/30 transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-xl">
                                <div className={`w-12 h-12 ${service.color} flex items-center justify-center rounded-sm mb-8 text-white group-hover:scale-110 transition-transform duration-500`}>
                                    <service.icon className="w-6 h-6" />
                                </div>

                                <h3
                                    className="text-2xl text-[#23312D] mb-4 group-hover:text-[#AE9573] transition-colors"
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    {service.title}
                                </h3>

                                <p className="text-gray-500 font-light leading-relaxed mb-8">
                                    {service.description}
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-[#23312D] text-xs tracking-widest uppercase font-bold group-hover:gap-4 transition-all">
                                    Inquire Now <ArrowUpRight className="w-4 h-4" />
                                </div>

                                {/* Hover Accent */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#AE9573]/5 rounded-bl-full translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
