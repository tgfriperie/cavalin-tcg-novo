import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { formatCurrency } from '../../utils/financialCalculations';
import { generateAndShareImage } from '../../utils/imageGenerator'; // <--- Importe aqui

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
        setTimer(initialTimer); 
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [card, initialTimer]);

    const getTimerColor = () => {
        if (timer <= 15) return "text-[#F43F5E] animate-pulse";
        if (timer <= 30) return "text-yellow-400";
        return "text-[#34D399]";
    };

    if (!card) return <div className="text-white text-center">Nenhuma carta selecionada.</div>;

    // Função para gerar a imagem desta carta específica
    const handleImageShare = () => {
        // 'live-card-display' é o ID que colocamos na div abaixo
        generateAndShareImage('live-card-display', `leilao-${card.name}.png`);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna da Esquerda: Imagem e Timer */}
            {/* ADICIONAMOS O ID AQUI PARA O HTML2CANVAS ENCONTRAR */}
            <Card id="live-card-display" className="lg:col-span-2 flex flex-col items-center justify-center min-h-[500px] relative bg-[#1A1129]">
                {/* Cabeçalho extra visível apenas na imagem (opcional, ou pode ser parte do design) */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-50">
                   <span className="text-xs text-white">CAVALLIN TCG LEILÕES</span>
                   <span className="text-xs text-white">{new Date().toLocaleDateString()}</span>
                </div>

                <img 
                    src={card.img} 
                    alt={card.name} 
                    // crossOrigin="anonymous" é CRUCIAL para o html2canvas não quebrar com imagens externas
                    crossOrigin="anonymous"
                    className="max-h-96 rounded-lg shadow-2xl mb-6 border-4 border-[#28193C]"
                />
                
                {/* Ocultamos o timer na hora da foto se o timer for 0 ou se preferir sem timer */}
                <div className={`font-bold text-9xl transition-colors duration-500 ${getTimerColor()}`}>
                    {timer}
                </div>

                {/* Overlay de Vencedor (se houver) */}
                {card.winningClient && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                        <div className="transform -rotate-12 border-4 border-green-500 p-4 rounded-xl bg-black/80">
                            <h2 className="text-5xl font-bold text-green-500 uppercase tracking-widest">VENDIDO</h2>
                            <p className="text-white text-center text-xl mt-2">{card.winningClient}</p>
                            <p className="text-green-400 text-center text-2xl font-bold">{formatCurrency(card.currentBid)}</p>
                        </div>
                    </div>
                )}
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
                        Mínimo: R$ {Number(card.increment || 0).toFixed(2)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                    <Button variant="whatsapp" onClick={onWhatsAppShare} className="w-full flex justify-center items-center gap-2">
                        WhatsApp Texto
                    </Button>
                    {/* NOVO BOTÃO DE IMAGEM */}
                    <Button variant="primary" onClick={handleImageShare} className="w-full flex justify-center items-center gap-2">
                        📸 Gerar Imagem
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