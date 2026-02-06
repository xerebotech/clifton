"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
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
                        Terms of Service
                    </motion.h1>
                    <p className="text-white/60 font-light tracking-wide">Last updated: February 5, 2026</p>
                </div>
            </section>

            {/* Content */}
            <section className="py-24">
                <div className="max-w-4xl mx-auto px-6 prose prose-lg prose-headings:font-cinzel prose-headings:text-[#23312D] text-gray-600 font-light leading-relaxed">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-normal mb-4">1. Agreement to Terms</h2>
                            <p>
                                By accessing or using the website of Clifton Capital Real Estate LLC, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">2. Intellectual Property</h2>
                            <p>
                                The service and its original content, features, and functionality are and will remain the exclusive property of Clifton Capital Real Estate LLC. Our trademarks may not be used in connection with any product or service without the prior written consent of Clifton Capital.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">3. Links to Other Websites</h2>
                            <p>
                                Our Service may contain links to third-party web sites or services that are not owned or controlled by Clifton Capital. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party websites.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">4. Limitation of Liability</h2>
                            <p>
                                In no event shall Clifton Capital Real Estate LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">5. Governing Law</h2>
                            <p>
                                These Terms shall be governed and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-normal mb-4">6. Changes</h2>
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days notice prior to any new terms taking effect.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
