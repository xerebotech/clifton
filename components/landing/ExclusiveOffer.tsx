"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ExclusiveOffer() {
    return (
        <section className="py-20 bg-[#23312D] relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#AE9573]/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#AE9573]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 border border-[#AE9573]/30 rounded-full text-[#AE9573] text-[10px] tracking-[0.3em] uppercase mb-8">
                            Limited Availability
                        </span>

                        <h2
                            className="text-5xl md:text-7xl lg:text-8xl text-white mb-10 leading-[1.1]"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            SECURE YOUR <br />
                            <span className="italic font-light text-[#AE9573]">LEGACY</span> IN DUBAI
                        </h2>

                        <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-16 font-light">
                            Join our exclusive inner circle and gain first-access to the most anticipated developments and off-market opportunities.
                        </p>

                        <div className="flex flex-col items-center gap-12">
                            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl">
                                <div className="flex-1 relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                                    <input
                                        type="email"
                                        placeholder="Enter your professional email"
                                        className="w-full h-16 bg-white/5 border border-white/10 rounded-sm pl-16 pr-6 text-white outline-none focus:border-[#AE9573] transition-colors font-light placeholder:text-white/50"
                                    />
                                </div>
                                <button className="h-16 px-10 bg-[#AE9573] text-white hover:bg-[#c4a982] transition-colors tracking-widest uppercase font-bold text-sm whitespace-nowrap rounded-sm flex items-center justify-center gap-3">
                                    Request Access <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>

                            <p className="text-white/30 text-xs tracking-wider">
                                Or contact our private office directly at <span className="text-white/60 underline cursor-pointer">+971 (0) 4 123 4567</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
