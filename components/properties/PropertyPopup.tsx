import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { fmt, calcEMI, grossYield, calcValues } from './utils';
import { submitInquiry } from '@/lib/inquiryService';
import PhoneInput from '../ui/PhoneInput';
import ROITab from './ROITab';
import CostsTab from './CostsTab';
import { LocationTab, CompareTab, TrustTab } from './OtherTabs';
import { Property } from '@/lib/propertiesData';
import { BarChart3, Wallet, MapPin, Scale, ShieldCheck, X, ChevronLeft, ChevronRight, Star, Calendar, Mail, ArrowRight, ChevronDown, CheckCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import StrategySessionModal from './StrategySessionModal';


const TABS = [
    { id: 'roi', label: 'ROI', sublabel: 'Calculator', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'costs', label: 'Costs', sublabel: 'Full Breakdown', icon: <Wallet className="w-4 h-4" /> },
    { id: 'location', label: 'Location', sublabel: 'Area Intel', icon: <MapPin className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare', sublabel: 'Vs Others', icon: <Scale className="w-4 h-4" /> },
    { id: 'trust', label: 'Trust', sublabel: '& Details', icon: <ShieldCheck className="w-4 h-4" /> },
];

interface PropertyPopupProps {
    p: Property;
    allProperties: Property[];
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
    currency: string;
    onCurrencyChange: (c: string) => void;
    savedIds: string[];
    onToggleSave: (id: string) => void;
}

export default function PropertyPopup({ p, allProperties, onClose, onPrev, onNext, currency, onCurrencyChange, savedIds, onToggleSave }: PropertyPopupProps) {
    const [activeTab, setActiveTab] = useState('roi');
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const [dp, setDp] = useState(20);
    const [rate, setRate] = useState(4.5);
    const [term, setTerm] = useState(25);
    const [app, setApp] = useState(p?.appreciation || 8);
    const [vac, setVac] = useState(5);
    const [calcMode, setCalcMode] = useState<'mortgage' | 'cash'>('mortgage');

    useEffect(() => { setCurrentImgIdx(0); }, [p.id]);

    const [emailOpen, setEmailOpen] = useState(false);
    const [strategyOpen, setStrategyOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [analysisForm, setAnalysisForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: scrollContainerRef });
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
    const headerHeight = useTransform(scrollYProgress, [0, 0.15], ['var(--header-height, 18rem)', '110px']);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.85]);
    const elementsOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

    const f = useCallback((n: number) => fmt(n, currency), [currency]);
    const cv = useMemo(() => calcValues(p, dp, rate, term, app, vac, calcMode), [p, dp, rate, term, app, vac, calcMode]);

    const handleAnalysisSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await submitInquiry({
            firstName: analysisForm.firstName,
            lastName: analysisForm.lastName,
            email: analysisForm.email,
            phone: analysisForm.phone,
            message: `Send Full Investment Analysis (PDF) for ${p.title}`,
            projectOrService: "Investment Analysis Request"
        });
        setIsSubmitting(false);
        if (success) {
            setSubmitted(true);
            setTimeout(() => { onClose(); }, 3000);
        }
    };

    if (!p || !cv) return null;

    const imgs = (p.gallery && p.gallery.length > 0 ? p.gallery : [p.image]).filter(Boolean);
    const mainImg = imgs[currentImgIdx] || imgs[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80';
    const isSaved = savedIds.includes(p.id);
    const activeTabData = TABS.find(t => t.id === activeTab)!;

    return (
        <div
            className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#23312D]/85 backdrop-blur-md animate-in fade-in duration-300"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="relative w-full sm:max-w-xl md:max-w-2xl max-h-[98vh] sm:max-h-[92vh] bg-[#f7f5f2] sm:rounded-[28px] overflow-hidden flex flex-col shadow-[0_48px_120px_rgba(0,0,0,0.55)] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-400"
                style={{ ['--header-height' as any]: 'clamp(12rem, 40vh, 18rem)' } as any}
            >

                {/* ── GALLERY HEADER ─────────────────────────────────── */}
                <motion.div
                    style={{ height: headerHeight, opacity: headerOpacity }}
                    className="relative flex-shrink-0 overflow-hidden"
                >
                    <img src={mainImg} alt={p.title} className="w-full h-full object-cover" />

                    {/* layered gradient — richer depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#23312D] via-[#23312D]/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#23312D]/20 to-transparent" />

                    {/* Top controls */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <div className="flex gap-2">
                            {[{ fn: onPrev, Icon: ChevronLeft }, { fn: onNext, Icon: ChevronRight }].map(({ fn, Icon }, i) => (
                                <button key={i} onClick={fn}
                                    className="w-9 h-9 bg-white/10 backdrop-blur-xl border border-white/15 hover:bg-white/25 text-white rounded-xl flex items-center justify-center transition-all shadow-lg group">
                                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onToggleSave(p.id)}
                                className={`w-9 h-9 backdrop-blur-xl border rounded-xl flex items-center justify-center transition-all shadow-lg ${isSaved ? 'bg-[#AE9573] border-[#AE9573] text-white' : 'bg-white/10 border-white/15 text-white hover:bg-white/25'}`}
                            >
                                <Star className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            <button onClick={onClose}
                                className="w-9 h-9 bg-white/95 text-[#23312D] rounded-xl flex items-center justify-center transition-all hover:bg-white shadow-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Thumbnail strip */}
                    {imgs.length > 1 && (
                        <motion.div style={{ opacity: elementsOpacity }} className="absolute bottom-5 left-5 flex gap-2">
                            {imgs.slice(0, 4).map((img: string, i: number) => (
                                <img key={i} src={img} alt={`View ${i + 1}`} onClick={() => setCurrentImgIdx(i)}
                                    className={`w-14 h-11 object-cover rounded-xl border-2 shadow-2xl hover:scale-105 transition-all cursor-pointer ${i === currentImgIdx ? 'border-[#AE9573] scale-110' : 'border-white/25 opacity-60 hover:opacity-90'}`}
                                />
                            ))}
                            {imgs.length > 4 && (
                                <div className="w-14 h-11 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/25">
                                    +{imgs.length - 4}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Status badges */}
                    <motion.div style={{ opacity: elementsOpacity }} className="absolute bottom-5 right-5 flex flex-col items-end gap-1.5">
                        {p.goldenVisa && (
                            <div className="text-[9px] bg-[#00594F] text-[#B4A68C] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em] border border-[#B4A68C]/20">
                                Golden Visa
                            </div>
                        )}
                        {p.status && (
                            <div className="text-[9px] bg-[#AE9573] text-white font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em]">
                                {p.status}
                            </div>
                        )}
                    </motion.div>
                </motion.div>

                {/* ── SCROLLABLE BODY ─────────────────────────────────── */}
                <div className="flex-1 relative overflow-hidden flex flex-col">

                    {/* Scroll hint */}
                    <motion.div style={{ opacity: scrollIndicatorOpacity }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-40 flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-[#23312D]/40 uppercase tracking-[0.2em] bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-200 shadow-sm">
                            Scroll for more
                        </span>
                        <ChevronDown className="w-4 h-4 text-[#AE9573] animate-bounce" />
                    </motion.div>

                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">

                        {/* ── PROPERTY INFO STRIP ───────────────────────── */}
                        <div className="px-5 sm:px-7 pt-5 pb-5 bg-[#23312D]">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-cinzel font-bold text-white text-lg sm:text-xl leading-tight mb-1.5 break-words">
                                        {p.title}
                                    </h2>
                                    <div className="text-xs font-semibold text-[#AE9573] tracking-[0.08em] uppercase mb-3 italic">
                                        {p.developer ? `${p.developer} · ` : ''}{p.location}
                                    </div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                                        <span>🛏 {p.beds === 0 ? 'Studio' : p.beds} Bed</span>
                                        <span className="text-white/20">·</span>
                                        <span>🚿 {p.baths} Bath</span>
                                        <span className="text-white/20">·</span>
                                        <span>📐 {p.area} sqft</span>
                                        {p.handover && <><span className="text-white/20">·</span><span>🗝 {p.handover}</span></>}
                                        {p.furnishing && <><span className="text-white/20">·</span><span className="text-[#AE9573]">🛋 {p.furnishing}</span></>}
                                    </div>
                                </div>
                                {/* Price card */}
                                <div className="shrink-0 text-right bg-white/5 border border-white/10 px-4 py-3 rounded-2xl w-full sm:w-auto">
                                    <div className="text-[9px] font-bold text-white/40 uppercase tracking-[0.18em] mb-0.5">Monthly From</div>
                                    <div className="text-2xl font-bold font-cinzel text-white leading-none">
                                        {f(Math.round(cv.baseEmi))}
                                        <span className="text-xs font-normal text-white/40">/mo</span>
                                    </div>
                                    <div className="text-[11px] font-bold text-[#AE9573] mt-0.5">{f(cv.price)} total</div>
                                </div>
                            </div>
                        </div>

                        {/* ── PREMIUM TABS ──────────────────────────────── */}
                        {/*
                            Design concept: pill-shaped active track on a dark rail.
                            Each tab shows icon + short label. Active tab gets a copper
                            underline rule + icon tint, inactive tabs are ghosted.
                            The whole rail sits on the navy background so the transition
                            from the info strip is seamless.
                        */}
                        <div className="sticky top-0 z-20 bg-[#23312D] border-b-2 border-[#AE9573]/20">
                            <div className="flex overflow-x-auto no-scrollbar">
                                {TABS.map((tab, i) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                                                relative flex-shrink-0 flex flex-col items-center justify-center gap-1
                                                px-4 sm:px-6 pt-3.5 pb-3 min-w-[72px]
                                                transition-all duration-200
                                                ${isActive ? 'text-white' : 'text-white/30 hover:text-white/60'}
                                            `}
                                        >
                                            {/* icon */}
                                            <span className={`transition-colors duration-200 ${isActive ? 'text-[#AE9573]' : ''}`}>
                                                {tab.icon}
                                            </span>

                                            {/* label */}
                                            <span className={`text-[9px] font-bold uppercase tracking-[0.12em] leading-none transition-all ${isActive ? 'text-white' : ''}`}>
                                                {tab.label}
                                            </span>

                                            {/* active copper underline */}
                                            {isActive && (
                                                <motion.span
                                                    layoutId="tab-underline"
                                                    className="absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-[#AE9573]"
                                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── TAB CONTENT ───────────────────────────────── */}
                        {/* Subtle section label for context */}
                        <div className="flex items-center gap-2.5 px-5 sm:px-7 pt-5 pb-1">
                            <span className="text-[#AE9573]">{activeTabData.icon}</span>
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#23312D]">{activeTabData.label}</span>
                                <span className="text-[10px] text-[#23312D]/30 ml-1.5 uppercase tracking-widest">{activeTabData.sublabel}</span>
                            </div>
                            {/* decorative rule */}
                            <div className="flex-1 h-px bg-gradient-to-r from-[#AE9573]/30 to-transparent ml-1" />
                        </div>

                        <div className="px-5 sm:px-7 pt-3 pb-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    {activeTab === 'roi' && <ROITab calcValues={cv} currency={currency} onCurrencyChange={onCurrencyChange} calcMode={calcMode} setCalcMode={setCalcMode} dp={dp} setDp={setDp} rate={rate} setRate={setRate} term={term} setTerm={setTerm} app={app} setApp={setApp} vac={vac} setVac={setVac} />}
                                    {activeTab === 'costs' && <CostsTab calcValues={cv} currency={currency} />}
                                    {activeTab === 'location' && <LocationTab p={p} price={cv.price} currency={currency} />}
                                    {activeTab === 'compare' && <CompareTab currentProp={p} allProperties={allProperties} currency={currency} />}
                                    {activeTab === 'trust' && <TrustTab p={p} calcValues={cv} currency={currency} />}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ── ACTION FOOTER ─────────────────────────────────── */}
                    <div className="sticky bottom-0 bg-[#f7f5f2] border-t border-[#23312D]/8 px-5 sm:px-7 py-4 sm:py-5 z-30 shadow-[0_-24px_48px_rgba(11,22,34,0.07)]">
                        {/* Primary CTA */}
                        <button
                            onClick={() => setStrategyOpen(true)}
                            className="w-full flex items-center justify-between gap-3 bg-[#23312D] hover:bg-[#23312D] text-white font-bold py-4 px-6 rounded-2xl transition-all text-xs uppercase tracking-[0.14em] shadow-xl shadow-[#23312D]/20 active:scale-[0.98] group mb-3"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#AE9573] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                Book Free Strategy Session
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#AE9573] group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Secondary CTA */}
                        <button
                            onClick={() => setEmailOpen(true)}
                            className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-[#23312D]/50 uppercase tracking-[0.18em] hover:text-[#AE9573] transition-all group py-1"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            Send Full Investment Analysis (PDF)
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* ── EMAIL ANALYSIS MODAL ──────────────────────────── */}
                <AnimatePresence>
                    {emailOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#23312D]/70 backdrop-blur-xl"
                            onClick={e => { if (e.target === e.currentTarget) setEmailOpen(false); }}
                        >
                            <motion.div
                                initial={{ scale: 0.94, opacity: 0, y: 16 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.94, opacity: 0, y: 16 }}
                                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                className="bg-white rounded-[28px] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden"
                            >
                                {/* top accent bar */}
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#23312D] via-[#AE9573] to-[#23312D]" />

                                <button className="absolute top-5 right-5 text-gray-300 hover:text-[#23312D] transition-colors" onClick={() => setEmailOpen(false)}>
                                    <X className="w-5 h-5" />
                                </button>

                                {submitted ? (
                                    <div className="text-center py-6">
                                        <div className="w-16 h-16 bg-[#00594F]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                                            <CheckCircle className="w-8 h-8 text-[#00594F]" />
                                        </div>
                                        <h3 className="font-cinzel text-xl font-bold text-[#23312D] mb-3 uppercase tracking-tight">Report Requested</h3>
                                        <p className="text-[11px] text-gray-400 mb-8 font-medium leading-relaxed">
                                            Your analysis is being generated and will be sent to <strong className="text-[#23312D]">{analysisForm.email}</strong>.
                                        </p>
                                        <button onClick={() => { onClose(); setEmailOpen(false); setSubmitted(false); }}
                                            className="w-full bg-[#23312D] text-white text-[10px] font-bold py-4 rounded-xl uppercase tracking-widest">
                                            Close Window
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center w-12 h-12 bg-[#23312D] rounded-2xl mx-auto mb-5">
                                            <BarChart3 className="w-6 h-6 text-[#AE9573]" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-cinzel text-xl font-bold text-[#23312D] text-center mb-2 uppercase tracking-tight">
                                            Investment Analysis
                                        </h3>
                                        <p className="text-[11px] text-gray-400 text-center mb-7 font-medium leading-relaxed">
                                            ROI projections, cost breakdown & area intelligence for{' '}
                                            <strong className="text-[#23312D]">{p?.title.split('—')[0]}</strong>.
                                        </p>
                                        <form id="property-modal-inquiry-form" onSubmit={handleAnalysisSubmit} className="space-y-3.5">
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { label: 'First Name', key: 'firstName', placeholder: 'John' },
                                                    { label: 'Last Name', key: 'lastName', placeholder: 'Doe' },
                                                ].map(({ label, key, placeholder }) => (
                                                    <div key={key} className="space-y-1">
                                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-0.5">{label}</label>
                                                        <input
                                                            required type="text" placeholder={placeholder}
                                                            value={(analysisForm as any)[key]}
                                                            onChange={e => setAnalysisForm({ ...analysisForm, [key]: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#AE9573] transition-colors"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-0.5">Email Address</label>
                                                <input required type="email" placeholder="john@example.com"
                                                    value={analysisForm.email}
                                                    onChange={e => setAnalysisForm({ ...analysisForm, email: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#AE9573] transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] ml-0.5">Phone Number</label>
                                                <PhoneInput value={analysisForm.phone} onChange={val => setAnalysisForm({ ...analysisForm, phone: val })}
                                                    className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl focus-within:border-[#AE9573] transition-colors text-xs" />
                                            </div>
                                            <button disabled={isSubmitting} type="submit"
                                                className="w-full bg-[#23312D] hover:bg-[#23312D] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-[0.18em] transition-all shadow-lg shadow-[#23312D]/15 mt-1 flex items-center justify-center gap-3">
                                                {isSubmitting
                                                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</>
                                                    : 'Send My Report'}
                                            </button>
                                            <p className="text-[9px] text-gray-300 text-center leading-relaxed uppercase tracking-wide">
                                                Private &amp; Confidential Analysis
                                            </p>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <StrategySessionModal
                    isOpen={strategyOpen}
                    onClose={() => setStrategyOpen(false)}
                    propertyName={p?.title.split('—')[0]}
                />
            </div>
        </div>
    );
}