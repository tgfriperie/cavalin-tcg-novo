import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLiveAuction from '../hooks/useLiveAuction';
import LiveAuctionController from '../components/business/LiveAuctionController';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { formatCurrency } from '../utils/financialCalculations';
import { useData } from '../contexts/DataContext';

const LiveAuction = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clients } = useData(); // Para autocomplete de clientes (opcional futuro)

    // Instancia o Hook com toda a lógica
    const {
        currentCard,
        currentIndex,
        totalItems,
        timer,
        isPaused,
        currentBid,
        winningClient,
        bidHistory,
        startTimer,
        pauseTimer,
        resetTimer,
        nextItem,
        registerBid,
        finishSale,
        generateWhatsAppMessage
    } = useLiveAuction(id);

    // Estados locais para o formulário de lance manual
    const [manualBidValue, setManualBidValue] = useState('');
    const [manualClientName, setManualClientName] = useState('');

    // Atualiza o valor sugerido do input quando o lance atual muda
    useEffect(() => {
        if (currentCard) {
            // Sugere lance atual + incremento
            const nextVal = (Number(currentBid) || Number(currentCard.initialValue)) + (Number(currentCard.increment) || 1);
            setManualBidValue(nextVal.toFixed(2));
        }
    }, [currentBid, currentCard]);

    const handleRegisterBid = (e) => {
        e.preventDefault();
        if (!manualBidValue || !manualClientName) return;
        
        registerBid(manualBidValue, manualClientName);
        
        // Limpa nome, mantém valor pronto para o próximo incremento
        setManualClientName(''); 
        // O useEffect acima já vai atualizar o valor sugerido
    };

    const handleWhatsAppShare = () => {
        const text = generateWhatsAppMessage();
        if (text) {
            window.open(`https://wa.me/?text=${text}`, '_blank');
        } else {
            alert("Erro ao gerar mensagem. Verifique os dados da carta.");
        }
    };

    // Renderização de "Fim do Leilão" ou "Carregando"
    if (!currentCard && totalItems > 0 && currentIndex >= totalItems) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
                <h1 className="text-4xl font-bold text-[#D946EF]">Leilão Finalizado! 🎉</h1>
                <p className="text-gray-400">Todos os itens da fila foram processados.</p>
                <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
            </div>
        );
    }

    if (!currentCard) {
        return <div className="text-center p-10 text-white">Carregando leilão ou fila vazia...</div>;
    }

    return (
        <div className="h-[calc(100vh-100px)] grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* --- ÁREA PRINCIPAL (ESQUERDA - 2/3) --- */}
            <div className="xl:col-span-2 flex flex-col gap-6">
                {/* O Controlador Visual (Carta + Timer) */}
                <LiveAuctionController 
                    card={{...currentCard, currentBid, winningClient}} // Passa dados mesclados
                    initialTimer={timer} // O timer visual é controlado pelo hook, mas passamos prop se precisar resetar
                    onBid={finishSale} // Botão "Arrematar" do Controller fecha a venda
                    onNext={nextItem}  // Botão "Pular"
                    onWhatsAppShare={handleWhatsAppShare}
                />

                {/* Controles Extras do Timer (Admin) */}
                <Card className="flex items-center justify-between p-4 bg-[#28193C]">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 font-bold">Controle do Timer:</span>
                        {!isPaused ? (
                            <Button variant="danger" onClick={pauseTimer}>⏸ Pausar</Button>
                        ) : (
                            <Button variant="success" onClick={startTimer}>▶ Continuar</Button>
                        )}
                        <Button variant="secondary" onClick={resetTimer}>↺ Reiniciar</Button>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-gray-500">Item {currentIndex + 1} de {totalItems}</span>
                    </div>
                </Card>
            </div>

            {/* --- SIDEBAR (DIREITA - 1/3) --- */}
            <div className="flex flex-col gap-6 h-full overflow-hidden">
                
                {/* Painel de Lance Manual */}
                <Card className="flex-shrink-0 bg-[#28193C] border-2 border-[#D946EF]/50">
                    <h2 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">
                        Registrar Lance
                    </h2>
                    <form onSubmit={handleRegisterBid} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Valor (R$)"
                                type="number"
                                step="0.50"
                                value={manualBidValue}
                                onChange={e => setManualBidValue(e.target.value)}
                                className="text-2xl font-bold text-green-400"
                            />
                            <Input 
                                label="Cliente"
                                placeholder="Nome..."
                                value={manualClientName}
                                onChange={e => setManualClientName(e.target.value)}
                                list="clients-datalist" // Datalist nativo para autocomplete simples
                            />
                            {/* Datalist para sugestão de clientes */}
                            <datalist id="clients-datalist">
                                {clients.map(c => <option key={c.id} value={c.name} />)}
                            </datalist>
                        </div>
                        <Button type="submit" variant="gradient" className="w-full py-3 text-lg">
                            ✅ Confirmar Lance
                        </Button>
                    </form>
                    
                    {/* Resumo do Lance Atual */}
                    <div className="mt-4 p-3 bg-black/40 rounded-lg text-center">
                        <p className="text-gray-400 text-sm">Vencedor Atual</p>
                        <p className="text-xl font-bold text-[#D946EF]">{winningClient || '---'}</p>
                        <p className="text-2xl font-bold text-green-400">{formatCurrency(currentBid)}</p>
                    </div>
                </Card>

                {/* Histórico de Lances (Scrollável) */}
                <Card className="flex-1 flex flex-col overflow-hidden" noPadding>
                    <div className="p-4 border-b border-white/10 bg-[#28193C]">
                        <h3 className="font-bold text-gray-300">Histórico da Carta</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 space-y-2 custom-scrollbar">
                        {bidHistory.map((bid, i) => (
                            <div key={i} className="flex justify-between items-center p-2 rounded bg-white/5 border-l-4 border-[#D946EF]">
                                <span className="font-bold text-white">{bid.client}</span>
                                <span className="text-green-400 font-mono font-bold">
                                    {formatCurrency(bid.value)}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {bid.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        {bidHistory.length === 0 && (
                            <p className="text-center text-gray-600 mt-10">Nenhum lance registrado ainda.</p>
                        )}
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default LiveAuction;