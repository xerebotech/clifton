"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
const faqs = [
    {
        question: "How do I qualify for the UAE Golden Visa through Real Estate?",
        answer: "Invest in property worth at least AED 2 Million for a 10-year Golden Visa. All 10 properties in our portfolio qualify. Clifton Capital handles the entire process — purchase, title deed, and visa application."
    },
    {
        question: "Is there any property or income tax in Dubai?",
        answer: "No. Zero personal income tax, zero capital gains tax, zero property tax. Only a one-time 4% DLD registration fee at purchase. Rental income is 100% yours."
    },
    {
        question: "What ROI can I expect from off-plan property?",
        answer: "Our portfolio offers gross yields from 4.2% to 6.5%, with expected appreciation of 7-10% annually. On 20% down payment, cash-on-cash returns can exceed 20%. Use our ROI calculator on each property card."
    },
    {
        question: "Can foreigners 100% own property in Dubai?",
        answer: "Yes. Foreigners can own freehold property in designated areas. All 10 of our properties are in freehold zones. Full ownership and title deed in your name."
    },
    {
        question: "What payment plans are available?",
        answer: "Emaar 80/20, Meraas 60/40, Ellington 70/30, Rove 50/50. Down payments from 20% (AED 440K). No mortgage needed during construction. Developer-direct pricing."
    },
    {
        question: "What does Clifton Capital handle after purchase?",
        answer: "Everything. Tenant finding, property management referral, Golden Visa processing, DEWA setup, Power of Attorney, and annual PRO services."
    }
];

export default function InvestorFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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
                        <FAQItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQItem({ faq, index, isOpen, onToggle }: { faq: any, index: number, isOpen: boolean, onToggle: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-b border-[#23312D]/10 bg-white shadow-sm overflow-hidden"
        >
            <button
                onClick={onToggle}
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
