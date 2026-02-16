"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { properties as staticProperties, Property } from '@/lib/propertiesData';
import { fetchPropertiesFromSheet } from '@/lib/googleSheets';
import { submitInquiry } from '@/lib/inquiryService';
import { MapPin, Bed, Bath, Square, ArrowRight, X, User, Mail, Phone, Send, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { sortedCountries } from '@/lib/countries';

export default function PropertiesSection() {
    const [properties, setProperties] = useState<Property[]>(staticProperties);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('All');
    const [selectedBeds, setSelectedBeds] = useState('All');

    useEffect(() => {
        const loadProperties = async () => {
            setIsLoading(true);
            try {
                const data = await fetchPropertiesFromSheet();
                setProperties(data);
            } catch (error) {
                console.error("Failed to load dynamic properties:", error);
                setProperties(staticProperties);
            } finally {
                setIsLoading(false);
            }
        };
        loadProperties();
    }, []);

    // Extract unique types and beds for filters
    const propertyTypes = ['All', ...Array.from(new Set(properties.map(p => p.type)))];
    const bedOptions = ['All', '1', '2', '3', '4', '5+'];

    const filteredProperties = properties.filter(property => {
        const typeMatch = selectedType === 'All' || property.type === selectedType;
        const bedsMatch = selectedBeds === 'All' ||
            (selectedBeds === '5+' ? (property.beds || 0) >= 5 : (property.beds || 0).toString() === selectedBeds);
        return typeMatch && bedsMatch;
    });

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        countryCode: '+971',
        message: "I'm interested in this property. Please provide more details."
    });

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const success = await submitInquiry({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: `${formData.countryCode} ${formData.phone}`,
            message: formData.message,
            projectOrService: `Property Enquiry: ${selectedProperty?.title || "Unknown Property"}`
        });

        setIsSubmitting(false);
        if (success) {
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setSelectedProperty(null);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    countryCode: '+971',
                    message: "I'm interested in this property. Please provide more details."
                });
            }, 3000);
        }
    };

    return (
        <section id="properties" className="py-32 bg-[#F9F8F6]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase block mb-4">Prime Selection</span>
                        <h2
                            className="text-5xl md:text-6xl text-[#23312D] leading-tight"
                            style={{ fontFamily: 'var(--font-cinzel), serif' }}
                        >
                            PROPERTY <span className="italic">PORTFOLIO</span>
                        </h2>
                        <p className="mt-6 text-[#5a5a5a] text-lg">
                            Discover luxury living in Dubai with our curated selection of properties. Filter by type and size to find your perfect home.
                        </p>
                    </div>
                    <Link
                        href="/properties"
                        className="group flex items-center gap-3 text-[#23312D] font-medium tracking-widest uppercase text-sm"
                    >
                        View Full Map
                        <div className="w-10 h-10 rounded-full border border-[#23312D]/20 flex items-center justify-center group-hover:bg-[#23312D] group-hover:text-white transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </Link>
                </div>

                {/* Filter Bar */}
                <div className="mb-12 flex flex-wrap gap-4 items-center bg-white p-6 rounded-sm shadow-sm border border-[#23312D]/5">
                    <div className="flex flex-col gap-2 min-w-[200px]">
                        <span className="text-[10px] tracking-widest uppercase text-[#5a5a5a] font-bold">Property Type</span>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="h-12 bg-[#F9F8F6] border-none text-[#23312D] px-4 text-sm focus:ring-1 focus:ring-[#AE9573] outline-none"
                        >
                            {propertyTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[150px]">
                        <span className="text-[10px] tracking-widest uppercase text-[#5a5a5a] font-bold">Bedrooms</span>
                        <div className="flex bg-[#F9F8F6] p-1 rounded-sm">
                            {bedOptions.map(option => (
                                <button
                                    key={option}
                                    onClick={() => setSelectedBeds(option)}
                                    className={`flex-1 h-10 px-3 text-[10px] font-bold transition-all duration-300 ${selectedBeds === option
                                        ? "bg-[#23312D] text-white shadow-lg"
                                        : "text-[#23312D]/60 hover:text-[#23312D]"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="ml-auto">
                        <span className="text-xs text-[#5a5a5a] italic">Showing {filteredProperties.length} properties</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[400px]">
                    {isLoading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20">
                            <RefreshCw className="w-10 h-10 text-[#AE9573] animate-spin mb-4" />
                            <p className="text-[#5a5a5a] tracking-widest uppercase text-sm">Loading Properties...</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredProperties.length > 0 ? (
                                filteredProperties.map((property, index) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                        index={index}
                                        onOpenModal={() => setSelectedProperty(property)}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-[#23312D]/5 flex items-center justify-center mb-6">
                                        <Info className="w-8 h-8 text-[#AE9573]" />
                                    </div>
                                    <h3 className="text-xl text-[#23312D] mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>No matching properties</h3>
                                    <p className="text-[#5a5a5a]">Try adjusting your filters to see more results.</p>
                                    <button
                                        onClick={() => { setSelectedType('All'); setSelectedBeds('All'); }}
                                        className="mt-6 text-[#AE9573] text-xs font-bold uppercase tracking-widest border-b border-[#AE9573] pb-1"
                                    >
                                        Reset Filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {selectedProperty && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProperty(null)}
                            className="absolute inset-0 bg-[#23312D]/90 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#23312D] backdrop-blur-md flex items-center justify-center transition-all duration-300"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Property Info Side */}
                            <div className="md:w-1/2 relative min-h-[300px] md:min-h-0">
                                <img
                                    src={selectedProperty.image}
                                    alt={selectedProperty.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#23312D] via-transparent to-transparent" />

                                <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                    <div className="flex items-center gap-2 text-[#AE9573] text-xs tracking-widest uppercase mb-4">
                                        <MapPin className="w-4 h-4" />
                                        {selectedProperty.location}
                                    </div>
                                    <h3
                                        className="text-3xl md:text-4xl mb-4"
                                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                                    >
                                        {selectedProperty.title}
                                    </h3>
                                    <div className="text-2xl font-bold text-[#AE9573] mb-6">
                                        {selectedProperty.price}
                                    </div>

                                    <div className="flex items-center gap-6 text-xs tracking-widest uppercase opacity-80">
                                        <div className="flex items-center gap-2">
                                            <Bed className="w-4 h-4" />
                                            {selectedProperty.beds} Beds
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Bath className="w-4 h-4" />
                                            {selectedProperty.baths} Baths
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Square className="w-4 h-4" />
                                            {selectedProperty.area} Sq.Ft
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inquiry Form Side */}
                            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto bg-[#F9F8F6]">
                                {submitted ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl text-[#23312D]" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Inquiry Received</h4>
                                            <p className="text-[#5a5a5a]">Thank you for your interest. One of our luxury property consultants will contact you shortly.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-2xl text-[#23312D] mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>ENQUIRE NOW</h4>
                                            <p className="text-[#5a5a5a] text-sm">Please fill out the form below and we&apos;ll get back to you with exclusive information about this property.</p>
                                        </div>

                                        <form onSubmit={handleInquiry} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="First Name"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        className="w-full h-14 pl-12 pr-4 bg-white border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none text-[#23312D] placeholder:text-[#23312D]/50 transition-all font-medium"
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
                                                        className="w-full h-14 pl-12 pr-4 bg-white border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none text-[#23312D] placeholder:text-[#23312D]/50 transition-all font-medium"
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
                                                    className="w-full h-14 pl-12 pr-4 bg-white border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none text-[#23312D] placeholder:text-[#23312D]/50 transition-all font-medium"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <select
                                                    value={formData.countryCode}
                                                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                                    className="w-32 h-14 bg-white border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none text-[#23312D] font-medium appearance-none px-4"
                                                    style={{ backgroundPosition: 'calc(100% - 10px) center', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray' %3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundSize: '10px' }}
                                                >
                                                    {sortedCountries.map(c => (
                                                        <option key={c.code} value={c.dialCode}>
                                                            {c.code} ({c.dialCode})
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="relative flex-1">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input
                                                        required
                                                        type="tel"
                                                        placeholder="Phone Number"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full h-14 pl-12 pr-4 bg-white border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none text-[#23312D] placeholder:text-[#23312D]/50 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                rows={4}
                                                placeholder="Message"
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full p-4 bg-white border border-[#e8e6e3] focus:border-[#00594F] focus:outline-none rounded-none text-[#23312D] placeholder:text-[#23312D]/50 transition-all resize-none font-medium"
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
                                                        Send Inquiry <Send className="w-4 h-4 ml-2" />
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-[10px] text-[#5a5a5a] text-center uppercase tracking-widest mt-4">
                                                Your data is handled with the outmost confidentiality.
                                            </p>
                                        </form>

                                        <div className="pt-6 border-t border-[#23312D]/10">
                                            <Link
                                                href={`/properties/${selectedProperty.id}`}
                                                className="flex items-center justify-center gap-2 text-[#23312D] text-xs font-bold uppercase tracking-widest hover:text-[#AE9573] transition-colors"
                                            >
                                                Explore Full Details <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}

function PropertyCard({ property, index, onOpenModal }: { property: any, index: number, onOpenModal: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="group cursor-pointer"
            onClick={onOpenModal}
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-6 shadow-md">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-[#23312D]/60 transition-colors duration-500 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                    >
                        <div className="bg-[#AE9573] text-white text-[10px] tracking-[0.2em] font-bold px-8 py-3 uppercase shadow-xl flex items-center gap-2">
                            Enquire Now <ArrowRight className="w-3 h-3" />
                        </div>
                    </motion.div>
                </div>

                <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md text-[#23312D] text-[10px] tracking-[0.2em] font-bold px-4 py-2 uppercase">
                        {property.type}
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex flex-col gap-2">
                        <span className="text-white text-lg font-bold" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                            {property.price}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3
                    className="text-2xl text-[#23312D] group-hover:text-[#AE9573] transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                >
                    {property.title}
                </h3>

                <div className="flex items-center text-[#5a5a5a] text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-[#AE9573]" />
                    {property.location}
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-[#23312D]/10 text-[#5a5a5a] text-xs tracking-widest uppercase">
                    <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-[#AE9573]" />
                        {property.beds} Beds
                    </div>
                    <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-[#AE9573]" />
                        {property.baths} Baths
                    </div>
                    <div className="flex items-center gap-2">
                        <Square className="w-4 h-4 text-[#AE9573]" />
                        {property.area} Sq.Ft
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
