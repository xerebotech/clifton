"use client";

import React, { useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';

interface RippleType {
    x: number;
    y: number;
    id: number;
}

interface RippleButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: "button" | "submit" | "reset";
}

export default function RippleButton({ children, onClick, className = "", type = "button" }: RippleButtonProps) {
    const [ripples, setRipples] = useState<RippleType[]>([]);

    const addRipple = (e: MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = {
            x,
            y,
            id: Date.now()
        };

        setRipples([...ripples, newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 600);
    };

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        addRipple(e);
        onClick?.();
    };

    return (
        <motion.button
            type={type}
            onClick={handleClick}
            className={`relative overflow-hidden ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {children}

            {/* Ripple effects */}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: 0,
                        height: 0,
                        transform: 'translate(-50%, -50%)'
                    }}
                />
            ))}
        </motion.button>
    );
}
