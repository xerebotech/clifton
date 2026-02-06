"use client";

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface AnimatedInputProps extends HTMLMotionProps<"input"> {
    icon?: React.ReactNode;
}

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
    ({ icon, className = "", ...props }, ref) => {
        return (
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00594F] transition-colors duration-300">
                        {icon}
                    </div>
                )}
                <motion.input
                    ref={ref}
                    className={`w-full h-12 ${icon ? 'pl-10' : 'pl-4'} pr-4 bg-white border-2 border-gray-200 rounded-xl text-[#23312D] focus:outline-none focus:border-[#00594F] transition-all duration-300 ${className}`}
                    whileFocus={{
                        scale: 1.01,
                        boxShadow: "0 0 0 3px rgba(59, 91, 93, 0.1)"
                    }}
                    transition={{ duration: 0.2 }}
                    {...props}
                />
            </div>
        );
    }
);

AnimatedInput.displayName = 'AnimatedInput';

export default AnimatedInput;
