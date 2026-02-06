"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
    return (
        <div className="bg-[#fcfcfc] min-h-screen">
            {/* Header / Hero */}
            <section className="pt-40 pb-20 bg-[#23312D] text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl mb-6"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        Privacy Policy
                    </motion.h1>
                    <p className="text-white/60 font-light tracking-wide">Last updated: February 5, 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 prose prose-lg prose-headings:font-cinzel prose-headings:text-[#23312D] text-gray-600 font-light leading-relaxed">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-normal mb-4">1. Introduction</h2>
                            <p>
                                Welcome to Clifton Capital Real Estate LLC. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">2. The Data We Collect</h2>
                            <p>
                                Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 mt-4 space-y-2">
                                <li>Identity Data (name, username)</li>
                                <li>Contact Data (email address, telephone numbers)</li>
                                <li>Technical Data (IP address, browser type, location)</li>
                                <li>Usage Data (information about how you use our website)</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">3. How Your Data Is Collected</h2>
                            <p>
                                We use different methods to collect data from and about you including through direct interactions (filling in forms) and automated technologies (cookies, server logs).
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">4. How We Use Your Data</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to register you as a new customer, manage our relationship with you, and improve our website and services.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            </p>
                            <p className="mt-4 font-normal text-[#23312D]">
                                Email: privacy@cliftoncapital.com<br />
                                Phone: +971 (0) 4 123 4567<br />
                                Address: Dubai Marina, Dubai, UAE
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
