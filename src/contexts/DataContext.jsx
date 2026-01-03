import React, { createContext, useState, useEffect, useContext } from 'react';
import { db, auth } from '../services/firebase';
import { 
    collection, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    orderBy, 
    serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const DataContext = createContext({});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [clients, setClients] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [cards, setCards] = useState([]);
    const [payments, setPayments] = useState([]);
    const [settings, setSettings] = useState({});

    const refreshData = async () => {
        if (!user) return;
        try {
            // Buscas paralelas
            const [clientsSnap, auctionsSnap, cardsSnap, paymentsSnap, settingsSnap] = await Promise.all([
                getDocs(collection(db, 'clientes')),
                getDocs(collection(db, 'leiloes')), 
                getDocs(collection(db, 'cards')),
                getDocs(query(collection(db, 'pagamentos'), orderBy('createdAt', 'desc'))),
                getDocs(collection(db, 'settings'))
            ]);

            setClients(clientsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
            
            setAuctions(auctionsSnap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    ...data,
                    date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
                };
            }));

            setCards(cardsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            setPayments(paymentsSnap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
                    paymentDate: data.paymentDate?.toDate ? data.paymentDate.toDate() : null,
                    cancellationDate: data.cancellationDate?.toDate ? data.cancellationDate.toDate() : null
                };
            }));

            const globalSettings = settingsSnap.docs.find(d => d.id === 'global');
            if (globalSettings) setSettings(prev => ({ ...prev, ...globalSettings.data() }));

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    };

    // --- CRUD DE CARTAS ---
    const addCard = async (cardData) => {
        try {
            await addDoc(collection(db, 'cards'), {
                ...cardData,
                status: 'inventory', // Padrão ao criar
                createdAt: serverTimestamp()
            });
            await refreshData(); // Atualiza a lista local
            return true;
        } catch (error) {
            console.error("Erro ao adicionar carta:", error);
            return false;
        }
    };

    const updateCard = async (id, cardData) => {
        try {
            const cardRef = doc(db, 'cards', id);
            await updateDoc(cardRef, cardData);
            await refreshData();
            return true;
        } catch (error) {
            console.error("Erro ao atualizar carta:", error);
            return false;
        }
    };

    const deleteCard = async (id) => {
        try {
            await deleteDoc(doc(db, 'cards', id));
            await refreshData();
            return true;
        } catch (error) {
            console.error("Erro ao excluir carta:", error);
            return false;
        }
    };

    // --- AÇÕES FINANCEIRAS ---
    const updatePaymentStatus = async (paymentId, newStatus) => {
        try {
            const paymentRef = doc(db, 'pagamentos', paymentId);
            
            const updateData = {
                status: newStatus
            };

            // Se for marcar como Pago, grava a data do pagamento
            if (newStatus === 'Pago') {
                updateData.paymentDate = serverTimestamp();
            }
            // Se for cancelar, grava quando foi cancelado (opcional, mas bom para histórico)
            else if (newStatus === 'Cancelado') {
                updateData.cancellationDate = serverTimestamp();
            }

            await updateDoc(paymentRef, updateData);
            await refreshData(); // Atualiza a tabela na hora
            return true;
        } catch (error) {
            console.error("Erro ao atualizar pagamento:", error);
            return false;
        }
    };

    // --- AUTH & INIT ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                refreshData().then(() => setLoading(false));
            } else {
                setLoading(false);
                setClients([]);
                setAuctions([]);
                setCards([]);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <DataContext.Provider value={{
            user, loading,
            clients, auctions, cards, payments, settings,
            refreshData,
            addCard, updateCard, deleteCard,
            updatePaymentStatus // <--- Nova função exportada aqui
        }}>
            {children}
        </DataContext.Provider>
    );
};