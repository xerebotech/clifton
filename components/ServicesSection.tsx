"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const services = [
    {
        title: "Invest in Dubai",
        description: "Discover lucrative investment opportunities in Dubai's thriving real estate market.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
        path: "/invest-in-dubai"
    },
    {
        title: "Buy a Property",
        description: "Find your dream home with our curated selection of premium properties.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
        path: "/buy-property"
    },
    {
        title: "Sell Your Property",
        description: "Get the best value for your property with our expert selling services.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
        path: "/sell-property"
    },
    {
        title: "Rent Your Property",
        description: "Maximize your rental income with our professional property management.",
        image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80",
        path: "/rent-property"
    }
];

export default function ServicesSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="py-24 md:py-32 bg-[#F2F0EB]">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h2
                        className="text-4xl md:text-5xl text-[#23312D]"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        OUR SERVICES
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <Link href={service.path} className="group block relative overflow-hidden rounded-lg">
                                <div className="relative h-96 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3
                                            className="text-xl text-white mb-2"
                                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                        >
                                            {service.title}
                                        </h3>
                                        <p className="text-white/70 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 line-clamp-2">
                                            {service.description}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 border border-white/20">
                                        <ArrowUpRight className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
