import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { db } from '../services/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { formatCurrency } from '../utils/financialCalculations';

const AuctionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auctions, cards, refreshData } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    // Encontra o leilão atual baseado na URL
    const auction = auctions.find(a => a.id === id);

    // Se não achar (dados carregando ou id inválido), retorna null ou loading
    if (!auction && auctions.length > 0) {
        return <div className="text-center p-10 text-white">Leilão não encontrado.</div>;
    }
    if (!auction) return null; // Loading state

    // --- Lógica de Listas ---

    // 1. Cartas na Fila (Direita): Mapeia os IDs salvos no leilão para os objetos reais de cartas
    const queueCards = (auction.cardIds || []).map(cardId => 
        cards.find(c => c.id === cardId)
    ).filter(Boolean); // Remove nulos caso algum ID não exista mais

    // 2. Cartas Disponíveis (Esquerda): Estoque, filtrando as que já estão na fila
    const availableCards = cards.filter(c => 
        c.status === 'inventory' && 
        !auction.cardIds?.includes(c.id) &&
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Ações do Firestore ---

    const handleAddToQueue = async (cardId) => {
        try {
            const auctionRef = doc(db, 'leiloes', id);
            // Adiciona ao array cardIds
            await updateDoc(auctionRef, {
                cardIds: arrayUnion(cardId)
            });
            await refreshData();
        } catch (error) {
            console.error("Erro ao adicionar:", error);
        }
    };

    const handleRemoveFromQueue = async (cardId) => {
        try {
            const auctionRef = doc(db, 'leiloes', id);
            await updateDoc(auctionRef, {
                cardIds: arrayRemove(cardId)
            });
            await refreshData();
        } catch (error) {
            console.error("Erro ao remover:", error);
        }
    };

    // Reordenação Manual (Sobe/Desce)
    const moveItem = async (index, direction) => {
        const newQueue = [...(auction.cardIds || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Troca de posição
        [newQueue[index], newQueue[targetIndex]] = [newQueue[targetIndex], newQueue[index]];

        try {
            const auctionRef = doc(db, 'leiloes', id);
            // Salva o array inteiro reordenado
            await updateDoc(auctionRef, {
                cardIds: newQueue
            });
            await refreshData();
        } catch (error) {
            console.error("Erro ao reordenar:", error);
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center">
                <div>
                    <Button variant="secondary" onClick={() => navigate('/auctions')} className="mb-2 text-sm">
                        ← Voltar
                    </Button>
                    <h1 className="text-3xl font-bold text-[#D946EF]">{auction.name}</h1>
                    <p className="text-gray-400">
                        {new Date(auction.date).toLocaleDateString('pt-BR')} • {queueCards.length} itens na fila
                    </p>
                </div>
                {/* Botão de Navegação Atualizado */}
                <Button 
                    variant="whatsapp" 
                    onClick={() => navigate(`/live/${id}`)}
                >
                    Iniciar Leilão Ao Vivo 🚀
                </Button>
            </div>

            {/* Layout de Duas Colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
                
                {/* COLUNA ESQUERDA: Disponíveis */}
                <Card className="flex flex-col h-full overflow-hidden" noPadding>
                    <div className="p-4 border-b border-[#D946EF]/20 bg-[#28193C]">
                        <h2 className="text-xl font-bold text-white mb-2">Disponíveis no Estoque</h2>
                        <Input 
                            placeholder="Buscar carta..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="text-sm"
                        />
                    </div>
                    
                    <div className="overflow-y-auto p-4 space-y-2 flex-1 custom-scrollbar">
                        {availableCards.map(card => (
                            <div key={card.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <img src={card.img} alt="" className="w-10 h-14 object-cover rounded bg-gray-800"/>
                                    <div className="min-w-0">
                                        <p className="font-bold text-[#F1F5F9] truncate">{card.name}</p>
                                        <p className="text-xs text-gray-500">{card.collection} • {formatCurrency(card.initialValue)}</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="primary" 
                                    className="px-3 py-1 text-xs"
                                    onClick={() => handleAddToQueue(card.id)}
                                >
                                    Adicionar →
                                </Button>
                            </div>
                        ))}
                        {availableCards.length === 0 && (
                            <p className="text-center text-gray-500 mt-4">Nenhum item disponível encontrado.</p>
                        )}
                    </div>
                </Card>

                {/* COLUNA DIREITA: Fila do Leilão */}
                <Card className="flex flex-col h-full overflow-hidden border-[#D946EF]" noPadding>
                    <div className="p-4 border-b border-[#D946EF]/20 bg-[#28193C] flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#D946EF]">Fila do Leilão (Ordem)</h2>
                        <span className="text-xs text-gray-400">Total: {formatCurrency(queueCards.reduce((acc, c) => acc + (c.initialValue || 0), 0))}</span>
                    </div>

                    <div className="overflow-y-auto p-4 space-y-2 flex-1 custom-scrollbar bg-black/10">
                        {queueCards.map((card, index) => (
                            <div key={card.id} className="flex items-center p-3 bg-[#28193C]/80 border border-[#D946EF]/30 rounded-lg shadow-sm">
                                <span className="text-[#D946EF] font-bold w-6 text-center">{index + 1}</span>
                                
                                <img src={card.img} alt="" className="w-12 h-16 object-cover rounded mx-3 bg-gray-800"/>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate">{card.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <span>Início: {formatCurrency(card.initialValue)}</span>
                                        <span className={`px-1 rounded ${card.stockOwner === 'Rafael' ? 'bg-blue-900 text-blue-200' : 'bg-purple-900 text-purple-200'}`}>
                                            {card.stockOwner}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 ml-2">
                                    <div className="flex gap-1">
                                        <button 
                                            disabled={index === 0}
                                            onClick={() => moveItem(index, 'up')}
                                            className="p-1 bg-white/5 hover:bg-white/20 rounded disabled:opacity-30 text-xs"
                                            title="Subir"
                                        >
                                            ▲
                                        </button>
                                        <button 
                                            disabled={index === queueCards.length - 1}
                                            onClick={() => moveItem(index, 'down')}
                                            className="p-1 bg-white/5 hover:bg-white/20 rounded disabled:opacity-30 text-xs"
                                            title="Descer"
                                        >
                                            ▼
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveFromQueue(card.id)}
                                        className="text-xs text-red-400 hover:text-red-300 p-1 hover:bg-red-900/20 rounded"
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                        {queueCards.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                                <span className="text-4xl mb-2">📦</span>
                                <p>A fila está vazia.</p>
                                <p className="text-sm">Adicione itens da esquerda.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AuctionDetail;