"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    FileSearch,
    Wrench,
    Wallet,
    CheckCircle,
    ArrowRight,
    Shield,
    Clock,
    Percent
} from 'lucide-react';

const services = [
    {
        icon: Users,
        title: "Tenant Screening",
        description: "Thorough background checks and verification to find reliable, qualified tenants."
    },
    {
        icon: FileSearch,
        title: "Lease Management",
        description: "Professional lease preparation, renewals, and compliance with local regulations."
    },
    {
        icon: Wrench,
        title: "Property Maintenance",
        description: "Regular inspections and coordinated repairs to maintain your property's value."
    },
    {
        icon: Wallet,
        title: "Rent Collection",
        description: "Timely rent collection and transparent financial reporting."
    }
];

const benefits = [
    { icon: Percent, value: "8-9%", label: "Average Rental Yield" },
    { icon: Clock, value: "2 Weeks", label: "Average Time to Rent" },
    { icon: Shield, value: "100%", label: "Tenant Verification" }
];

export default function RentProperty() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B5B5D]/90 to-[#3B5B5D]/70" />

                <motion.div
                    className="relative z-10 text-center px-6 max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Maximize Your Income</span>
                    <h1
                        className="text-4xl md:text-6xl text-white mt-4 mb-6"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        Rent Your Property
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                        Maximize your rental income with our professional property management services. We handle everything while you enjoy the returns.
                    </p>
                    <Link href="/contact-us">
                        <button className="bg-[#B4A68C] hover:bg-[#9a8d77] text-white px-10 py-6 tracking-widest uppercase transition-all duration-300">
                            List For Rent
                        </button>
                    </Link>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="bg-[#3B5B5D] py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="text-center text-white"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Icon className="w-10 h-10 mx-auto mb-4 text-[#B4A68C]" />
                                    <span
                                        className="text-5xl font-light block mb-2"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {benefit.value}
                                    </span>
                                    <span className="text-white/70 text-sm tracking-wider">{benefit.label}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-24 bg-white">
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
                            Property Management Services
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="p-8 bg-[#F2F0EB] group hover:bg-[#3B5B5D] transition-all duration-500"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="w-16 h-16 bg-white flex items-center justify-center mb-6 group-hover:bg-[#B4A68C] transition-colors duration-500">
                                        <Icon className="w-8 h-8 text-[#3B5B5D] group-hover:text-white transition-colors duration-500" />
                                    </div>
                                    <h3
                                        className="text-xl text-[#3B5B5D] group-hover:text-white mb-3 transition-colors duration-500"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {service.title}
                                    </h3>
                                    <p className="text-[#5a5a5a] group-hover:text-white/80 text-sm leading-relaxed transition-colors duration-500">
                                        {service.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* For Landlords Section */}
            <section className="py-24 bg-[#F2F0EB]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80"
                                alt="For Landlords"
                                className="w-full h-[500px] object-cover"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">For Property Owners</span>
                            <h2
                                className="text-4xl text-[#3B5B5D] mt-4 mb-8"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                Why List With Us
                            </h2>
                            <div className="space-y-5">
                                {[
                                    "Comprehensive marketing to reach quality tenants",
                                    "Competitive rental pricing analysis",
                                    "Professional photography and listings",
                                    "24/7 tenant support and emergency handling",
                                    "Regular property inspections",
                                    "Transparent monthly financial statements"
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
                                    Get Started
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
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
                            Ready to Maximize Your Rental Income?
                        </h2>
                        <p className="text-white/80 text-lg mb-10">
                            Contact us today for a free rental assessment of your property.
                        </p>
                        <Link href="/contact-us">
                            <button className="bg-white text-[#3B5B5D] hover:bg-[#B4A68C] hover:text-white px-10 py-6 tracking-widest uppercase transition-all duration-500 flex items-center justify-center gap-2 mx-auto">
                                Contact Us Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
