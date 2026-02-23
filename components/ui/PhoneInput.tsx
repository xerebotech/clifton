"use client";

import React from 'react';
import { PhoneInput as ReactPhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import '@/app/phone-input.css';

interface PhoneInputProps {
    value: string;
    onChange: (phone: string) => void;
    placeholder?: string;
    className?: string;
    dark?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
    value,
    onChange,
    placeholder = "+971 XX XXX XXXX",
    className = "",
    dark = false,
}) => {
    return (
        <div className={`phone-input-container ${dark ? 'dark-phone-input' : ''} ${className}`}>
            <ReactPhoneInput
                defaultCountry="ae"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                inputStyle={{ width: '100%', fontSize: '16px' }}
            />
        </div>
    );
};

export default PhoneInput;
