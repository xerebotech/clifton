"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        name: "Vivek Gupta",
        role: "Investor",
        content: "It took me almost one year to make a decision about whether I should invest in Dubai or not and I have discussed it with many realtors in Dubai. Having met the team changed my perspective and they really stood out as market analysts and investment advisors rather than realtors selling properties.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
    },
    {
        name: "Shiva Subramaniam",
        role: "Property Owner",
        content: "Advisors of Clifton Capital are very trustworthy and I could see the kind of effort they are putting in to find the best investment opportunity for us. They handheld me through the whole buying and flipping process.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80"
    },
    {
        name: "Ramesh Nair",
        role: "First-time Buyer",
        content: "The team surely has great knowledge about the market and helped us navigate through all the fancy offers floating in social media. Best thing about them is that all their conclusions are purely numbers or data based and never over promises anything.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80"
    }
];

export default function TestimonialsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <section ref={ref} className="py-24 md:py-32 bg-[#23312D] relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-20 text-white">
                    <Quote className="w-96 h-96" />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">Client&apos;s Testimonials</span>
                    <h2
                        className="text-3xl md:text-4xl text-white mt-4"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        What Our Clients Say About Us
                    </h2>
                </motion.div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={testimonials[current].image}
                                        alt={testimonials[current].name}
                                        className="w-20 h-20 rounded-full object-cover border-4 border-[#AE9573]"
                                    />
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#AE9573] rounded-full flex items-center justify-center">
                                        <Quote className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                            <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8 max-w-3xl mx-auto font-light italic">
                                &quot;{testimonials[current].content}&quot;
                            </p>
                            <h4
                                className="text-white text-xl"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                {testimonials[current].name}
                            </h4>
                            <p className="text-[#AE9573] text-sm tracking-wider mt-2">
                                {testimonials[current].role}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <button
                            onClick={prev}
                            className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#23312D] transition-all duration-300"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex gap-2">
                            {testimonials.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrent(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === current ? 'bg-[#AE9573] w-8' : 'bg-white/30'
                                        }`}
                                    aria-label={`Go to testimonial ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={next}
                            className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#23312D] transition-all duration-300"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
