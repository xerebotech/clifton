"use client";

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    {
        value: "10%+",
        label: "Avg. Rental Yield",
        sub: "Highest in global hubs",
        color: "text-[#AE9573]"
    },
    {
        value: "15-20%",
        label: "Annual appreciation",
        sub: "In prime locations",
        color: "text-[#AE9573]"
    },
    {
        value: "0%",
        label: "Personal Income Tax",
        sub: "100% Repatriation of funds",
        color: "text-[#AE9573]"
    },
    {
        value: "2M+",
        label: "Golden Visa Entry",
        sub: "10-year residency point",
        color: "text-[#AE9573]"
    }
];

export default function MarketStats() {
    return (
        <section className="py-24 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div
                                className={`text-5xl md:text-6xl mb-4 ${stat.color}`}
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-[#23312D] text-sm tracking-[0.2em] font-bold uppercase mb-2">
                                {stat.label}
                            </div>
                            <div className="text-gray-400 text-xs uppercase tracking-widest font-light">
                                {stat.sub}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
