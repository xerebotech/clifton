"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    DollarSign,
    TrendingUp,
    Shield,
    Building,
    Globe,
    Plane,
    ArrowRight
} from 'lucide-react';

const benefits = [
    {
        icon: DollarSign,
        title: "No Property Tax",
        description: "Dubai offers zero property tax, maximizing your investment returns and rental income."
    },
    {
        icon: TrendingUp,
        title: "High ROI",
        description: "Average rental yields of 5-9%, among the highest in global real estate markets."
    },
    {
        icon: Shield,
        title: "Safe Investment",
        description: "Strong legal framework protecting investors' rights with transparent transactions."
    },
    {
        icon: Building,
        title: "World-Class Properties",
        description: "Access to iconic developments from renowned international developers."
    },
    {
        icon: Globe,
        title: "Global Hub",
        description: "Strategic location connecting East and West, ideal for business and lifestyle."
    },
    {
        icon: Plane,
        title: "Residency Options",
        description: "Property investment can qualify you for long-term UAE residency visas."
    }
];

const investmentTypes = [
    {
        title: "Off-Plan Properties",
        description: "Invest in under-construction projects with attractive payment plans and early-bird discounts.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"
    },
    {
        title: "Ready Properties",
        description: "Immediate possession properties generating instant rental income from day one.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"
    },
    {
        title: "Commercial Real Estate",
        description: "Office spaces and retail units in prime locations with high yield potential.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80"
    }
];

export default function InvestInDubai() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B5B5D]/90 to-[#3B5B5D]/70" />

                <motion.div
                    className="relative z-10 text-center px-6 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Discover Opportunity</span>
                    <h1
                        className="text-4xl md:text-6xl text-white mt-4 mb-6"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        Invest in Dubai
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                        Dubai offers exceptional opportunities for real estate investors, boasting substantial potential for capital appreciation and rental yields.
                    </p>
                    <Link href="/properties">
                        <button className="bg-[#B4A68C] hover:bg-[#1a2622] text-white px-10 py-6 tracking-widest uppercase transition-all duration-300 shadow-xl shadow-[#B4A68C]/20 active:scale-[0.98]">
                            View Investment Properties
                        </button>
                    </Link>
                </motion.div>
            </section>

            {/* Why Dubai Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">The Advantages</span>
                        <h2
                            className="text-4xl text-[#3B5B5D] mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Why Invest in Dubai Real Estate
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="p-8 border border-[#e8e6e3] hover:border-[#3B5B5D] transition-all duration-500 group"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="w-14 h-14 bg-[#F2F0EB] group-hover:bg-[#3B5B5D] flex items-center justify-center mb-6 transition-colors duration-500">
                                        <Icon className="w-7 h-7 text-[#3B5B5D] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3
                                        className="text-xl text-[#3B5B5D] mb-3"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {benefit.title}
                                    </h3>
                                    <p className="text-[#5a5a5a] leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Investment Types */}
            <section className="py-24 bg-[#F2F0EB]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Investment Options</span>
                        <h2
                            className="text-4xl text-[#3B5B5D] mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Types of Investments
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {investmentTypes.map((type, index) => (
                            <Link href="/properties" key={index}>
                                <motion.div
                                    className="group cursor-pointer bg-white p-2 shadow-sm hover:shadow-2xl transition-all duration-500"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative h-64 overflow-hidden mb-6">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={type.image}
                                            alt={type.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-[#3B5B5D]/0 group-hover:bg-[#3B5B5D]/20 transition-all duration-500 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-md px-6 py-3 text-[10px] font-bold text-navy uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                Explore Collection
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-8">
                                        <h3
                                            className="text-2xl text-[#3B5B5D] mb-3"
                                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                        >
                                            {type.title}
                                        </h3>
                                        <p className="text-[#5a5a5a] text-sm leading-relaxed">
                                            {type.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#3B5B5D]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className="text-3xl md:text-4xl text-white mb-6"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Ready to Start Your Investment Journey?
                        </h2>
                        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                            Our expert advisors are ready to guide you through every step of the investment process. Get personalized recommendations based on your goals.
                        </p>
                        <Link href="/contact-us">
                            <button className="bg-white text-[#3B5B5D] hover:bg-[#B4A68C] hover:text-white px-10 py-6 tracking-widest uppercase transition-all duration-500 flex items-center justify-center mx-auto gap-2">
                                Schedule Consultation
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
