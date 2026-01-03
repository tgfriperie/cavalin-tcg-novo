import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import FinancialTable from '../components/business/FinancialTable';
import Card from '../components/ui/Card';
import { formatCurrency } from '../utils/financialCalculations';

const Financial = () => {
    const { payments, clients, updatePaymentStatus } = useData(); // <--- Importou a função nova
    const [view, setView] = useState('pending'); // 'pending', 'history'

    // Prepara os dados adicionando o nome do cliente (Join manual)
    const enrichedPayments = payments.map(p => ({
        ...p,
        clientName: clients.find(c => c.id === p.clientId)?.name || 'Cliente Desconhecido'
    }));

    // Filtros
    const pendingPayments = enrichedPayments.filter(p => p.status === 'Pendente');
    const historyPayments = enrichedPayments.filter(p => p.status !== 'Pendente');

    // --- Lógica dos Botões ---
    const handleAction = async (action, item) => {
        if (!item || !item.id) return;

        let confirmMessage = "";
        let newStatus = "";

        if (action === 'pay') {
            confirmMessage = `Confirmar o pagamento de ${formatCurrency(item.amount)} para ${item.clientName}?`;
            newStatus = 'Pago';
        } else if (action === 'cancel') {
            confirmMessage = `Tem certeza que deseja CANCELAR esta cobrança de ${item.clientName}?`;
            newStatus = 'Cancelado';
        }

        if (window.confirm(confirmMessage)) {
            const success = await updatePaymentStatus(item.id, newStatus);
            if (success) {
                // Sucesso: O refreshData do contexto já vai atualizar a tela
                // Se quiser, pode colocar um toast/notificação aqui
            } else {
                alert("Erro ao atualizar o pagamento. Tente novamente.");
            }
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#D946EF]">Financeiro</h1>
                
                {/* Resumo Rápido */}
                <div className="text-right text-sm">
                    <p className="text-gray-400">Total Pendente</p>
                    <p className="text-xl font-bold text-[#F43F5E]">
                        {formatCurrency(pendingPayments.reduce((acc, p) => acc + (p.amount || 0), 0))}
                    </p>
                </div>
            </div>

            {/* Abas de Navegação */}
            <div className="flex space-x-2 bg-[#28193C] p-1 rounded-lg w-fit">
                <button
                    onClick={() => setView('pending')}
                    className={`px-4 py-2 rounded-md font-bold transition-all ${
                        view === 'pending' ? 'bg-[#D946EF] text-[#1A1129]' : 'text-[#D8D2E7] hover:bg-white/5'
                    }`}
                >
                    Pendências ({pendingPayments.length})
                </button>
                <button
                    onClick={() => setView('history')}
                    className={`px-4 py-2 rounded-md font-bold transition-all ${
                        view === 'history' ? 'bg-[#D946EF] text-[#1A1129]' : 'text-[#D8D2E7] hover:bg-white/5'
                    }`}
                >
                    Histórico
                </button>
            </div>

            {/* Tabela */}
            <Card className="flex-1 overflow-hidden flex flex-col" noPadding>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {view === 'pending' ? (
                        <FinancialTable 
                            data={pendingPayments} 
                            type="pending" 
                            onAction={handleAction} // <--- Passando a função conectada
                        />
                    ) : (
                        <FinancialTable 
                            data={historyPayments} 
                            type="history" 
                            // Histórico geralmente não tem ações, ou apenas "ver detalhes"
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Financial;