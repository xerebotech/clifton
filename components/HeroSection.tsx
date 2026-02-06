"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const slides = [
    {
        title: "Most Trusted Real Estate Agency",
        subtitle: "With a strong commitment to customer-centricity and ethics, our organization has built a flawless track record of meeting our clients' investment objectives.",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80"
    },
    {
        title: "Most Promising Real Estate Market",
        subtitle: "Dubai offers exceptional opportunities for real estate investors, boasting substantial potential for capital appreciation and rental yields.",
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920&q=80"
    },
    {
        title: "Make The Right Decisions",
        subtitle: "We take the time to thoroughly understand our clients' investment plans and goals, curating the most suitable market options for them.",
        image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=1920&q=80"
    }
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h1
                            className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-wide"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            {slides[currentSlide].title}
                        </h1>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                            {slides[currentSlide].subtitle}
                        </p>
                        <Link
                            href="/contact-us"
                            className="inline-block bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white hover:text-[#23312D] px-10 py-4 text-base tracking-widest uppercase transition-all duration-500 rounded-sm"
                        >
                            Contact Us
                        </Link>
                    </motion.div>
                </AnimatePresence>

                {/* Slide indicators */}
                <div className="absolute bottom-32 flex gap-3">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-12 h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'bg-white' : 'bg-white/30'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-10"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <ChevronDown className="w-8 h-8 text-white/60" />
                </motion.div>
            </div>
        </section>
    );
}
