import { useState, useEffect, useRef, useCallback } from 'react';
import { useData } from '../contexts/DataContext';
import { db } from '../services/firebase';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storeConfig } from '../config/store';

const useLiveAuction = (auctionId) => {
    const { auctions, cards, settings, refreshData } = useData();
    
    // --- Estados Locais ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timer, setTimer] = useState(settings.defaultTimer || 60);
    const [isPaused, setIsPaused] = useState(true);
    const [currentBid, setCurrentBid] = useState(0);
    const [winningClient, setWinningClient] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);

    // Refs para controle do intervalo (evita problemas de closure)
    const timerInterval = useRef(null);

    // --- Dados Derivados ---
    const auction = auctions.find(a => a.id === auctionId);
    
    // Reconstrói a fila de objetos de carta baseada nos IDs salvos no leilão
    const queue = (auction?.cardIds || []).map(id => 
        cards.find(c => c.id === id)
    ).filter(Boolean);

    const currentCard = queue[currentIndex] || null;

    // --- Efeitos ---

    // 1. Resetar estados quando mudar de carta
    useEffect(() => {
        if (currentCard) {
            setTimer(settings.defaultTimer || 60);
            setIsPaused(true); // Começa pausado para o admin dar o "Play"
            setCurrentBid(currentCard.currentBid || currentCard.initialValue || 0);
            setWinningClient(currentCard.winningClient || null);
            setBidHistory([]); // Limpa histórico visual
        }
    }, [currentCard, settings.defaultTimer]);

    // 2. Lógica do Cronômetro (Engine)
    useEffect(() => {
        if (!isPaused && timer > 0) {
            timerInterval.current = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            // Tempo acabou! (Aqui você pode disparar som de "Dou-lhe uma...")
            clearInterval(timerInterval.current);
        }

        return () => clearInterval(timerInterval.current);
    }, [isPaused, timer]);

    // --- Ações (Handlers) ---

    const startTimer = () => setIsPaused(false);
    const pauseTimer = () => setIsPaused(true);
    const resetTimer = () => {
        setTimer(settings.defaultTimer || 60);
        setIsPaused(true);
    };

    // Navegação
    const nextItem = () => {
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevItem = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Registrar Lance
    const registerBid = async (value, clientName) => {
        if (!currentCard) return;

        // 1. Atualizações Otimistas (UI instantânea)
        const newBid = Number(value);
        setCurrentBid(newBid);
        setWinningClient(clientName);
        setTimer(settings.defaultTimer || 60); // Reseta o timer (Regra de negócio clássica)
        setIsPaused(false); // Garante que o timer esteja rodando
        
        setBidHistory(prev => [{ value: newBid, client: clientName, time: new Date() }, ...prev]);

        // 2. Persistência no Firebase
        try {
            // Atualiza a carta com o lance atual (para persistir se der refresh)
            const cardRef = doc(db, 'cards', currentCard.id);
            await updateDoc(cardRef, {
                currentBid: newBid,
                winningClient: clientName,
                lastBidTime: serverTimestamp()
            });

            // Opcional: Salvar histórico de lances numa subcoleção do leilão
            await addDoc(collection(db, `leiloes/${auctionId}/bids`), {
                cardId: currentCard.id,
                cardName: currentCard.name,
                value: newBid,
                client: clientName,
                timestamp: serverTimestamp()
            });

        } catch (error) {
            console.error("Erro ao registrar lance no banco:", error);
            // Em app real, aqui faríamos um rollback do estado local
        }
    };

    // Finalizar Venda (Arrematar)
    const finishSale = async () => {
        if (!currentCard || !winningClient) return;

        try {
            const cardRef = doc(db, 'cards', currentCard.id);
            // Marca como vendido e sai do inventário
            await updateDoc(cardRef, {
                status: 'sold',
                soldAt: serverTimestamp(),
                soldInAuctionId: auctionId,
                finalValue: currentBid,
                buyer: winningClient
            });

            // Opcional: Atualizar array de vencedores no documento do leilão
            // ...

            // Vai para o próximo
            await refreshData();
            nextItem();

        } catch (error) {
            console.error("Erro ao finalizar venda:", error);
        }
    };

    // Gerador de Mensagem WhatsApp
    const generateWhatsAppMessage = () => {
        if (!currentCard) return '';

        let template = storeConfig.whatsappTemplate || "";
        
        // Mapa de substituição
        const replacements = {
            '[Nome da Carta]': currentCard.name,
            '[Numeração da Carta]': currentCard.collection || '',
            '[Condição]': currentCard.condition || '',
            '[Valor de Mercado]': currentCard.marketValue ? Number(currentCard.marketValue).toFixed(2) : '---',
            '[Idioma]': currentCard.language || '',
            '[Valor Inicial]': Number(currentCard.initialValue).toFixed(2),
            '[Incremento Mínimo]': settings.defaultIncrement || '1.00',
            '[Lance Atual]': currentBid.toFixed(2),
            '[Vencedor Atual]': winningClient || 'Ninguém'
        };

        // Substitui todas as chaves
        Object.keys(replacements).forEach(key => {
            template = template.split(key).join(replacements[key]);
        });

        return encodeURIComponent(template);
    };

    return {
        // Estado
        currentCard,
        currentIndex,
        totalItems: queue.length,
        timer,
        isPaused,
        currentBid,
        winningClient,
        bidHistory,

        // Ações
        startTimer,
        pauseTimer,
        resetTimer,
        nextItem,
        prevItem,
        registerBid,
        finishSale,
        generateWhatsAppMessage
    };
};

export default useLiveAuction;