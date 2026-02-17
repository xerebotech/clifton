"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { submitInquiry } from '@/lib/inquiryService';

const contactInfo = [
    {
        icon: MapPin,
        title: "Visit Us",
        content: "508, Sultan business centre, Oud metha, Dubai",
        subtext: "Dubai, UAE",
        link: "https://maps.app.goo.gl/A8C2Rnh5k1rqJkmdA",
        type: "address"
    },
    {
        icon: Phone,
        title: "Call Us",
        content: "+971 55 930 4697",
        subtext: "24/7 Support Available",
        link: "tel:+971559304697",
        type: "phone"
    },
    {
        icon: Mail,
        title: "Email Us",
        content: "realestate@cliftonuae.com",
        subtext: "We reply within 24 hours",
        link: "mailto:realestate@cliftonuae.com",
        type: "email"
    },
    { icon: Clock, title: "Working Hours", content: "Sun - Thu: 9AM - 6PM", subtext: "Fri - Sat: Closed" }
];

export default function Contact() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ContactContent />
        </Suspense>
    );
}

function ContactContent() {
    const searchParams = useSearchParams();
    const serviceParam = searchParams.get('service');

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

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });

    useEffect(() => {
        if (serviceParam) {
            setFormData(prev => ({ ...prev, service: serviceParam }));
        }
    }, [serviceParam]);

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            projectOrService: formData.service || "General Inquiry (Contact Page)",
            ...utmParams
        });

        setIsSubmitting(false);
        if (success) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', service: '', message: '' });
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3B5B5D]/90 to-[#3B5B5D]/70" />

                <motion.div
                    className="relative z-10 text-center px-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Get In Touch</span>
                    <h1
                        className="text-4xl md:text-6xl text-white mt-4"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        Contact Us
                    </h1>
                </motion.div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-20">
                        {contactInfo.map((info, index) => {
                            const Icon = info.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="bg-white p-8 shadow-xl text-center hover:shadow-2xl transition-shadow duration-300"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <div className="w-16 h-16 mx-auto bg-[#3B5B5D] flex items-center justify-center mb-6">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3
                                        className="text-lg text-[#3B5B5D] mb-2"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {info.title}
                                    </h3>
                                    {info.link ? (
                                        <a
                                            href={info.link}
                                            target={info.type === 'address' ? "_blank" : undefined}
                                            rel={info.type === 'address' ? "noopener noreferrer" : undefined}
                                            className="text-[#3B5B5D] font-medium hover:text-[#AE9573] transition-colors duration-300 truncate block w-full"
                                            onClick={() => trackClick(info.type || 'link', info.content)}
                                        >
                                            {info.content}
                                        </a>
                                    ) : (
                                        <p className="text-[#3B5B5D] font-medium">{info.content}</p>
                                    )}
                                    <p className="text-[#A5A19D] text-sm mt-1">{info.subtext}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="py-20 bg-[#F2F0EB]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="text-[#B4A68C] text-sm tracking-[0.3em] uppercase">Send Us a Message</span>
                            <h2
                                className="text-4xl text-[#3B5B5D] mt-4 mb-8"
                                style={{ fontFamily: 'var(--font-cinzel), serif' }}
                            >
                                Let&apos;s Start a Conversation
                            </h2>

                            {submitted ? (
                                <motion.div
                                    className="flex flex-col items-center justify-center py-20 bg-white"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <CheckCircle className="w-20 h-20 text-[#3B5B5D] mb-6" />
                                    <p className="text-[#3B5B5D] text-2xl" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Thank You!</p>
                                    <p className="text-[#A5A19D] mt-2">We&apos;ll get back to you shortly.</p>
                                </motion.div>
                            ) : (
                                <form id="contact-page-form" onSubmit={handleSubmit} className="bg-white p-10 shadow-lg space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm text-[#23312D] mb-2 block font-medium">First Name *</label>
                                            <input
                                                id="contact-page-first-name"
                                                name="firstName"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#23312D] mb-2 block font-medium">Last Name *</label>
                                            <input
                                                id="contact-page-last-name"
                                                name="lastName"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm text-[#23312D] mb-2 block font-medium">Your Email *</label>
                                            <input
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#23312D] mb-2 block font-medium">Phone Number</label>
                                            <input
                                                placeholder="+971 XX XXX XXXX"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const cleaned = val.replace(/[^\d+]/g, '');
                                                    if (val !== cleaned) {
                                                        alert("Please enter numbers only");
                                                    }
                                                    setFormData({ ...formData, phone: cleaned });
                                                }}
                                                className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm text-[#23312D] mb-2 block font-medium">Service of Interest</label>
                                        <select
                                            value={formData.service}
                                            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                            className="w-full h-14 px-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D]"
                                        >
                                            <option value="" disabled>Select Service</option>
                                            <option value="Buying">Buying a Property</option>
                                            <option value="Selling">Selling a Property</option>
                                            <option value="Renting">Renting</option>
                                            <option value="Management">Property Management</option>
                                            <option value="Investment">Investment Consultation</option>
                                            <option value="Other">General Inquiry</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-[#23312D] mb-2 block font-medium">Your Message *</label>
                                        <textarea
                                            placeholder="Tell us about your requirements..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                            className="w-full min-h-[150px] p-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white resize-none text-[#23312D] placeholder:text-[#23312D]/50"
                                        />
                                    </div>
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
                                </form>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                            onClick={() => {
                                if (typeof window !== 'undefined' && (window as any).dataLayer) {
                                    (window as any).dataLayer.push({
                                        event: 'map_interaction',
                                        map_location: 'Sultan Business Centre, Dubai'
                                    });
                                }
                            }}
                        >
                            <div className="h-full min-h-[500px] w-full bg-[#f2f0eb] rounded-xl overflow-hidden shadow-lg border-4 border-transparent hover:border-[#3B5B5D]/10 transition-colors">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3609.1000183593183!2d55.30871200000001!3d25.233556!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f42cc28ba49af%3A0x57bbd7cd1311987e!2sSultan%20Business%20Centre!5e0!3m2!1sen!2sin!4v1769682109943!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: '500px' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >
        </div >
    );
}
