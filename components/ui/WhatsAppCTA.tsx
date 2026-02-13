"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppCTA() {
    const phoneNumber = "+971559304697"; // As seen in ContactSection
    const message = encodeURIComponent("Hello! I'm interested in luxury property investment opportunities in Dubai. Could you provide more information?");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: 2, // Appear after 2 seconds
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            className="fixed bottom-8 right-8 z-[90]"
        >
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center"
            >
                {/* Ping Animation */}
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-20"></span>

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-3 py-1 bg-[#23312D] text-white text-[10px] tracking-widest uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm">
                    Chat with an expert
                </span>

                {/* Main Button */}
                <div className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-7 h-7 fill-white" />
                </div>
            </a>
        </motion.div>
    );
}
