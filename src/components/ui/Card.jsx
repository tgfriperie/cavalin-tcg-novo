import React from 'react';

const Card = ({ children, className = '', noPadding = false }) => {
    return (
        <div className={`
            bg-[#28193C]/50 backdrop-blur-md border border-[#D946EF]/20 
            rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.1)]
            ${noPadding ? '' : 'p-6'}
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;