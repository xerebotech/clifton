"use client";

import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { submitInquiry } from '@/lib/inquiryService';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, RefreshCw } from 'lucide-react';
import { sortedCountries } from '@/lib/countries';

export default function ContactSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', countryCode: '+971', service: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await submitInquiry({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: `${formData.countryCode} ${formData.phone}`,
            message: formData.message,
            projectOrService: formData.service || "General Inquiry"
        });

        setIsSubmitting(false);
        if (success) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', countryCode: '+971', service: '', message: '' });
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
                                                id="contact-first-name"
                                                name="firstName"
                                                type="text"
                                                placeholder="First Name"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                            <input
                                                id="contact-last-name"
                                                name="lastName"
                                                type="text"
                                                placeholder="Last Name"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                placeholder="Your Email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                            <div className="flex gap-4">
                                                <select
                                                    value={formData.countryCode}
                                                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                                    className="w-32 h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D] appearance-none"
                                                    style={{ backgroundPosition: 'calc(100% - 10px) center', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray' %3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundSize: '10px' }}
                                                >
                                                    {sortedCountries.map(c => (
                                                        <option key={c.code} value={c.dialCode}>
                                                            {c.code} ({c.dialCode})
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    id="contact-phone"
                                                    name="phone"
                                                    type="tel"
                                                    placeholder="Phone Number"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="flex-1 h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-transparent text-[#23312D] placeholder:text-[#23312D]/50"
                                                />
                                            </div>
                                        </div>
                                        <select
                                            id="contact-service"
                                            name="service"
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
                                            id="contact-message"
                                            name="message"
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