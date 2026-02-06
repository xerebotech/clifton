"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { submitInquiry } from '@/lib/inquiryService';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, RefreshCw } from 'lucide-react';

export default function ContactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await submitInquiry({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            projectOrService: formData.service || "General Inquiry"
        });

        setIsSubmitting(false);
        if (success) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        }
    };

    const contactInfo = [
        { icon: MapPin, title: "Address", content: "508, Sultan business centre, Oud metha, Dubai" },
        { icon: Phone, title: "Phone", content: "+971 55 930 4697" },
        { icon: Mail, title: "Email", content: "realestate@cliftonuae.com" },
        { icon: Clock, title: "Working Hours", content: "Sun - Thu: 9AM - 6PM" }
    ];

    return (
        <section ref={ref} id="contact" className="py-24 md:py-32 bg-[#F2F0EB]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase">Get In Touch</span>
                        <h2
                            className="text-4xl md:text-5xl text-[#23312D] mt-4 mb-8"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            Contact Us
                        </h2>
                        <p className="text-[#5a5a5a] leading-relaxed mb-12">
                            Ready to start your real estate journey in Dubai? Our team of experts is here to guide you every step of the way. Reach out to us today.
                        </p>

                        <div className="space-y-8">
                            {contactInfo.map((info, index) => {
                                const Icon = info.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        className="flex items-start gap-5"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                    >
                                        <div className="w-14 h-14 bg-[#23312D] flex items-center justify-center flex-shrink-0">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#23312D] font-medium mb-1">{info.title}</h4>
                                            <p className="text-[#5a5a5a]">{info.content}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="bg-white p-10 shadow-xl">
                            <h3
                                className="text-2xl text-[#23312D] mb-8"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                Send Us a Message
                            </h3>

                            <AnimatePresence mode="wait">
                                {submitted ? (
                                    <motion.div
                                        key="success"
                                        className="flex flex-col items-center justify-center py-16"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <CheckCircle className="w-16 h-16 text-[#00594F] mb-4" />
                                        <p className="text-[#23312D] text-xl">Thank you for your message!</p>
                                        <p className="text-[#A5A19D] mt-2">We&apos;ll get back to you shortly.</p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <input
                                                placeholder="Your Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                        </div>
                                        <input
                                            placeholder="Phone Number"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D] placeholder:text-[#23312D]/50"
                                        />
                                        <select
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                            className="w-full h-14 px-4 mb-6 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D]"
                                        >
                                            <option value="" disabled>Select Service of Interest</option>
                                            <option value="Buying">Buying a Property</option>
                                            <option value="Selling">Selling a Property</option>
                                            <option value="Renting">Renting</option>
                                            <option value="Management">Property Management</option>
                                            <option value="Investment">Investment Consultation</option>
                                            <option value="Other">General Inquiry</option>
                                        </select>
                                        <textarea
                                            placeholder="Your Message"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            className="w-full min-h-[150px] p-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent resize-none text-[#23312D] placeholder:text-[#23312D]/50"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full h-14 bg-[#00594F] hover:bg-[#004a3f] text-white rounded-none tracking-widest uppercase transition-all duration-500 flex items-center justify-center font-medium disabled:opacity-50"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
