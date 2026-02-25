"use client";
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Property } from '@/lib/propertiesData';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { fmt, calcEMI, grossYield } from '@/components/properties/utils';
import { Landmark, Gem, ShieldCheck, Plane, LayoutGrid, Star, TrendingUp, Wallet, ChevronRight } from 'lucide-react';

const filterTypes = ['All', 'Apartment', 'Villa', 'Penthouse', 'Off-Plan'];

export default function InvestmentPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [compareList, setCompareList] = useState<number[]>([]);
    const [currentCurrency, setCurrentCurrency] = useState('AED');
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');

    // Fetch from Google Sheets
    useEffect(() => {
        async function load() {
            try {
                const { fetchPropertiesFromSheet } = await import('@/lib/googleSheets');
                const all = await fetchPropertiesFromSheet();
                // Filter to only investment properties (those with priceNumeric set)
                const inv = all.filter(p => p.priceNumeric && p.priceNumeric > 0);
                setProperties(inv.length > 0 ? inv : all);
            } catch {
                const { properties: fallback } = await import('@/lib/propertiesData');
                setProperties(fallback);
            }
            setLoading(false);
        }
        load();
    }, []);

    const filteredProperties = useMemo(() => {
        if (activeFilter === 'All') return properties;
        return properties.filter(p => p.type?.toLowerCase() === activeFilter.toLowerCase() || (activeFilter === 'Off-Plan' && p.status?.toLowerCase() === 'off-plan'));
    }, [properties, activeFilter]);

    const toggleCompare = useCallback((idx: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCompareList(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : prev.length < 3 ? [...prev, idx] : prev);
    }, []);

    const toggleSave = useCallback((id: string) => {
        setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, []);

    if (loading) {
        return (
            <div className="font-sans bg-[#F2F0EB] text-navy overflow-x-hidden min-h-screen">
                <div className="bg-gradient-to-br from-[#1a2622] via-navy to-deep-teal py-32 px-5 text-center relative overflow-hidden">
                    <h1 className="font-cinzel text-white text-3xl md:text-4xl font-bold tracking-tight">Dubai Investment Properties</h1>
                    <p className="text-copper text-sm mt-2">Loading curated opportunities...</p>
                </div>
                <div className="text-center py-20 px-5 flex flex-col items-center justify-center">
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-8"
                    >
                        <img src="/logo.png" alt="Clifton Capital" className="h-24 w-auto object-contain brightness-0 grayscale" />
                    </motion.div>
                    <p className="text-[10px] font-bold text-copper uppercase tracking-[0.3em] animate-pulse">
                        Curating your investment portfolio...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans bg-[#F2F0EB] text-navy overflow-x-hidden min-h-screen">
            {/* PAGE HEADER */}
            <section className="relative pt-48 pb-20 px-6 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a2622] via-navy to-deep-teal z-0" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-copper/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 z-1" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-deep-teal/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 z-1" />

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-copper text-[10px] tracking-[0.3em] uppercase mb-6 backdrop-blur-sm">
                            Curated Investment Portfolio
                        </span>

                        <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-6 leading-tight">
                            DUBAI <span className="text-copper italic font-light">INVESTMENT</span> PROPERTIES
                        </h1>

                        <p className="max-w-2xl mx-auto text-white/50 text-sm md:text-base mb-12 font-medium leading-relaxed">
                            {properties.length} off-market opportunities and primary developments with guaranteed ROI projections — curated specifically for professional investors.
                        </p>

                        <div className="flex flex-wrap justify-center gap-8 mb-16">
                            {[
                                { icon: Landmark, bold: 'RERA', text: 'Licensed' },
                                { icon: Gem, bold: 'Direct', text: 'Pricing' },
                                { icon: ShieldCheck, bold: 'Escrow', text: 'Secure' },
                                { icon: Plane, bold: 'Golden Visa', text: 'Eligible' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 text-white/40 text-[11px] font-bold tracking-widest uppercase group">
                                    <item.icon className="w-4 h-4 text-copper group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                                    <span><strong className="text-white/80">{item.bold}</strong> {item.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Filter Navigation */}
                    <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                        {filterTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setActiveFilter(type)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${activeFilter === type
                                    ? 'bg-copper text-white shadow-lg'
                                    : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* LISTINGS GRID */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredProperties.map((p, idx) => {
                            const price = p.priceNumeric || 0;
                            const rent = p.annualRent || 0;
                            const emi = price > 0 ? calcEMI(price, 20, 4.5, 25) : 0;
                            const gy = price > 0 && rent > 0 ? grossYield(rent, price) : '0';
                            const imgs = p.gallery && p.gallery.length > 0 ? p.gallery : [p.image];

                            return (
                                <Link href={`/properties/${p.id}`} key={p.id}>
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{
                                            duration: 0.4,
                                            delay: idx % 6 * 0.03,
                                            layout: { duration: 0.4, ease: "circOut" }
                                        }}
                                        className="group bg-white rounded-[32px] h-full overflow-hidden border border-gray-100 hover:border-copper/30 transition-shadow duration-500 hover:shadow-[0_40px_80px_-20px_rgba(35,49,45,0.12)] flex flex-col cursor-pointer"
                                    >
                                        {/* Image Container */}
                                        <div className="relative h-72 overflow-hidden">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className="w-full h-full bg-cover bg-center"
                                                style={{ backgroundImage: `url('${imgs[0]}')` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60" />

                                            {/* Status Badges */}
                                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                                {p.status && (
                                                    <span className="px-3 py-1.5 bg-navy/80 backdrop-blur-md rounded-full text-[10px] font-bold text-copper uppercase tracking-widest border border-white/10">
                                                        {p.status}
                                                    </span>
                                                )}
                                                {p.goldenVisa && (
                                                    <span className="px-3 py-1.5 bg-deep-teal/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                                                        Golden Visa
                                                    </span>
                                                )}
                                            </div>

                                            {/* Comparison/Save Toggle */}
                                            <div className="absolute top-6 right-6 flex gap-2">
                                                <button
                                                    onClick={(e) => toggleCompare(idx, e)}
                                                    className={`w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-all duration-300 border ${compareList.includes(idx)
                                                        ? 'bg-copper border-copper text-white'
                                                        : 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-navy'
                                                        }`}
                                                >
                                                    <LayoutGrid className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Yield Badge */}
                                            {parseFloat(gy) > 0 && (
                                                <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white">
                                                    <TrendingUp className="w-3.5 h-3.5 text-copper" />
                                                    <span className="text-[11px] font-bold uppercase tracking-wider">{gy}% Net Yield</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Container */}
                                        <div className="p-8 flex flex-1 flex-col">
                                            <div className="mb-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-navy leading-tight line-clamp-1 group-hover:text-copper transition-colors">
                                                        {p.title}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                                                    <Landmark className="w-3.5 h-3.5" strokeWidth={1.5} />
                                                    <span>{p.location}</span>
                                                    {p.developer && (
                                                        <>
                                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                                            <span>{p.developer}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-100">
                                                <div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Investment Entry</div>
                                                    <div className="font-cinzel text-2xl font-bold text-navy flex items-baseline gap-1.5">
                                                        {emi > 0 ? (
                                                            <>
                                                                {fmt(Math.round(emi), currentCurrency)}
                                                                <span className="font-sans text-[11px] font-medium text-gray-400">/mo</span>
                                                            </>
                                                        ) : (
                                                            p.price
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Total Value</div>
                                                    <div className="text-sm font-bold text-copper tracking-tight">
                                                        {price > 0 ? fmt(price, currentCurrency) : p.price}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Metrics Grid */}
                                            <div className="grid grid-cols-4 gap-2 mb-8">
                                                {[
                                                    { val: p.beds === 0 ? 'ST' : p.beds + 'BR', label: 'Beds', icon: <Star className="w-3 h-3" /> },
                                                    { val: p.area || '-', label: 'Sq.Ft', icon: <LayoutGrid className="w-3 h-3" /> },
                                                    { val: rent > 0 ? fmt(Math.round(rent / 1000), currentCurrency) + 'k' : '-', label: 'Rent/Yr', icon: <Wallet className="w-3 h-3" /> },
                                                    { val: gy + '%', label: 'Yield', icon: <TrendingUp className="w-3 h-3" /> }
                                                ].map((m, mi) => (
                                                    <div key={mi} className="text-center group/metric">
                                                        <div className="text-navy font-bold text-[13px] mb-1 group-hover/metric:text-copper transition-colors">{m.val}</div>
                                                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button className="w-full py-4 bg-gray-50 group-hover:bg-navy group-hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mt-auto">
                                                View Full Analysis <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* COMPARE BAR */}
            <div className={`fixed left-1/2 -translate-x-1/2 bg-navy text-white py-3.5 px-7 rounded-2xl flex items-center gap-4 z-[100] shadow-[0_30px_80px_rgba(35,49,45,0.18)] transition-all duration-400 ${compareList.length > 0 ? 'bottom-6' : '-bottom-20'}`}>
                <span className="text-[13px] font-medium">{compareList.length} selected</span>
                <button className="bg-copper text-white border-none px-5 py-2.5 rounded-lg font-semibold text-[13px] cursor-pointer hover:bg-[#816040] transition-all" onClick={() => { if (compareList.length >= 2) alert('Compare feature coming soon!'); else alert('Select at least 2 properties'); }}>Compare Now</button>
            </div>

        </div>
    );
}
