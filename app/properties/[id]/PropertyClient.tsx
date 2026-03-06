"use client";

import React, { useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Property } from '@/lib/propertiesData';
import { fetchPropertiesFromSheet } from '@/lib/googleSheets';
import { submitInquiry } from '@/lib/inquiryService';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    MapPin,
    Bed,
    Bath,
    Square,
    Heart,
    Share2,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Building,
    User,
    Send,
    RefreshCw,
    BarChart3,
    Wallet,
    Scale,
    ShieldCheck,
    Calendar,
    ArrowRight,
    ChevronDown,
    X,
} from 'lucide-react';
import PhoneInput from '../../../components/ui/PhoneInput';
import { fmt, calcValues } from '../../../components/properties/utils';
import ROITab from '../../../components/properties/ROITab';
import CostsTab from '../../../components/properties/CostsTab';
import { LocationTab, CompareTab, TrustTab } from '../../../components/properties/OtherTabs';
import StrategySessionModal from '../../../components/properties/StrategySessionModal';

const TABS = [
    { id: 'roi', label: 'ROI Calculator', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'costs', label: 'Full Costs', icon: <Wallet className="w-3.5 h-3.5" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'compare', label: 'Compare', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'trust', label: 'Trust & Details', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
];

function PropertyDetailPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params?.id as string;
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [allProperties, setAllProperties] = useState<Property[]>([]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "I'm interested in this property. Please contact me with more details."
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Financial calculations state
    const [activeTab, setActiveTab] = useState('roi');
    const [currency, setCurrency] = useState('AED');
    const [dp, setDp] = useState(20);
    const [rate, setRate] = useState(4.5);
    const [term, setTerm] = useState(25);
    const [app, setApp] = useState(8);
    const [vac, setVac] = useState(5);
    const [calcMode, setCalcMode] = useState<'mortgage' | 'cash'>('mortgage');

    // Analysis PDF Flow state
    const [emailOpen, setEmailOpen] = useState(false);
    const [strategyOpen, setStrategyOpen] = useState(false);
    const [analysisSubmitted, setAnalysisSubmitted] = useState(false);
    const [analysisIsSubmitting, setAnalysisIsSubmitting] = useState(false);
    const [analysisForm, setAnalysisForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });

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

    useEffect(() => {
        const loadProperty = async () => {
            setLoading(true);
            const data = await fetchPropertiesFromSheet();
            setAllProperties(data);
            const found = data.find(p => p.id === id);
            if (found) {
                setProperty(found);
                setCurrentImageIndex(0);
                if (found.appreciation) setApp(found.appreciation);
            }
            setLoading(false);
        };
        loadProperty();
    }, [id]);

    const cv = useMemo(() => property ? calcValues(property, dp, rate, term, app, vac, calcMode) : null, [property, dp, rate, term, app, vac, calcMode]);

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
            projectOrService: `Property Enquiry: ${property?.title || id}`,
            ...utmParams
        });

        setIsSubmitting(false);
        if (success) {
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 3000);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                message: "I'm interested in this property. Please contact me with more details."
            });
        }
    };

    const handleAnalysisSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAnalysisIsSubmitting(true);

        const success = await submitInquiry({
            firstName: analysisForm.firstName,
            lastName: analysisForm.lastName,
            email: analysisForm.email,
            phone: analysisForm.phone,
            message: `Send Full Investment Analysis (PDF) for ${property?.title}`,
            projectOrService: "Investment Analysis Request"
        });

        setAnalysisIsSubmitting(false);
        if (success) {
            setAnalysisSubmitted(true);
            setTimeout(() => {
                setEmailOpen(false);
                setAnalysisSubmitted(false);
            }, 3000);
        }
    };

    const formatPrice = (price: string) => {
        return price; // Keep original price string from sheet
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % (property?.gallery.length || 1));
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + (property?.gallery.length || 1)) % (property?.gallery.length || 1));

    if (loading) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <RefreshCw className="animate-spin w-12 h-12 text-[#AE9573] mb-4" />
                    <p className="text-gray-500">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#23312D] mb-4">Property Not Found</h2>
                    <Link href="/properties" className="text-[#AE9573] hover:underline">Return to all properties</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24">
            {/* Breadcrumb */}
            <div className="bg-[#23312D] py-6">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-white/70 hover:text-white">Home</Link>
                        <span className="text-white/50">/</span>
                        <Link href="/properties" className="text-white/70 hover:text-white">Properties</Link>
                        <span className="text-white/50">/</span>
                        <span className="text-white font-medium">{property.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Left Column - Images & Details */}
                        <div className="lg:col-span-2">
                            {/* Image Gallery */}
                            <div className="relative rounded-2xl overflow-hidden mb-8">
                                <motion.img
                                    key={currentImageIndex}
                                    src={property.gallery[currentImageIndex]}
                                    alt={property.title}
                                    className="w-full h-[500px] object-cover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                />

                                {/* Navigation */}
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Image Counter */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                                    {currentImageIndex + 1} / {property.gallery.length}
                                </div>

                                {/* Actions */}
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                                        <Heart className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                                        <Share2 className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                                        For Sale
                                    </span>
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
                                {property.gallery.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? "border-[#B4A68C]" : "border-transparent opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={image} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>

                            {/* Property Info */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                                    <MapPin className="w-4 h-4" />
                                    {property.location}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-[#23312D] mb-4 leading-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                    {property.title}
                                </h1>
                                <p className="text-4xl font-bold text-[#AE9573]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                    {formatPrice(property.price)}
                                </p>
                            </div>

                            {/* Key Features */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#F2F0EB] rounded-xl mb-8">
                                <div className="text-center">
                                    <Bed className="w-6 h-6 text-[#AE9573] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-[#23312D]">{property.beds}</div>
                                    <div className="text-sm text-gray-500">Bedrooms</div>
                                </div>
                                <div className="text-center">
                                    <Bath className="w-6 h-6 text-[#AE9573] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-[#23312D]">{property.baths}</div>
                                    <div className="text-sm text-gray-500">Bathrooms</div>
                                </div>
                                <div className="text-center">
                                    <Square className="w-6 h-6 text-[#AE9573] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-[#23312D]">{property.area.toLocaleString()}</div>
                                    <div className="text-sm text-gray-500">Sq.Ft.</div>
                                </div>
                                <div className="text-center">
                                    <Building className="w-6 h-6 text-[#AE9573] mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-[#23312D] capitalize">{property.type}</div>
                                    <div className="text-sm text-gray-500">Type</div>
                                </div>
                            </div>

                            {/* Financial Tabs */}
                            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-8 shadow-sm">
                                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-50">
                                    {TABS.map(tab => (
                                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#00594F] text-white shadow-xl shadow-[#00594F]/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-navy'}`}>
                                            <span>{tab.icon}</span>
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="p-8">
                                    {cv && (
                                        <>
                                            {activeTab === 'roi' && <ROITab calcValues={cv} currency={currency} onCurrencyChange={setCurrency} calcMode={calcMode} setCalcMode={setCalcMode} dp={dp} setDp={setDp} rate={rate} setRate={setRate} term={term} setTerm={setTerm} app={app} setApp={setApp} vac={vac} setVac={setVac} />}
                                            {activeTab === 'costs' && <CostsTab calcValues={cv} currency={currency} />}
                                            {activeTab === 'location' && <LocationTab p={property} price={cv.price} currency={currency} />}
                                            {activeTab === 'compare' && <CompareTab currentProp={property} allProperties={allProperties} currency={currency} />}
                                            {activeTab === 'trust' && <TrustTab p={property} calcValues={cv} currency={currency} />}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Description & Amenities (Integrated/Secondary) */}
                            <div className="grid md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h2 className="text-xl font-medium text-[#23312D] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Description</h2>
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {property.description}
                                    </p>
                                </div>
                                {property.amenities.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-medium text-[#23312D] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Amenities</h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            {property.amenities.slice(0, 8).map((amenity, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-[#AE9573]" />
                                                    <span className="text-gray-700 text-xs">{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32">
                                <div className="bg-[#F2F0EB] p-10 shadow-xl">
                                    {submitted ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                                                <CheckCircle className="w-8 h-8 text-[#00594F]" />
                                            </div>
                                            <h3 className="text-2xl font-medium text-[#23312D] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Thank You!</h3>
                                            <p className="text-gray-600 mb-8">
                                                We&apos;ve received your inquiry and will contact you shortly.
                                            </p>
                                            <button
                                                onClick={() => setSubmitted(false)}
                                                className="bg-[#00594F] hover:bg-[#004a3f] text-white px-8 py-4 rounded-none transition-colors uppercase tracking-widest text-sm"
                                            >
                                                Send Another Inquiry
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="text-2xl text-[#23312D] mb-8" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                                Enquire About This Property
                                            </h3>
                                            <form id="property-detail-inquiry-form" onSubmit={handleSubmit} className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="First Name"
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            className="w-full h-14 pl-12 pr-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50"
                                                        />
                                                    </div>
                                                    <div className="relative">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="Last Name"
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            className="w-full h-14 pl-12 pr-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        required
                                                        type="email"
                                                        placeholder="Email Address"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full h-14 pl-12 pr-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50"
                                                    />
                                                </div>
                                                <PhoneInput
                                                    value={formData.phone}
                                                    onChange={(phone) => setFormData({ ...formData, phone })}
                                                    className="w-full h-14 bg-white border border-[#e8e6e3] focus-within:border-[#00594F] transition-all"
                                                />
                                                <textarea
                                                    required
                                                    placeholder="Your Message"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    rows={4}
                                                    className="w-full p-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white resize-none text-[#23312D] placeholder:text-[#23312D]/50 min-h-[120px]"
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
                                                            Send Inquiry
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </div>

                                {/* Action Sidebar integration */}
                                <div className="mt-8 space-y-4 pt-8 border-t border-[#e8e6e3]">
                                    <button onClick={() => setStrategyOpen(true)} className="w-full flex items-center justify-center gap-3 bg-[#1a2622] hover:bg-[#00594F] text-white font-bold py-5 rounded-none transition-all text-xs uppercase tracking-widest shadow-lg active:scale-[0.98]">
                                        <Calendar className="w-4 h-4" /> Book Strategy Session
                                    </button>
                                    <button onClick={() => setEmailOpen(true)} className="w-full text-[10px] font-bold text-[#AE9573] uppercase tracking-widest hover:text-[#00594F] transition-all flex items-center justify-center gap-2 group py-2">
                                        <Mail className="w-3.5 h-3.5" /> Send Full Investment Analysis (PDF) <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {/* Contact Options */}
                                <div className="mt-6 space-y-3">
                                    <a
                                        href="tel:+971559304697"
                                        onClick={() => trackClick('phone', '+971 55 930 4697')}
                                        className="flex items-center justify-center gap-3 w-full py-4 border-2 border-[#00594F] text-[#00594F] font-semibold rounded-xl hover:bg-[#00594F] hover:text-white transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Call Now
                                    </a>
                                    <a
                                        href="mailto:realestate@cliftonuae.com"
                                        onClick={() => trackClick('email', 'realestate@cliftonuae.com')}
                                        className="flex items-center justify-center gap-3 w-full py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-[#3B5B5D] hover:text-[#3B5B5D] transition-colors"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Email Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Email Analysis Modal */}
            {emailOpen && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-[#23312D]/60 backdrop-blur-xl animate-in fade-in duration-300" onClick={e => { if (e.target === e.currentTarget) setEmailOpen(false); }}>
                    <div className="bg-white rounded-none p-8 w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-400">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#1a2622] via-[#AE9573] to-[#1a2622]" />
                        <div className="absolute top-6 right-6 p-2 text-gray-400 hover:text-navy transition-colors cursor-pointer" onClick={() => setEmailOpen(false)}>
                            <X className="w-5 h-5" />
                        </div>

                        {analysisSubmitted ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-[#00594F]" />
                                </div>
                                <h3 className="font-cinzel text-xl font-bold text-navy mb-4 uppercase tracking-tight">Report Requested</h3>
                                <p className="text-[11px] text-gray-500 mb-8 font-medium leading-relaxed">
                                    Thank you. Your investment analysis report is being generated and will be sent to <strong>{analysisForm.email}</strong> shortly.
                                </p>
                                <button onClick={() => { setEmailOpen(false); setAnalysisSubmitted(false); }} className="w-full bg-[#1a2622] text-white text-[10px] font-bold py-4 rounded-none uppercase tracking-widest shadow-lg">
                                    Close Window
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-4xl mb-6 text-center text-navy"><BarChart3 className="w-12 h-12 mx-auto" strokeWidth={1.5} /></div>
                                <h3 className="font-cinzel text-xl font-bold text-navy text-center mb-2 uppercase tracking-tight">Investment Analysis</h3>
                                <p className="text-[11px] text-gray-500 text-center mb-8 font-medium leading-relaxed">
                                    A detailed breakdown including ROI projections, cost analysis, and area intelligence for <strong>{property?.title}</strong>.
                                </p>
                                <form onSubmit={handleAnalysisSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                            <input required type="text" placeholder="John" value={analysisForm.firstName} onChange={e => setAnalysisForm({ ...analysisForm, firstName: e.target.value })} className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#AE9573] transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                            <input required type="text" placeholder="Doe" value={analysisForm.lastName} onChange={e => setAnalysisForm({ ...analysisForm, lastName: e.target.value })} className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#AE9573] transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input required type="email" placeholder="john@example.com" value={analysisForm.email} onChange={e => setAnalysisForm({ ...analysisForm, email: e.target.value })} className="w-full px-4 py-3 border border-gray-100 bg-gray-50 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#AE9573] transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <PhoneInput value={analysisForm.phone} onChange={val => setAnalysisForm({ ...analysisForm, phone: val })} className="w-full h-11 bg-gray-50 border border-gray-100 rounded-none focus-within:border-[#AE9573] transition-colors text-xs" />
                                    </div>
                                    <button disabled={analysisIsSubmitting} type="submit" className="w-full bg-[#1a2622] hover:bg-black text-white font-bold py-4 rounded-none text-xs uppercase tracking-[0.2em] transition-all shadow-xl mt-2 flex items-center justify-center gap-3">
                                        {analysisIsSubmitting ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</> : 'Send My Report'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            <StrategySessionModal
                isOpen={strategyOpen}
                onClose={() => setStrategyOpen(false)}
                propertyName={property?.title}
            />
        </div>
    );
}

export default function PropertyDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading property details...</div>}>
            <PropertyDetailPageContent />
        </Suspense>
    );
}
