"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "How do I qualify for the UAE Golden Visa through Real Estate?",
        answer: "To qualify for the 10-year Golden Visa, you need to invest in a property with a value of at least AED 2 Million. This can be a single property or a portfolio, and it includes off-plan properties provided the investment meets the minimum threshold."
    },
    {
        question: "Is there any property or income tax in Dubai?",
        answer: "Dubai offers a 100% tax-free environment for real estate. There is no personal income tax, no capital gains tax, and no annual property taxes. You only pay a one-time 4% DLD (Dubai Land Department) transfer fee at the time of purchase."
    },
    {
        question: "What kind of ROI can I expect from luxury rentals?",
        answer: "Prime areas in Dubai currently offer some of the highest yields globally, typically ranging between 6% to 10% net ROI. Short-term holiday rentals (Airbnb model) can often exceed this during peak seasons."
    },
    {
        question: "Can foreigners 100% own property in Dubai?",
        answer: "Yes, in designated 'Freehold' areas, foreigners (non-GCC nationals) have 100% ownership rights of the property and the land it sits on forever. Most of the popular luxury areas like Downtown, Dubai Marina, and Palm Jumeirah are freehold."
    }
];

export default function InvestorFAQ() {
    return (
        <section id="faq" className="py-32 bg-[#F9F8F6]">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase block mb-4">Investment Clarity</span>
                    <h2
                        className="text-4xl md:text-5xl text-[#23312D]"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        FREQUENTLY ASKED <span className="italic">QUESTIONS</span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} faq={faq} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ faq, index }: { faq: any, index: number }) {
    const [isOpen, setIsOpen] = useState(index === 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-[#23312D]/10 bg-white shadow-sm overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-8 px-8 flex items-center justify-between text-left group transition-colors"
            >
                <span
                    className={`text-xl md:text-2xl pr-8 transition-colors ${isOpen ? 'text-[#AE9573]' : 'text-[#23312D]'}`}
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                >
                    {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border border-[#23312D]/10 flex items-center justify-center transition-all ${isOpen ? 'bg-[#23312D] text-white border-[#23312D]' : 'group-hover:border-[#AE9573] text-[#23312D]'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-8 pb-8 text-gray-500 leading-relaxed font-light">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
