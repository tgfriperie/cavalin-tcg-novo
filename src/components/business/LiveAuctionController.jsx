import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/financialCalculations';

const LiveAuctionController = ({ 
    card, 
    initialTimer = 60, 
    onBid, 
    onNext, 
    onWhatsAppShare 
}) => {
    const [timer, setTimer] = useState(initialTimer);

    // Efeito do Timer
    useEffect(() => {
        setTimer(initialTimer); // Reseta quando muda a carta
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [card, initialTimer]);

    // Cor do Timer baseada no tempo
    const getTimerColor = () => {
        if (timer <= 15) return "text-[#F43F5E] animate-pulse";
        if (timer <= 30) return "text-yellow-400";
        return "text-[#34D399]";
    };

    if (!card) return <div className="text-white text-center">Nenhuma carta selecionada.</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da Esquerda: Imagem e Timer */}
            <Card className="lg:col-span-2 flex flex-col items-center justify-center min-h-[500px]">
                <img 
                    src={card.img} 
                    alt={card.name} 
                    className="max-h-96 rounded-lg shadow-2xl mb-6 border-4 border-[#28193C]"
                />
                <div className={`font-bold text-9xl transition-colors duration-500 ${getTimerColor()}`}>
                    {timer}
                </div>
            </Card>

            {/* Coluna da Direita: Detalhes e Ações */}
            <Card className="space-y-6">
                <div>
                    <h2 className="font-bold text-3xl text-[#D946EF] leading-tight">
                        {card.name}
                    </h2>
                    <span className="text-lg text-gray-400 block mt-1">{card.collection}</span>
                </div>

                <div className="space-y-2 text-lg border-t border-white/10 pt-4">
                    <p className="text-[#F1F5F9]">Condição: <strong>{card.condition}</strong></p>
                    <p className="text-[#F1F5F9]">Idioma: <strong>{card.language}</strong></p>
                    <p className="text-[#F1F5F9]">
                        Inicial: <strong className="text-green-400">{formatCurrency(card.initialValue)}</strong>
                    </p>
                    <p className="text-[#F1F5F9]">
                        Mínimo: R$ {Number(card.increment).toFixed(2)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button variant="whatsapp" onClick={onWhatsAppShare} className="w-full flex justify-center items-center gap-2">
                        WhatsApp
                    </Button>
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(card.name)}>
                        Copiar Nome
                    </Button>
                </div>

                <div className="pt-6 space-y-3 border-t border-white/10">
                    <Button variant="primary" onClick={onBid} className="w-full text-xl py-4 shadow-lg shadow-fuchsia-900/20">
                        🔨 ARREMATAR
                    </Button>
                    <Button variant="secondary" onClick={onNext} className="w-full">
                        Próxima Carta (Pular)
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default LiveAuctionController;