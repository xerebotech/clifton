"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Property } from '@/lib/propertiesData';
import { fetchPropertiesFromSheet } from '@/lib/googleSheets';
import { Search, MapPin, Bed, Bath, Square, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

export default function PropertiesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const loadProperties = async () => {
            setLoading(true);
            const data = await fetchPropertiesFromSheet();
            setProperties(data);
            setLoading(false);
        };
        loadProperties();
    }, []);

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || property.type === selectedType;
        return matchesSearch && matchesType;
    });

    const propertyTypes = ['All', ...Array.from(new Set(properties.map(p => p.type)))];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F2F0EB] to-white">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-[#23312D] via-[#1a2521] to-[#111a17] py-28 px-6 text-center text-white overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#B4A68C] rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 text-[#B4A68C] text-sm tracking-[0.3em] uppercase mb-4"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Sparkles className="w-4 h-4" />
                        Premium Portfolio
                        <Sparkles className="w-4 h-4" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl mt-4 max-w-3xl mx-auto font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                        Exclusive Properties in Dubai
                    </h1>
                    <p className="mt-6 text-white/70 max-w-2xl mx-auto text-lg">
                        Discover luxury living in the world's most prestigious locations
                    </p>
                </motion.div>

                {/* Enhanced Filters */}
                <motion.div
                    className="mt-12 max-w-4xl mx-auto bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#3B5B5D] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by location or project..."
                            className="w-full h-14 pl-12 pr-4 border-2 border-gray-200 rounded-xl text-[#23312D] focus:outline-none focus:border-[#00594F] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-14 border-2 border-gray-200 px-6 rounded-xl text-[#23312D] focus:outline-none focus:border-[#00594F] min-w-[200px] font-medium transition-all cursor-pointer"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        {propertyTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </motion.div>
            </section>

            {/* Grid */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="w-12 h-12 text-[#AE9573] animate-spin mb-4" />
                        <p className="text-[#23312D] text-lg font-medium">Loading properties...</p>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {filteredProperties.map((property) => (
                            <motion.div
                                key={property.id}
                                variants={cardVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
                            >
                                <Link href={`/properties/${property.id}`}>
                                    <div className="relative h-64 overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <motion.div
                                            className="absolute top-4 left-4 bg-gradient-to-r from-[#AE9573] to-[#9a8d77] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            For Sale
                                        </motion.div>
                                    </div>
                                    <div className="p-6">
                                        <span className="text-2xl text-[#23312D] font-bold block mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                                            {property.price}
                                        </span>
                                        <h3 className="text-xl text-[#1a1a1a] mb-2 font-medium group-hover:text-[#23312D] transition-colors" style={{ fontFamily: 'var(--font-cinzel), serif' }}>{property.title}</h3>
                                        <div className="flex items-center text-[#5a5a5a] text-sm mb-6">
                                            <MapPin className="w-4 h-4 mr-1 text-[#AE9573]" />
                                            {property.location}
                                        </div>

                                        <div className="flex justify-between border-t border-gray-100 pt-4 text-sm text-[#5a5a5a]">
                                            <div className="flex items-center gap-1">
                                                <Bed className="w-4 h-4 text-[#AE9573]" />
                                                {property.beds} Beds
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Bath className="w-4 h-4 text-[#AE9573]" />
                                                {property.baths} Baths
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Square className="w-4 h-4 text-[#AE9573]" />
                                                {property.area} Sq.ft
                                            </div>
                                        </div>

                                        <motion.button
                                            className="w-full mt-6 py-3 bg-gradient-to-r from-[#00594F] to-[#004a3f] text-white rounded-xl uppercase tracking-wider text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all duration-300"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            View Details
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </motion.button>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20 text-[#5a5a5a]">
                        <p className="text-xl">No properties found matching your criteria.</p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedType('All'); }}
                            className="mt-4 text-[#B4A68C] underline hover:text-[#3B5B5D]"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
