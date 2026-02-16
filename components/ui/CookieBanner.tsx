"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, ShieldCheck } from "lucide-react";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const storedConsent = localStorage.getItem("clifton-cookie-consent");
        if (storedConsent) {
            try {
                const consentData = JSON.parse(storedConsent);

                // Update GTM state on load if consent exists
                if (typeof window !== "undefined" && (window as any).gtag) {
                    (window as any).gtag("consent", "update", {
                        ad_storage: consentData.ad_storage,
                        ad_user_data: consentData.ad_user_data,
                        ad_personalization: consentData.ad_personalization,
                        analytics_storage: consentData.analytics_storage,
                    });
                }

                // Also initialize preferences state to match stored consent
                setPreferences({
                    necessary: true,
                    analytics: consentData.analytics_storage === "granted",
                    marketing: consentData.ad_storage === "granted",
                });
            } catch (e) {
                console.error("Error parsing stored cookie consent:", e);
                setIsVisible(true);
            }
        } else {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleConsent = (type: "all" | "none" | "custom") => {
        let consentData;

        if (type === "all") {
            consentData = {
                ad_storage: "granted",
                ad_user_data: "granted",
                ad_personalization: "granted",
                analytics_storage: "granted",
                timestamp: new Date().toISOString(),
            };
        } else if (type === "none") {
            consentData = {
                ad_storage: "denied",
                ad_user_data: "denied",
                ad_personalization: "denied",
                analytics_storage: "denied",
                timestamp: new Date().toISOString(),
            };
        } else {
            // Custom preferences
            consentData = {
                ad_storage: preferences.marketing ? "granted" : "denied",
                ad_user_data: preferences.marketing ? "granted" : "denied",
                ad_personalization: preferences.marketing ? "granted" : "denied",
                analytics_storage: preferences.analytics ? "granted" : "denied",
                timestamp: new Date().toISOString(),
            };
        }

        // Update GTM
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("consent", "update", {
                ad_storage: consentData.ad_storage,
                ad_user_data: consentData.ad_user_data,
                ad_personalization: consentData.ad_personalization,
                analytics_storage: consentData.analytics_storage,
            });
        }

        localStorage.setItem("clifton-cookie-consent", JSON.stringify(consentData));
        setIsVisible(false);
        setShowSettings(false);
    };

    const togglePreference = (key: keyof typeof preferences) => {
        if (key !== "necessary") {
            setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Compact Cookie Button - Left Side */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        className="fixed left-4 bottom-4 z-[99999]"
                    >
                        <motion.button
                            onClick={() => setShowSettings(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative bg-[#23312D] border border-[#AE9573] rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative">
                                    <Cookie className="w-6 h-6 text-[#AE9573]" />
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#AE9573] rounded-full border-2 border-[#23312D]"
                                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.8, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-bold text-sm tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                        Cookie Settings
                                    </div>
                                    <div className="text-[#AE9573]/60 text-[10px] uppercase tracking-widest font-medium mt-0.5">
                                        Customize
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    </motion.div>

                    {/* Settings Modal */}
                    <AnimatePresence>
                        {showSettings && (
                            <>
                                {/* Dark Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowSettings(false)}
                                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100000]"
                                />

                                {/* Modal Container */}
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                    className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100001] w-[90%] max-w-md"
                                >
                                    <div className="bg-[#23312D] border border-[#AE9573]/30 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden">
                                        {/* Header */}
                                        <div className="relative px-8 pt-6 pb-8 bg-[#23312D]">
                                            <button
                                                onClick={() => setShowSettings(false)}
                                                className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>

                                            <div className="flex flex-col items-center text-center">
                                                <div className="mb-4">
                                                    <div className="w-14 h-14 bg-[#AE9573] rounded-xl flex items-center justify-center shadow-lg">
                                                        <ShieldCheck className="w-7 h-7 text-[#23312D]" />
                                                    </div>
                                                </div>
                                                <h3 className="text-white font-bold text-2xl mb-2 uppercase tracking-widest" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                                    Cookie Preferences
                                                </h3>
                                                <p className="text-white/70 text-[14px] max-w-[280px] mx-auto leading-relaxed">
                                                    We respect your privacy. Manage how we use cookies to personalize your experience.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cookie Options */}
                                        <div className="px-8 py-2 space-y-4 max-h-[50vh] overflow-y-auto">
                                            {[
                                                {
                                                    id: "necessary",
                                                    title: "Necessary Cookies",
                                                    desc: "Essential for website functionality and security. Cannot be disabled.",
                                                    required: true
                                                },
                                                {
                                                    id: "analytics",
                                                    title: "Analytics Tracking",
                                                    desc: "Help us understand how visitors interact with our website to improve performance."
                                                },
                                                {
                                                    id: "marketing",
                                                    title: "Marketing & Personalization",
                                                    desc: "Used to deliver personalized ads and content based on your interests."
                                                }
                                            ].map((option) => (
                                                <div key={option.id} className="bg-[#1a2420] rounded-xl p-5 border border-white/5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                <h4 className="text-white font-bold text-[13px] uppercase tracking-[0.1em]" style={{ fontFamily: "var(--font-cinzel), serif" }}>
                                                                    {option.title}
                                                                </h4>
                                                                {option.required && (
                                                                    <span className="text-[9px] bg-[#AE9573] text-[#23312D] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest leading-none">
                                                                        Required
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-white/70 text-[11px] leading-relaxed">
                                                                {option.desc}
                                                            </p>
                                                        </div>

                                                        <div className="shrink-0 pt-0.5">
                                                            {option.required ? (
                                                                <div className="w-11 h-6 bg-[#AE9573]/30 rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                                                                    <div className="w-4 h-4 bg-white rounded-full" />
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => togglePreference(option.id as any)}
                                                                    className={`w-11 h-6 rounded-full flex items-center transition-all duration-300 ${preferences[option.id as keyof typeof preferences]
                                                                        ? "bg-[#AE9573] justify-end"
                                                                        : "bg-[#2c3b36] justify-start"
                                                                        }`}
                                                                >
                                                                    <motion.div
                                                                        layout
                                                                        className="w-4 h-4 bg-white rounded-full mx-1 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                                                    />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer Actions */}
                                        <div className="px-8 py-6 space-y-3 bg-[#23312D]">
                                            <button
                                                onClick={() => handleConsent("all")}
                                                className="w-full py-4 bg-[#AE9573] hover:bg-[#C5AD8F] text-[#23312D] font-black rounded-xl transition-all duration-300 text-sm uppercase tracking-[0.15em] shadow-lg"
                                            >
                                                Accept All Experience
                                            </button>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleConsent("custom")}
                                                    className="flex-1 py-4 bg-transparent hover:bg-white/5 text-white font-bold rounded-xl border-2 border-white/10 hover:border-white/20 transition-all duration-300 text-[11px] uppercase tracking-[0.15em]"
                                                >
                                                    Save Custom
                                                </button>
                                                <button
                                                    onClick={() => handleConsent("none")}
                                                    className="flex-1 py-4 bg-transparent hover:bg-red-500/10 text-white/70 hover:text-red-400 font-bold rounded-xl border-2 border-white/10 hover:border-red-400/20 transition-all duration-300 text-[11px] uppercase tracking-[0.15em]"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>
    );
}