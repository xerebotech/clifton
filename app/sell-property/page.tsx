"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Camera,
    BarChart3,
    Megaphone,
    Handshake,
    CheckCircle,
    ArrowRight,
    TrendingUp,
    Clock,
    Shield
} from 'lucide-react';

const process = [
    {
        icon: Camera,
        step: "01",
        title: "Property Evaluation",
        description: "Professional assessment and stunning photography to showcase your property's best features."
    },
    {
        icon: BarChart3,
        step: "02",
        title: "Market Analysis",
        description: "Data-driven pricing strategy based on current market conditions and comparable sales."
    },
    {
        icon: Megaphone,
        step: "03",
        title: "Strategic Marketing",
        description: "Multi-channel marketing campaign targeting qualified buyers locally and internationally."
    },
    {
        icon: Handshake,
        step: "04",
        title: "Negotiation & Closing",
        description: "Expert negotiation to maximize your returns and smooth transaction completion."
    }
];

const benefits = [
    { icon: TrendingUp, title: "Maximum Value", description: "We ensure you get top dollar for your property" },
    { icon: Clock, title: "Fast Sale", description: "Our network helps sell your property quickly" },
    { icon: Shield, title: "Secure Process", description: "Transparent and legally compliant transactions" }
];

export default function SellProperty() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B5B5D]/90 to-[#3B5B5D]/70" />

                <motion.div
                    className="relative z-10 text-center px-6 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Maximize Your Returns</span>
                    <h1
                        className="text-4xl md:text-6xl text-white mt-4 mb-6"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        Sell Your Property
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                        Get the best value for your property with our expert selling services. We handle everything from valuation to closing.
                    </p>
                    <Link href="/contact-us">
                        <button className="bg-[#B4A68C] hover:bg-[#9a8d77] text-white px-10 py-6 tracking-widest uppercase transition-colors duration-300">
                            List Your Property
                        </button>
                    </Link>
                </motion.div>
            </section>

            {/* Benefits Strip */}
            <section className="bg-[#3B5B5D] py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="flex items-center gap-4 text-white"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="w-14 h-14 border border-white/30 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-1">{benefit.title}</h3>
                                        <p className="text-white/70 text-sm">{benefit.description}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Our Process */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Step By Step</span>
                        <h2
                            className="text-4xl text-[#3B5B5D] mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Our Selling Process
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="relative"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                >
                                    <span
                                        className="text-7xl font-light text-[#F2F0EB] absolute top-0 right-0"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {item.step}
                                    </span>
                                    <div className="relative z-10 pt-4">
                                        <div className="w-16 h-16 bg-[#3B5B5D] flex items-center justify-center mb-6">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3
                                            className="text-xl text-[#3B5B5D] mb-3"
                                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="text-[#5a5a5a] text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Sell With Us */}
            <section className="py-24 bg-[#F2F0EB]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">The Advantage</span>
                            <h2
                                className="text-4xl text-[#3B5B5D] mt-4 mb-8"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                Why Sell With Clifton Capital
                            </h2>
                            <div className="space-y-5">
                                {[
                                    "Access to a large network of qualified buyers",
                                    "Professional photography and virtual tours",
                                    "Strategic online and offline marketing",
                                    "Expert price negotiation",
                                    "Complete legal and documentation support",
                                    "Transparent communication throughout"
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <CheckCircle className="w-5 h-5 text-[#3B5B5D] flex-shrink-0" />
                                        <span className="text-[#5a5a5a]">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                            <Link href="/contact-us" className="mt-10 inline-block">
                                <button className="bg-[#3B5B5D] hover:bg-[#4D6969] text-white px-10 py-6 tracking-widest uppercase transition-all duration-300 flex items-center gap-2">
                                    Get Free Valuation
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&q=80"
                                alt="Sell with us"
                                className="w-full h-[500px] object-cover"
                            />
                            <div className="absolute -bottom-8 -left-8 bg-[#B4A68C] text-white p-8">
                                <span
                                    className="text-5xl font-light block"
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    500+
                                </span>
                                <span className="text-sm tracking-wider">Properties Sold</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
