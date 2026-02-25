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
    { id: 'roi', label: 'ROI Calculator', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'costs', label: 'Full Costs', icon: <Wallet className="w-3.5 h-3.5" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'compare', label: 'Compare', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'trust', label: 'Trust & Details', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
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

    // Reset image index when the property changes
    useEffect(() => {
        setCurrentImgIdx(0);
    }, [p.id]);
    const [emailOpen, setEmailOpen] = useState(false);
    const [strategyOpen, setStrategyOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [analysisForm, setAnalysisForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ container: scrollContainerRef });
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

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
            // Automatically close the entire property popup after a short delay on success
            setTimeout(() => {
                onClose();
            }, 3000);
        }
    };

    if (!p || !cv) return null;

    const imgs = (p.gallery && p.gallery.length > 0 ? p.gallery : [p.image]).filter(Boolean);
    const mainImg = imgs[currentImgIdx] || imgs[0] || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80';
    const isSaved = savedIds.includes(p.id);

    return (
        <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy/80 backdrop-blur-md animate-in fade-in duration-300" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="relative w-full sm:max-w-xl md:max-w-2xl max-h-[98vh] sm:max-h-[92vh] bg-white sm:rounded-[32px] overflow-hidden flex flex-col shadow-[0_40px_100px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-400">

                {/* Gallery Header */}
                <div className="relative h-56 sm:h-72 flex-shrink-0">
                    <img src={mainImg} alt={p.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />

                    {/* Top controls */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                        <div className="flex gap-2">
                            <button onClick={onPrev} className="w-9 h-9 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white text-white hover:text-navy rounded-xl flex items-center justify-center transition-all shadow-lg group">
                                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                            <button onClick={onNext} className="w-9 h-9 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white text-white hover:text-navy rounded-xl flex items-center justify-center transition-all shadow-lg group">
                                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => onToggleSave(p.id)} className={`w-9 h-9 backdrop-blur-xl border rounded-xl flex items-center justify-center transition-all shadow-lg ${isSaved ? 'bg-copper border-copper text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white hover:text-navy'}`}>
                                <Star className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            <button onClick={onClose} className="w-9 h-9 bg-white text-navy rounded-xl border-none font-bold flex items-center justify-center transition-all hover:bg-white/90 shadow-lg cursor-pointer">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Thumbnail strip */}
                    {imgs.length > 1 && (
                        <div className="absolute bottom-5 left-5 flex gap-2">
                            {imgs.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`Property view ${i + 1}`}
                                    onClick={() => setCurrentImgIdx(i)}
                                    className={`w-14 h-11 object-cover rounded-xl border-2 shadow-2xl hover:scale-105 transition-all cursor-pointer ${i === currentImgIdx ? 'border-copper scale-110 shadow-copper/20' : 'border-white/30 opacity-70 hover:opacity-100'}`}
                                />
                            )).slice(0, 4)}
                            {imgs.length > 4 && <div className="w-14 h-11 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white text-[10px] font-bold border border-white/30">+{imgs.length - 4}</div>}
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute bottom-5 right-5 text-right flex flex-col items-end gap-1.5">
                        {p.goldenVisa && <div className="text-[10px] bg-deep-teal text-white font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/10">Golden Visa</div>}
                        {p.status && <div className="text-[10px] bg-copper text-white font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/10">{p.status}</div>}
                    </div>
                </div>

                {/* Scrollable content container */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {/* Scroll Indicator */}
                    <motion.div
                        style={{ opacity: scrollIndicatorOpacity }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-[40] flex flex-col items-center gap-1"
                    >
                        <span className="text-[9px] font-bold text-navy/40 uppercase tracking-[0.2em] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100 shadow-sm">Scroll for more</span>
                        <ChevronDown className="w-4 h-4 text-copper animate-bounce" />
                    </motion.div>

                    {/* Scrollable Area */}
                    <div
                        ref={scrollContainerRef}
                        className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
                    >
                        {/* Property info */}
                        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
                            <div className="flex flex-col gap-4">
                                <div className="flex-1">
                                    <h2 className="font-cinzel font-bold text-navy text-lg sm:text-xl md:text-2xl leading-[1.15] mb-2">{p.title}</h2>
                                    <div className="text-xs font-bold text-copper tracking-[0.1em] uppercase mb-3 italic">{p.developer ? `${p.developer} · ` : ''}{p.location}</div>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">🛏 {p.beds === 0 ? 'Studio' : p.beds} Bed</span>
                                        <span className="w-1 h-1 bg-gray-200 rounded-full my-auto" />
                                        <span className="flex items-center gap-1.5">🚿 {p.baths} Bath</span>
                                        <span className="w-1 h-1 bg-gray-200 rounded-full my-auto" />
                                        <span className="flex items-center gap-1.5">📐 {p.area} sqft</span>
                                        {p.handover && <><span className="w-1 h-1 bg-gray-200 rounded-full my-auto" /><span>🗝 {p.handover}</span></>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly From</div>
                                    <div className="text-right">
                                        <div className="text-xl sm:text-2xl font-bold font-cinzel text-navy leading-none mb-0.5">{f(Math.round(cv.baseEmi))}<span className="text-xs font-normal text-gray-400">/mo</span></div>
                                        <div className="text-[11px] font-bold text-copper">{f(cv.price)} total</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-3 sm:px-6 py-3 sm:py-4 flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar border-b border-gray-50">
                            {TABS.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-navy text-white shadow-xl shadow-navy/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-navy'}`}>
                                    <span>{tab.icon}</span>
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="px-6 pt-6 pb-10">
                            {activeTab === 'roi' && <ROITab calcValues={cv} currency={currency} onCurrencyChange={onCurrencyChange} calcMode={calcMode} setCalcMode={setCalcMode} dp={dp} setDp={setDp} rate={rate} setRate={setRate} term={term} setTerm={setTerm} app={app} setApp={setApp} vac={vac} setVac={setVac} />}
                            {activeTab === 'costs' && <CostsTab calcValues={cv} currency={currency} />}
                            {activeTab === 'location' && <LocationTab p={p} price={cv.price} currency={currency} />}
                            {activeTab === 'compare' && <CompareTab currentProp={p} allProperties={allProperties} currency={currency} />}
                            {activeTab === 'trust' && <TrustTab p={p} calcValues={cv} currency={currency} />}
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 sm:px-6 py-4 sm:py-6 w-full z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <button onClick={() => setStrategyOpen(true)} className="flex-1 flex items-center justify-center gap-2.5 bg-navy hover:bg-[#1a2622] text-white font-bold py-3.5 sm:py-5 rounded-2xl transition-all text-xs uppercase tracking-widest shadow-lg shadow-navy/20 active:scale-[0.98]">
                                <Calendar className="w-4 h-4" /> Book Free Strategy Session
                            </button>
                        </div>
                        <button onClick={() => setEmailOpen(true)} className="w-full text-[10px] font-bold text-copper uppercase tracking-widest hover:text-navy transition-all flex items-center justify-center gap-2 group">
                            <Mail className="w-3.5 h-3.5" /> Send Full Investment Analysis (PDF) <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Email Analysis Modal */}
                {emailOpen && (
                    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={e => { if (e.target === e.currentTarget) setEmailOpen(false); }}>
                        <div className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-400">
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-navy via-copper to-navy" />
                            <div className="absolute top-6 right-6 p-2 text-gray-400 hover:text-navy transition-colors cursor-pointer" onClick={() => setEmailOpen(false)}>
                                <X className="w-5 h-5" />
                            </div>

                            {submitted ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-deep-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-8 h-8 text-deep-teal" />
                                    </div>
                                    <h3 className="font-cinzel text-xl font-bold text-navy mb-4 uppercase tracking-tight">Report Requested</h3>
                                    <p className="text-[11px] text-gray-500 mb-8 font-medium leading-relaxed">
                                        Thank you. Your investment analysis report is being generated and will be sent to <strong>{analysisForm.email}</strong> shortly.
                                    </p>
                                    <button onClick={() => { onClose(); setEmailOpen(false); setSubmitted(false); }} className="w-full bg-navy text-white text-[10px] font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg shadow-navy/20">
                                        Close Window
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-4xl mb-6 text-center text-navy"><BarChart3 className="w-12 h-12 mx-auto" strokeWidth={1.5} /></div>
                                    <h3 className="font-cinzel text-xl font-bold text-navy text-center mb-2 uppercase tracking-tight">Investment Analysis</h3>
                                    <p className="text-[11px] text-gray-500 text-center mb-8 font-medium leading-relaxed">
                                        A detailed breakdown including ROI projections, cost analysis, and area intelligence for <strong>{p?.title.split('—')[0]}</strong>.
                                    </p>
                                    <form id="property-modal-inquiry-form" onSubmit={handleAnalysisSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                                <input required type="text" placeholder="John" value={analysisForm.firstName} onChange={e => setAnalysisForm({ ...analysisForm, firstName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-copper transition-all" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                                <input required type="text" placeholder="Doe" value={analysisForm.lastName} onChange={e => setAnalysisForm({ ...analysisForm, lastName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-copper transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <input required type="email" placeholder="john@example.com" value={analysisForm.email} onChange={e => setAnalysisForm({ ...analysisForm, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-copper transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                            <PhoneInput value={analysisForm.phone} onChange={val => setAnalysisForm({ ...analysisForm, phone: val })} className="w-full h-11 bg-gray-50 border border-gray-100 rounded-xl focus-within:border-copper transition-colors text-xs" />
                                        </div>
                                        <button disabled={isSubmitting} type="submit" className="w-full bg-navy hover:bg-black text-white font-bold py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-navy/20 mt-2 flex items-center justify-center gap-3">
                                            {isSubmitting ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</> : 'Send My Report'}
                                        </button>
                                        <p className="text-[9px] text-gray-400 text-center leading-relaxed mt-2 uppercase tracking-wide">
                                            Private & Confidential Analysis
                                        </p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <StrategySessionModal
                    isOpen={strategyOpen}
                    onClose={() => setStrategyOpen(false)}
                    propertyName={p?.title.split('—')[0]}
                />
            </div>
        </div>
    );
}
