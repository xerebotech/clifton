"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, FileCheck, Key, Home, Shield, Users, ArrowRight } from 'lucide-react';

const steps = [
    {
        icon: Search,
        step: "01",
        title: "Property Search",
        description: "We curate the best properties matching your requirements, budget, and investment goals."
    },
    {
        icon: FileCheck,
        step: "02",
        title: "Due Diligence",
        description: "Comprehensive property inspection, legal verification, and market analysis."
    },
    {
        icon: Key,
        step: "03",
        title: "Negotiation & Closing",
        description: "Expert negotiation to secure the best deal and seamless transaction completion."
    }
];

const propertyTypes = [
    {
        title: "Luxury Apartments",
        description: "Premium high-rise living in Dubai's most sought-after locations.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
    },
    {
        title: "Villas & Townhouses",
        description: "Spacious family homes in exclusive gated communities.",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80"
    },
    {
        title: "Penthouses",
        description: "Ultra-luxury penthouse living with panoramic city views.",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80"
    },
    {
        title: "Off-Plan Projects",
        description: "Early investment opportunities in upcoming developments.",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80"
    }
];

export default function BuyProperty() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B5B5D]/90 to-[#3B5B5D]/70" />

                <motion.div
                    className="relative z-10 text-center px-6 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Find Your Dream Home</span>
                    <h1
                        className="text-4xl md:text-6xl text-white mt-4 mb-6"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        Buy a Property
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                        Find your dream home with our curated selection of premium properties. We make the buying process seamless and stress-free.
                    </p>
                    <Link href="/properties">
                        <button className="bg-[#B4A68C] hover:bg-[#1a2622] text-white px-10 py-6 tracking-widest uppercase transition-all duration-300 shadow-xl shadow-[#B4A68C]/20 active:scale-[0.98]">
                            View Property Collection
                        </button>
                    </Link>
                </motion.div>
            </section>

            {/* Process Steps */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">How It Works</span>
                        <h2
                            className="text-4xl text-[#3B5B5D] mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Our Buying Process
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="relative text-center p-8"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.15 }}
                                    viewport={{ once: true }}
                                >
                                    <span
                                        className="text-8xl font-light text-[#F2F0EB] absolute top-0 left-1/2 -translate-x-1/2"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {step.step}
                                    </span>
                                    <div className="relative z-10 pt-8">
                                        <div className="w-20 h-20 mx-auto bg-[#3B5B5D] flex items-center justify-center mb-6">
                                            <Icon className="w-10 h-10 text-white" />
                                        </div>
                                        <h3
                                            className="text-2xl text-[#3B5B5D] mb-4"
                                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                        >
                                            {step.title}
                                        </h3>
                                        <p className="text-[#5a5a5a] leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Property Types */}
            <section className="py-24 bg-[#F2F0EB]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">What We Offer</span>
                        <h2
                            className="text-4xl text-[#3B5B5D] mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Property Types
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {propertyTypes.map((type, index) => (
                            <Link href="/properties" key={index}>
                                <motion.div
                                    className="group cursor-pointer"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="relative h-72 overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={type.image}
                                            alt={type.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-all duration-500 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-md px-6 py-3 text-[10px] font-bold text-navy uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                Discover Properties
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                            <h3
                                                className="text-xl text-white mb-2"
                                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                            >
                                                {type.title}
                                            </h3>
                                            <p className="text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                {type.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80"
                                alt="Why Choose Us"
                                className="w-full h-[500px] object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Why Us</span>
                            <h2
                                className="text-4xl text-[#3B5B5D] mt-4 mb-8"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                Why Buy With Us
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { icon: Shield, text: "Verified and vetted properties only" },
                                    { icon: Users, text: "Expert guidance throughout the process" },
                                    { icon: Home, text: "Access to exclusive off-market listings" },
                                    { icon: FileCheck, text: "Complete documentation support" }
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#F2F0EB] flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-6 h-6 text-[#3B5B5D]" />
                                            </div>
                                            <span className="text-[#5a5a5a]">{item.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <Link href="/contact-us" className="mt-10 inline-block">
                                <button className="bg-[#3B5B5D] hover:bg-[#4D6969] text-white px-10 py-6 tracking-widest uppercase transition-all duration-300 flex items-center gap-2">
                                    Contact Us
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
