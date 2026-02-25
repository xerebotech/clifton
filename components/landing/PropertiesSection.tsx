"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { properties as staticProperties, Property } from '@/lib/propertiesData';
import { fetchPropertiesFromSheet } from '@/lib/googleSheets';
import { submitInquiry } from '@/lib/inquiryService';
import { MapPin, Bed, Bath, Square, ArrowRight, X, User, Mail, Phone, Send, CheckCircle, Info, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import PhoneInput from '../ui/PhoneInput';
import PropertyPopup from '../properties/PropertyPopup';
import { calcEMI, grossYield } from '../properties/utils';

function PropertiesSectionContent() {
    const searchParams = useSearchParams();
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

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setItemsPerPage(6);
            else if (window.innerWidth >= 768) setItemsPerPage(4);
            else setItemsPerPage(2);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(0);
    }, [selectedType, selectedBeds]);

    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    const paginatedProperties = filteredProperties.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [currency, setCurrency] = useState('AED');
    const [savedIds, setSavedIds] = useState<string[]>([]);

    const handleToggleSave = (id: string) => {
        setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handlePrev = () => {
        if (!selectedProperty) return;
        const idx = properties.findIndex(p => p.id === selectedProperty.id);
        const prevIdx = (idx - 1 + properties.length) % properties.length;
        setSelectedProperty(properties[prevIdx]);
    };

    const handleNext = () => {
        if (!selectedProperty) return;
        const idx = properties.findIndex(p => p.id === selectedProperty.id);
        const nextIdx = (idx + 1) % properties.length;
        setSelectedProperty(properties[nextIdx]);
    };

    return (
        <PropertiesSectionContentWrapper
            propertyTypes={propertyTypes}
            bedOptions={bedOptions}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedBeds={selectedBeds}
            setSelectedBeds={setSelectedBeds}
            isLoading={isLoading}
            paginatedProperties={paginatedProperties}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            onOpenModal={(property: Property) => setSelectedProperty(property)}
            totalFiltered={filteredProperties.length}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            currency={currency}
            setCurrency={setCurrency}
            handlePrev={handlePrev}
            handleNext={handleNext}
            savedIds={savedIds}
            handleToggleSave={handleToggleSave}
            allProperties={properties}
        />
    );
}

function PropertiesSectionContentWrapper({
    propertyTypes,
    bedOptions,
    selectedType,
    setSelectedType,
    selectedBeds,
    setSelectedBeds,
    isLoading,
    paginatedProperties,
    currentPage,
    setCurrentPage,
    totalPages,
    onOpenModal,
    totalFiltered,
    selectedProperty,
    setSelectedProperty,
    isSubmitting,
    submitted,
    formData,
    setFormData,
    handleInquiry,
    currency,
    setCurrency,
    handlePrev,
    handleNext,
    savedIds,
    handleToggleSave,
    allProperties
}: any) {
    return (
        <section id="properties" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mb-4"
                        >
                            <span className="w-12 h-[1px] bg-[#AE9573]"></span>
                            <span className="text-[#AE9573] text-sm tracking-[0.3em] font-bold uppercase">Curated Portfolio</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl text-[#23312D] mb-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                            Investment
                            <span className="text-[#AE9573] italic">Opportunities</span>
                        </h2>
                        <p className="text-[#5a5a5a] text-lg leading-relaxed max-w-xl">
                            Each property selected for yield, developer reputation, location growth, and Golden Visa eligibility. Compare side-by-side with real ROI data.

                        </p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-8 mb-16 pb-8 border-b border-[#23312D]/10">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] tracking-[0.2em] font-bold text-[#AE9573] uppercase">Type:</span>
                        <div className="flex gap-4">
                            {propertyTypes.map((type: string) => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`text-xs tracking-widest uppercase transition-all duration-300 pb-1 border-b ${selectedType === type ? 'text-[#23312D] border-[#AE9573] font-bold' : 'text-[#5a5a5a] border-transparent hover:text-[#23312D]'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-[10px] tracking-[0.2em] font-bold text-[#AE9573] uppercase">Beds:</span>
                        <div className="flex gap-4">
                            {bedOptions.map((beds: string) => (
                                <button
                                    key={beds}
                                    onClick={() => setSelectedBeds(beds)}
                                    className={`text-xs tracking-widest uppercase transition-all duration-300 pb-1 border-b ${selectedBeds === beds ? 'text-[#23312D] border-[#AE9573] font-bold' : 'text-[#5a5a5a] border-transparent hover:text-[#23312D]'
                                        }`}
                                >
                                    {beds === 'All' ? 'All' : beds}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage + selectedType + selectedBeds}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[400px]"
                        >
                            {isLoading ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-24">
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
                                    <p className="text-[10px] font-bold text-[#AE9573] uppercase tracking-[0.3em] animate-pulse">
                                        Curating your investment portfolio...
                                    </p>
                                </div>
                            ) : (
                                paginatedProperties.length > 0 ? (
                                    paginatedProperties.map((property: any, index: number) => (
                                        <PropertyCard
                                            key={property.id}
                                            property={property}
                                            index={index}
                                            onOpenModal={() => onOpenModal(property)}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                        <div className="w-16 h-16 rounded-full bg-[#23312D]/5 flex items-center justify-center mb-6">
                                            <Info className="w-8 h-8 text-[#AE9573]" />
                                        </div>
                                        <h3 className="text-xl text-[#23312D] mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>No matching properties</h3>
                                        <p className="text-[#5a5a5a]">Try adjusting your filters to see more results.</p>
                                    </div>
                                )
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-6 mt-16">
                            <button
                                onClick={() => setCurrentPage((prev: number) => Math.max(0, prev - 1))}
                                disabled={currentPage === 0}
                                className={`w-12 h-12 rounded-full border border-[#23312D]/10 flex items-center justify-center transition-all duration-300 ${currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#23312D] hover:text-white'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="flex gap-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${currentPage === i ? 'bg-[#AE9573] w-8' : 'bg-[#23312D]/20 hover:bg-[#23312D]/40'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() => setCurrentPage((prev: number) => Math.min(totalPages - 1, prev + 1))}
                                disabled={currentPage === totalPages - 1}
                                className={`w-12 h-12 rounded-full border border-[#23312D]/10 flex items-center justify-center transition-all duration-300 ${currentPage === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#23312D] hover:text-white'
                                    }`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* NEW MODULAR PROPERTY POPUP */}
            {
                selectedProperty && (
                    <PropertyPopup
                        p={selectedProperty}
                        allProperties={allProperties}
                        onClose={() => setSelectedProperty(null)}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        currency={currency}
                        onCurrencyChange={setCurrency}
                        savedIds={savedIds}
                        onToggleSave={handleToggleSave}
                    />
                )
            }
        </section >
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
            className="group cursor-pointer relative"
            onClick={onOpenModal}
        >
            <div className="relative aspect-[3/2] overflow-hidden rounded-sm shadow-md mb-0">
                <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />

                {/* Default Status Tag */}
                <div className="absolute top-6 left-6 z-10 transition-opacity duration-300 group-hover:opacity-0">
                    <span className="bg-white/90 backdrop-blur-md text-[#23312D] text-[10px] tracking-[0.2em] font-bold px-4 py-2 uppercase">
                        {property.type}
                    </span>
                </div>

                {/* Default Bottom info overlay (fades out on hover) */}
                <div className="absolute inset-x-0 bottom-0 p-8 pt-24 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-0">
                    <div className="text-[#AE9573] text-sm tracking-widest uppercase mb-1 font-bold">
                        {property.price}
                    </div>
                    <div className="text-white text-lg font-medium leading-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        {property.title}
                    </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#23312D]/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center">
                    <motion.div
                        className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center gap-6"
                    >
                        {/* GET INFO Button */}
                        <div className="bg-[#AE9573] text-white text-[10px] tracking-[0.2em] font-bold px-10 py-4 uppercase shadow-xl flex items-center gap-2 transform group-hover:scale-105 transition-all">
                            GET INFO <ArrowRight className="w-4 h-4" />
                        </div>

                        {/* Title and Details inside Overlay */}
                        <div className="space-y-4">
                            <h3 className="text-2xl text-white leading-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                {property.title}
                            </h3>
                            <div className="flex items-center justify-center gap-2 text-[#AE9573] text-xs">
                                <MapPin className="w-3 h-3" />
                                {property.location}
                            </div>
                            <div className="flex items-center justify-center gap-6 text-[10px] tracking-[0.2em] text-white/60 uppercase pt-4 border-t border-white/10 mt-2">
                                <div className="flex items-center gap-2">
                                    <Bed className="w-3 h-3" /> {property.beds}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Bath className="w-3 h-3" /> {property.baths}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Square className="w-3 h-3" /> {property.area}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
export default function PropertiesSection() {
    return (
        <Suspense fallback={
            <div className="py-32 bg-white flex flex-col items-center justify-center">
                <div className="animate-pulse mb-8">
                    <img src="/logo.png" alt="Clifton Capital" className="h-24 w-auto object-contain brightness-0 grayscale opacity-20" />
                </div>
                <p className="text-[10px] font-bold text-[#AE9573] uppercase tracking-[0.3em]">Initialising Portfolio...</p>
            </div>
        }>
            <PropertiesSectionContent />
        </Suspense>
    );
}
