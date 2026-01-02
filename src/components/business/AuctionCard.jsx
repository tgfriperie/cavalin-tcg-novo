import React from 'react';
import { formatCurrency } from '../../utils/financialCalculations'; // Criado na Fase 2

const AuctionCard = ({ card, onRemove, ...dragProps }) => {
    return (
        <div 
            className="draggable-card flex items-center p-3 bg-black/20 rounded-lg mb-2 border border-transparent hover:border-[#D946EF]/30 transition-all cursor-move group"
            draggable={true}
            {...dragProps} // Passa eventos de drag (onDragStart, etc)
        >
            <div className="flex items-center flex-grow">
                {/* Ícone de Drag handle */}
                <svg className="w-6 h-6 mr-3 text-gray-500 group-hover:text-[#D946EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                
                <img 
                    src={card.img || 'https://placehold.co/150x210/1A1129/A09CB0?text=S/FOTO'} 
                    alt={card.name}
                    className="w-16 h-20 object-cover rounded-md mr-4 shadow-md bg-gray-800"
                />
                
                <div className="flex-grow min-w-0">
                    <span className="text-lg font-semibold text-[#F1F5F9] truncate block" title={card.name}>
                        {card.name}
                    </span>
                    <p className="text-sm text-gray-400 truncate block">
                        {card.collection || 'Sem coleção'} - {card.condition || 'N/A'}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                        <span className="text-sm text-green-400 font-bold">
                            Início: {formatCurrency(card.initialValue)}
                        </span>
                        <span className="text-xs text-[#F43F5E]">
                            Custo: {formatCurrency(card.cost)}
                        </span>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => onRemove(card.id)}
                className="p-2 rounded-full text-gray-500 hover:bg-[#F43F5E] hover:text-white transition-colors ml-4"
                title="Remover do leilão"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    );
};

export default AuctionCard;