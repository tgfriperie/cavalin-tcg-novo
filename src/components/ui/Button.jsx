import React from 'react';

const variants = {
    primary: "bg-[#D946EF] hover:bg-[#A21CAF] text-[#1F2937]", // Fuchsia
    gradient: "bg-gradient-to-r from-[#A21CAF] to-[#F43F5E] text-white", // Action Gradient
    danger: "bg-[#F43F5E] hover:bg-[#be123c] text-white", // Rose
    whatsapp: "bg-[#25D366] hover:bg-[#128C7E] text-[#1A1129]", // Green
    secondary: "bg-white/10 hover:bg-white/20 text-[#F1F5F9]", // Ghost/Cancel
    icon: "p-2 rounded-full hover:bg-white/5 text-[#D946EF]" // Icon buttons
};

const Button = ({ 
    children, 
    variant = 'primary', 
    className = '', 
    onClick, 
    type = 'button', 
    disabled = false,
    ...props 
}) => {
    return (
        <button 
            type={type}
            className={`
                px-4 py-2 rounded-lg font-bold transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant] || variants.primary} 
                ${className}
            `}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;