"use client";

import React from 'react';
import { motion } from 'framer-motion';

const projects = [
    {
        name: "Emaar Beachfront",
        location: "Dubai Marina",
        image: "https://images.unsplash.com/photo-1549944850-84e00be4203b?w=800&q=80",
        size: "lg"
    },
    {
        name: "Palm Jumeirah",
        location: "The Palm",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
        size: "sm"
    },
    {
        name: "Downtown Dubai",
        location: "Burj Khalifa District",
        image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
        size: "sm"
    },
    {
        name: "Dubai Hills Estate",
        location: "The Green Heart",
        image: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=800&q=80",
        size: "md"
    }
];

export default function FeaturedProjects() {
    return (
        <section className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 text-center">
                    <span className="text-[#AE9573] text-sm tracking-[0.3em] uppercase block mb-4">Curated Collection</span>
                    <h2
                        className="text-5xl md:text-6xl text-[#23312D]"
                        style={{ fontFamily: 'var(--font-cinzel), serif' }}
                    >
                        THE ICONIC <span className="italic">DESTINATIONS</span>
                    </h2>
                </div>

                <div className="flex flex-col md:grid md:grid-cols-12 gap-6 h-auto md:h-[900px]">
                    {/* Bento Box-ish Layout */}
                    <div className="md:col-span-8 h-[400px] md:h-full">
                        <ProjectCard project={projects[0]} />
                    </div>
                    <div className="md:col-span-4 flex flex-col gap-6 h-full">
                        <div className="h-[300px] md:h-1/2">
                            <ProjectCard project={projects[1]} />
                        </div>
                        <div className="h-[300px] md:h-1/2">
                            <ProjectCard project={projects[2]} />
                        </div>
                    </div>
                    <div className="md:col-span-12 h-[400px]">
                        <ProjectCard project={projects[3]} />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProjectCard({ project }: { project: any }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="group relative h-full w-full overflow-hidden rounded-sm cursor-pointer"
        >
            <img
                src={project.image}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

            <div className="absolute bottom-10 left-10 text-white">
                <p className="text-[#AE9573] text-xs tracking-widest uppercase mb-2">{project.location}</p>
                <h3
                    className="text-3xl font-light"
                    style={{ fontFamily: 'var(--font-cinzel), serif' }}
                >
                    {project.name}
                </h3>
            </div>

            <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transition-transform duration-500">
                <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white backdrop-blur-sm">
                    <span className="text-[10px] tracking-widest uppercase">View</span>
                </div>
            </div>
        </motion.div>
    );
}
