import React from 'react';
import Card from './Card'; // Reutiliza o estilo do Card
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1129]/80 backdrop-blur-sm p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto relative flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-2xl text-[#D946EF]">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-[#D946EF]/20">
                        {footer}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Modal;