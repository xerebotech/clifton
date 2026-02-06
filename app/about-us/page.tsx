"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Eye, Heart, Shield, Award, TrendingUp, CheckCircle, Quote, ArrowRight, Phone, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

// Animated Counter Component
function AnimatedCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

            setCount(Math.floor(progress * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutUs() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#23312D]/95 to-[#23312D]/75" />

                <motion.div
                    className="relative z-10 text-center px-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">Who We Are</span>
                    <h1
                        className="text-4xl md:text-6xl text-white mt-4 leading-tight"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        About Clifton Capital
                    </h1>
                    <p className="mt-6 text-white/70 max-w-2xl mx-auto text-lg">
                        Dubai's Most Trusted Real Estate Agency
                    </p>
                </motion.div>
            </section>

            {/* Animated Stats Section */}
            <section className="py-20 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: 500, suffix: "+", label: "Properties Sold" },
                            { value: 100, suffix: "%", label: "Client Satisfaction" },
                            { value: 15, suffix: "+", label: "Years Experience" },
                            { value: 100, suffix: "M+", label: "Portfolio Value (AED)" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div
                                    className="text-5xl md:text-6xl font-bold text-[#00594F] mb-2"
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-gray-600 text-sm uppercase tracking-wider">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">Our Story</span>
                            <h2
                                className="text-4xl text-[#23312D] mt-4 mb-8 leading-tight"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                CLIFTON CAPITAL<br />REAL ESTATE LLC
                            </h2>
                            <div className="space-y-6 text-gray-600 leading-relaxed">
                                <p>
                                    With a strong commitment to customer-centricity and ethics, under the guidance of our founder and renowned real estate expert, our organization has built a flawless track record of meeting our clients' investment objectives.
                                </p>
                                <p>
                                    We turn dream homes into reality and help sellers get top dollar for their properties. With our deep market expertise and personal service, we make real estate transactions seamless and stress-free.
                                </p>
                                <p>
                                    We specialize in real estate portfolio management, guiding investors to optimal investment choices and ensuring robust returns. This dedication to excellence has resulted in achieving 100% customer satisfaction.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"
                                alt="Our Office"
                                className="w-full h-[500px] object-cover rounded-lg shadow-2xl"
                            />
                            <div className="absolute -bottom-8 -left-8 bg-[#23312D] text-white p-8 rounded-lg shadow-xl">
                                <span
                                    className="text-5xl font-light block"
                                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                >
                                    100%
                                </span>
                                <span className="text-sm tracking-wider opacity-80">Client Satisfaction</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values - Mission & Vision */}
            <section className="py-24 bg-gradient-to-br from-[#23312D] to-[#1a2521] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-[#AE9573] rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">What Drives Us</span>
                        <h2
                            className="text-4xl md:text-5xl text-white mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            OUR VALUES
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Mission */}
                        <motion.div
                            className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        >
                            <div className="w-16 h-16 bg-[#AE9573] rounded-full flex items-center justify-center mb-6">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3
                                className="text-2xl text-white mb-4"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                Mission
                            </h3>
                            <p className="text-white/80 leading-relaxed">
                                To revolutionize real estate portfolio management by delivering client-centric solutions that maximize investment returns and elevate property value, fostering enduring partnerships rooted in trust and excellence.
                            </p>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-2xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        >
                            <div className="w-16 h-16 bg-[#00594F] rounded-full flex items-center justify-center mb-6">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h3
                                className="text-2xl text-white mb-4"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                Vision
                            </h3>
                            <p className="text-white/80 leading-relaxed">
                                Our mission is to provide exceptional real estate portfolio management services with a focus on personalized client solutions, and unwavering commitment to integrity and transparency and long-term success for our clients.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Founder */}
            <section className="py-24 bg-[#F2F0EB]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">Leadership</span>
                        <h2
                            className="text-4xl md:text-5xl text-[#23312D] mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            OUR FOUNDER
                        </h2>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/founder.jpg"
                                    alt="Mr. Akhil Saja Vijay"
                                    className="w-full h-[600px] object-cover rounded-2xl shadow-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#23312D]/80 to-transparent rounded-2xl" />
                                <div className="absolute bottom-8 left-8 right-8 text-white">
                                    <h3
                                        className="text-3xl mb-2"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        Mr. Akhil Saja Vijay
                                    </h3>
                                    <p className="text-[#AE9573] text-sm tracking-wider uppercase">Founder & CEO</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                <div className="relative">
                                    <Quote className="w-12 h-12 text-[#AE9573] opacity-20 absolute -top-4 -left-2" />
                                    <p className="text-gray-700 leading-relaxed text-lg pl-8">
                                        Our founder, <span className="font-semibold text-[#23312D]">Mr. Akhil Saja Vijay</span>, is a renowned social media influencer with a global following, revered by investors for his educational content on Dubai real estate.
                                    </p>
                                </div>

                                <p className="text-gray-600 leading-relaxed">
                                    Personally managing a real estate portfolio valued at nearly <span className="font-bold text-[#23312D]">100 million dirhams</span>, Mr. Akhil is dedicated to positioning Clifton Capital as Dubai's most trusted real estate agency.
                                </p>

                                <p className="text-gray-600 leading-relaxed">
                                    His commitment to exceptional customer service ensures every client receives unparalleled attention and satisfaction with our comprehensive services.
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    <div className="bg-white p-6 rounded-xl shadow-md">
                                        <div
                                            className="text-4xl font-bold text-[#00594F] mb-2"
                                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                        >
                                            <AnimatedCounter end={100} suffix="M+" />
                                        </div>
                                        <div className="text-sm text-gray-600 uppercase tracking-wider">Portfolio Value (AED)</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-md">
                                        <div
                                            className="text-4xl font-bold text-[#00594F] mb-2"
                                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                        >
                                            Global
                                        </div>
                                        <div className="text-sm text-gray-600 uppercase tracking-wider">Social Media Reach</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Awards & Certifications */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">Trust & Recognition</span>
                        <h2
                            className="text-4xl md:text-5xl text-[#23312D] mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Awards & Certifications
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "RERA Certified", description: "Licensed by Dubai Land Department", icon: Shield },
                            { title: "Top Agency 2024", description: "Recognized for Excellence", icon: Award },
                            { title: "100% Satisfaction", description: "Client Approved Rating", icon: CheckCircle },
                            { title: "Trusted Partner", description: "Premier Developer Network", icon: TrendingUp }
                        ].map((cert, index) => {
                            const Icon = cert.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="bg-[#F2F0EB] p-8 rounded-xl text-center group hover:bg-[#23312D] transition-all duration-300"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="w-20 h-20 mx-auto bg-[#23312D] group-hover:bg-[#AE9573] rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
                                        <Icon className="w-10 h-10 text-[#AE9573] group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3
                                        className="text-xl text-[#23312D] group-hover:text-white mb-3 transition-colors duration-300"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {cert.title}
                                    </h3>
                                    <p className="text-gray-600 group-hover:text-white/80 text-sm transition-colors duration-300">
                                        {cert.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Core Principles */}
            <section className="py-24 bg-[#F2F0EB]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">Our Commitment</span>
                        <h2
                            className="text-4xl text-[#23312D] mt-4"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Core Principles
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Heart, title: "Client-Centric", description: "Personalized service tailored to your unique needs" },
                            { icon: Shield, title: "Trust & Integrity", description: "Transparent, honest, and ethical business practices" },
                            { icon: Award, title: "Excellence", description: "Striving for perfection in every transaction" },
                            { icon: TrendingUp, title: "Market Expertise", description: "Deep understanding of Dubai's real estate dynamics" }
                        ].map((principle, index) => {
                            const Icon = principle.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="bg-white p-8 rounded-xl text-center hover:shadow-xl transition-shadow duration-300"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="w-16 h-16 mx-auto bg-[#23312D] rounded-full flex items-center justify-center mb-6">
                                        <Icon className="w-8 h-8 text-[#AE9573]" />
                                    </div>
                                    <h3
                                        className="text-xl text-[#23312D] mb-4"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {principle.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {principle.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-[#00594F] to-[#004a3f] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#AE9573] rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2
                            className="text-4xl md:text-5xl text-white mb-6 leading-tight"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Ready to Start Your Investment Journey?
                        </h2>
                        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                            Let our expert team guide you to the perfect property investment in Dubai. Schedule a consultation today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/contact"
                                className="group px-8 py-4 bg-white text-[#00594F] rounded-lg font-semibold flex items-center gap-2 hover:bg-[#AE9573] hover:text-white transition-all duration-300 shadow-xl"
                            >
                                <Calendar className="w-5 h-5" />
                                Book a Consultation
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <a
                                href="tel:+971559304697"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-white hover:text-[#00594F] transition-all duration-300"
                            >
                                <Phone className="w-5 h-5" />
                                Call Us Now
                            </a>

                            <a
                                href="mailto:realestate@cliftonuae.com"
                                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-white hover:text-[#00594F] transition-all duration-300"
                            >
                                <Mail className="w-5 h-5" />
                                Email Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
