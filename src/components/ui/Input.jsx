import React from 'react';

const Input = ({ label, id, className = '', ...props }) => {
    return (
        <div className={className}>
            {label && (
                <label htmlFor={id} className="block font-bold text-[#F1F5F9] mb-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                className="w-full p-2 bg-black/20 border border-[#D946EF]/20 rounded-lg 
                           text-[#F1F5F9] focus:outline-none focus:border-[#D946EF] 
                           placeholder-gray-500 transition-colors"
                {...props}
            />
        </div>
    );
};

export default Input;