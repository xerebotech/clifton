"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
    DollarSign,
    TrendingUp,
    Home,
    CreditCard,
    Building,
    BarChart3,
    Briefcase,
    MapPin,
    ChevronRight,
    ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const benefits = [
    {
        icon: DollarSign,
        title: "Stable Currency",
        description: "The UAE dirham's peg to the US Dollar at a fixed rate provides investors with a reliable foundation for financial transactions.",
        serviceType: "Investment"
    },
    {
        icon: TrendingUp,
        title: "Multiple ROI Streams",
        description: "Dubai's real estate offers investors diverse avenues for generating returns on investment.",
        serviceType: "Investment"
    },
    {
        icon: BarChart3,
        title: "Excellent Capital Appreciation",
        description: "Investing in under-construction properties through developer payment plans presents investors with the potential for substantial capital appreciation.",
        serviceType: "Investment"
    },
    {
        icon: CreditCard,
        title: "Long Term Residency Visas",
        description: "The introduction of initiatives such as 10-Year Golden Visa underscores Dubai's commitment to attracting and retaining talent & investment.",
        serviceType: "Management"
    },
    {
        icon: Home,
        title: "100% Freehold Property",
        description: "Dubai's real estate laws allow investors to own properties outright with 100% freehold ownership rights.",
        serviceType: "Buying"
    },
    {
        icon: Building,
        title: "High Potential Returns",
        description: "Dubai's real estate market has historically delivered high potential returns on investment, driven by various factors.",
        serviceType: "Investment"
    },
    {
        icon: Briefcase,
        title: "Business-Friendly Environment",
        description: "Dubai's reputation as a business-friendly hub is bolstered by its tax incentives, streamlined regulations, and access to financing.",
        serviceType: "Investment"
    },
    {
        icon: MapPin,
        title: "Lifestyle & Location",
        description: "Beyond its economic advantages, Dubai offers residents and investors a high quality of life enriched by its cosmopolitan culture.",
        serviceType: "Buying"
    }
];

export default function WhyDubaiSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <section ref={ref} className="py-24 md:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">Welcome to the</span>
                    <h2
                        className="text-4xl md:text-5xl text-[#23312D] mt-4"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        WORLD OF DUBAI REAL ESTATE
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                                className={`relative p-8 border border-[#e8e6e3] cursor-pointer transition-all duration-500 group overflow-hidden
                  ${activeIndex === index ? 'bg-[#23312D] border-[#23312D]' : 'hover:border-[#23312D]'}`}
                            >
                                <div className={`mb-6 transition-colors duration-500 ${activeIndex === index ? 'text-white' : 'text-[#23312D]'}`}>
                                    <Icon className="w-10 h-10 stroke-[1.5]" />
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-xs font-light tracking-wider transition-colors duration-500 ${activeIndex === index ? 'text-white/60' : 'text-[#AE9573]'}`}>
                                        0{index + 1}
                                    </span>
                                </div>
                                <h3
                                    className={`text-lg mb-3 transition-colors duration-500 ${activeIndex === index ? 'text-white' : 'text-[#23312D]'}`}
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    {benefit.title}
                                </h3>
                                <p className={`text-sm leading-relaxed transition-colors duration-500 ${activeIndex === index ? 'text-white/80' : 'text-[#A5A19D]'} mb-6`}>
                                    {benefit.description}
                                </p>

                                {/* Animated CTA Button */}
                                <div className={`absolute bottom-8 left-8 right-8 transition-all duration-500 transform ${activeIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                    <Link
                                        href={`/contact-us?service=${benefit.serviceType}`}
                                        className="w-full py-3 bg-[#AE9573] hover:bg-[#9a8d77] text-white flex items-center justify-center gap-2 text-sm font-medium tracking-wider transition-colors"
                                    >
                                        Inquire Now
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>

                                <ChevronRight className={`absolute bottom-6 right-6 w-5 h-5 transition-all duration-500 ${activeIndex === index ? 'opacity-0 translate-x-4' : 'opacity-100'}`} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
