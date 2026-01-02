import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import FinancialTable from '../components/business/FinancialTable';
import Card from '../components/ui/Card';

const Financial = () => {
    const { payments, clients } = useData();
    const [view, setView] = useState('pending'); // 'pending', 'history', 'clients'

    // Lógica simples de filtro (pode ser expandida para usar Datas)
    const pendingPayments = payments.filter(p => p.status === 'Pendente').map(p => ({
        ...p,
        clientName: clients.find(c => c.id === p.clientId)?.name || 'Desconhecido'
    }));

    const historyPayments = payments.filter(p => p.status === 'Pago').map(p => ({
        ...p,
        clientName: clients.find(c => c.id === p.clientId)?.name || 'Desconhecido'
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#D946EF]">Financeiro</h1>

            <div className="flex space-x-2 bg-[#28193C] p-1 rounded-lg w-fit">
                {['pending', 'history', 'clients'].map(v => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className={`px-4 py-2 rounded-md font-bold capitalize ${
                            view === v ? 'bg-[#D946EF] text-[#1A1129]' : 'text-[#D8D2E7]'
                        }`}
                    >
                        {v === 'pending' ? 'Pendências' : v === 'history' ? 'Histórico' : 'Clientes'}
                    </button>
                ))}
            </div>

            <Card noPadding>
                {view === 'pending' && (
                    <FinancialTable 
                        data={pendingPayments} 
                        type="pending" 
                        onAction={(action, item) => console.log(action, item)} 
                    />
                )}
                {view === 'history' && (
                    <FinancialTable 
                        data={historyPayments} 
                        type="history" 
                    />
                )}
                {/* Implementar view de Clientes conforme necessário */}
            </Card>
        </div>
    );
};

export default Financial;