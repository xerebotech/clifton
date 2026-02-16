"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Property } from '@/lib/propertiesData';
import { fetchPropertiesFromSheet } from '@/lib/googleSheets';
import { submitInquiry } from '@/lib/inquiryService';
import { useParams } from 'next/navigation';
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
    RefreshCw
} from 'lucide-react';

export default function PropertyDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const loadProperty = async () => {
            setLoading(true);
            const data = await fetchPropertiesFromSheet();
            const found = data.find(p => p.id === id);
            if (found) {
                setProperty(found);
                setCurrentImageIndex(0);
            }
            setLoading(false);
        };
        loadProperty();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await submitInquiry({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            projectOrService: `Property Enquiry: ${property?.title || id}`
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

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-xl font-medium text-[#23312D] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Description</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {property.description}
                                </p>
                            </div>

                            {/* Amenities */}
                            {property.amenities.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-medium text-[#23312D] mb-4" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Amenities & Features</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {property.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle className="w-5 h-5 text-[#AE9573]" />
                                                <span className="text-gray-700">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        type="tel"
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
                                                        className="w-full h-14 pl-12 pr-4 border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none bg-white text-[#23312D] placeholder:text-[#23312D]/50"
                                                    />
                                                </div>
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

                                {/* Contact Options */}
                                <div className="mt-6 space-y-3">
                                    <a
                                        href="tel:+971559304697"
                                        className="flex items-center justify-center gap-3 w-full py-4 border-2 border-[#00594F] text-[#00594F] font-semibold rounded-xl hover:bg-[#00594F] hover:text-white transition-colors"
                                    >
                                        <Phone className="w-5 h-5" />
                                        Call Now
                                    </a>
                                    <a
                                        href="mailto:realestate@cliftonuae.com"
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
        </div>
    );
}
