// src/contexts/DataContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { db, auth } from '../services/firebase'; // Importa do arquivo criado na Fase 1
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Criação do Contexto
const DataContext = createContext({});

// Hook personalizado para facilitar o uso (ex: const { clients } = useData();)
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Estados para os dados principais
    const [clients, setClients] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [cards, setCards] = useState([]);
    const [payments, setPayments] = useState([]);
    
    // Estado de configurações globais
    const [settings, setSettings] = useState({
        theme: 'light',
        soundsEnabled: true,
        defaultTimer: 60,
        defaultIncrement: 1
    });

    // Função que busca tudo do Firebase (equivalente ao initializeAppLogic antigo)
    const refreshData = async () => {
        try {
            setLoading(true);
            
            // Buscas paralelas para performance
            const [clientsSnap, auctionsSnap, cardsSnap, paymentsSnap, settingsSnap] = await Promise.all([
                getDocs(collection(db, 'clientes')),
                getDocs(collection(db, 'leiloes')), // Idealmente usar query(..., orderBy('date', 'desc')) aqui
                getDocs(collection(db, 'cards')),
                getDocs(query(collection(db, 'pagamentos'), orderBy('createdAt', 'desc'))),
                getDocs(collection(db, 'settings')) // Assume que settings ficam numa coleção
            ]);

            // Processamento dos dados
            setClients(clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            setAuctions(auctionsSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Converte Timestamp do Firebase para Date nativo do JS
                    date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
                };
            }));

            setCards(cardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            setPayments(paymentsSnap.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
                    paymentDate: data.paymentDate?.toDate ? data.paymentDate.toDate() : null,
                    cancellationDate: data.cancellationDate?.toDate ? data.cancellationDate.toDate() : null
                };
            }));

            // Carrega settings se existir doc 'global', senão mantém padrão
            const globalSettings = settingsSnap.docs.find(d => d.id === 'global');
            if (globalSettings) {
                setSettings(prev => ({ ...prev, ...globalSettings.data() }));
            }

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            // Aqui você poderia adicionar um estado de erro para mostrar na UI
        } finally {
            setLoading(false);
        }
    };

    // Monitora autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                refreshData();
            } else {
                setLoading(false);
                // Limpa dados ao deslogar por segurança
                setClients([]);
                setAuctions([]);
                setCards([]);
                setPayments([]);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <DataContext.Provider value={{
            user,
            loading,
            clients,
            auctions,
            cards,
            payments,
            settings,
            refreshData, // Exposta para ser chamada após ações de escrita (criar leilão, etc)
            setSettings
        }}>
            {children}
        </DataContext.Provider>
    );
};