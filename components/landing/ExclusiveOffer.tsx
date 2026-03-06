"use client";

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { submitInquiry } from '@/lib/inquiryService';
import Link from 'next/link';
import PhoneInput from '../ui/PhoneInput';

function ExclusiveOfferContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = React.useState(1);
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);

    // GTM tracking function
    const trackClick = (type: string, value: string) => {
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({
                event: 'contact_link_click',
                link_type: type,
                link_value: value
            });
        }
    };

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const utmParams = {
            utm_source: searchParams.get('utm_source') || '',
            utm_medium: searchParams.get('utm_medium') || '',
            utm_campaign: searchParams.get('utm_campaign') || '',
            utm_term: searchParams.get('utm_term') || '',
            utm_content: searchParams.get('utm_content') || '',
        };

        const success = await submitInquiry({
            firstName,
            lastName,
            email,
            phone,
            message: "Exclusive Offer Access Request",
            projectOrService: "Exclusive Offer",
            ...utmParams
        });

        setIsSubmitting(false);
        if (success) {
            setSubmitted(true);
        }
    };

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
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-[#AE9573]/30 p-10 rounded-sm backdrop-blur-md max-w-lg w-full"
                                >
                                    <h3 className="text-[#AE9573] text-2xl mb-4 font-bold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>ACCESS REQUESTED</h3>
                                    <p className="text-white/70">Thank you. One of our private advisors will reach out to you shortly to complete your verification.</p>
                                </motion.div>
                            ) : (
                                <div className="w-full max-w-xl">
                                    <form id="exclusive-offer-form" onSubmit={step === 1 ? handleNextStep : handleSubmit} className="flex flex-col gap-6">
                                        <div className="relative overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                {step === 1 ? (
                                                    <motion.div
                                                        key="step1"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="flex flex-col sm:flex-row gap-6"
                                                    >
                                                        <div className="flex-1 relative">
                                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                                                            <input
                                                                required
                                                                type="email"
                                                                value={email}
                                                                onChange={(e) => setEmail(e.target.value)}
                                                                placeholder="Enter your professional email"
                                                                className="w-full h-16 bg-white/5 border border-white/10 rounded-sm pl-16 pr-6 text-white outline-none focus:border-[#AE9573] transition-colors font-light placeholder:text-white/50"
                                                            />
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="h-16 px-10 bg-[#AE9573] text-white hover:bg-[#c4a982] transition-colors tracking-widest uppercase font-bold text-sm whitespace-nowrap rounded-sm flex items-center justify-center gap-3"
                                                        >
                                                            Request Access <ArrowRight className="w-5 h-5" />
                                                        </button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="step2"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20 }}
                                                        className="grid md:grid-cols-2 gap-4"
                                                    >
                                                        <input
                                                            required
                                                            type="text"
                                                            value={firstName}
                                                            onChange={(e) => setFirstName(e.target.value)}
                                                            placeholder="First Name"
                                                            className="w-full h-16 bg-white/5 border border-white/10 rounded-sm px-6 text-white outline-none focus:border-[#AE9573] transition-colors font-light placeholder:text-white/50"
                                                        />
                                                        <input
                                                            required
                                                            type="text"
                                                            value={lastName}
                                                            onChange={(e) => setLastName(e.target.value)}
                                                            placeholder="Last Name"
                                                            className="w-full h-16 bg-white/5 border border-white/10 rounded-sm px-6 text-white outline-none focus:border-[#AE9573] transition-colors font-light placeholder:text-white/50"
                                                        />
                                                        <PhoneInput
                                                            value={phone}
                                                            onChange={(val) => setPhone(val)}
                                                            dark={true}
                                                            className="w-full h-16 bg-white/5 border border-white/10 rounded-sm focus-within:border-[#AE9573] transition-colors text-white"
                                                        />
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="md:col-span-1 h-16 bg-[#AE9573] text-white hover:bg-[#c4a982] transition-colors tracking-widest uppercase font-bold text-sm rounded-sm flex items-center justify-center gap-3 disabled:opacity-50"
                                                        >
                                                            {isSubmitting ? "Processing..." : "Submit Details"} <ArrowRight className="w-5 h-5" />
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <p className="text-white/30 text-xs tracking-wider">
                                Or contact our private office directly at <a
                                    href="tel:+971559304697"
                                    className="text-white/60 underline hover:text-[#AE9573] transition-colors"
                                    onClick={() => trackClick('phone', '+971 55 930 4697')}
                                >
                                    +971 55 930 4697
                                </a>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default function ExclusiveOffer() {
    return (
        <Suspense fallback={<div className="py-20 bg-[#23312D] text-center text-[#AE9573]">Loading Exclusive Offer...</div>}>
            <ExclusiveOfferContent />
        </Suspense>
    );
}
