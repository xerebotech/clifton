"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Send, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { submitInquiry } from '@/lib/inquiryService';
import PhoneInput from '../ui/PhoneInput';

interface StrategySessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyName?: string;
}

export default function StrategySessionModal({ isOpen, onClose, propertyName }: StrategySessionModalProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: propertyName ? `Invest in ${propertyName}` : 'General Strategy Session'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await submitInquiry({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            projectOrService: "Strategy Session"
        });

        setIsSubmitting(false);
        if (success) {
            setSubmitted(true);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xl" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl relative overflow-hidden"
                >
                    {/* Header Gradient */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-navy via-copper to-navy" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-gray-400 hover:text-navy transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="p-8 md:p-10">
                        {submitted ? (
                            <div className="text-center py-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-deep-teal/10 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle className="w-10 h-10 text-deep-teal" />
                                </motion.div>
                                <h3 className="font-cinzel text-2xl font-bold text-navy mb-4 uppercase tracking-tight">Session Requested</h3>
                                <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
                                    Thank you. Our senior investment advisor will contact you within 24 hours to confirm your private strategy session.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 bg-navy text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-navy/90 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-10">
                                    <div className="w-16 h-16 bg-copper/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-8 h-8 text-copper" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-cinzel text-2xl font-bold text-navy mb-2 uppercase tracking-tight">Free Strategy Session</h3>
                                    <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Private Investment Consultation</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                placeholder="John"
                                                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-navy outline-none focus:border-copper transition-colors text-sm font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                placeholder="Doe"
                                                className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-navy outline-none focus:border-copper transition-colors text-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                            className="w-full h-12 px-4 bg-gray-50 border border-gray-100 rounded-xl text-navy outline-none focus:border-copper transition-colors text-sm font-medium"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <PhoneInput
                                            value={formData.phone}
                                            onChange={(val) => setFormData({ ...formData, phone: val })}
                                            className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl focus-within:border-copper transition-colors text-sm"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 bg-navy hover:bg-[#1a2622] text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-navy/20 active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Processing Application...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Book Strategy Session <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
                                    By booking a session, you agree to our <strong>Terms</strong> and <strong>Privacy Policy</strong>. We value your privacy and won&apos;t share your details.
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
