import React from 'react';
import { formatCurrency } from '../../utils/financialCalculations';
import Button from '../ui/Button';

const FinancialTable = ({ data, type, onAction }) => {
    
    // Headers baseados no tipo de visualização
    const headers = {
        pending: ['Cliente', 'Leilão', 'Valor', 'Data', 'Ações'],
        history: ['Cliente', 'Valor Pago', 'Lucro Real', 'Data Pgto', 'Status'],
        clients: ['Cliente', 'Pendente', 'Pago', 'Total LTV', 'Ações']
    };

    const currentHeaders = headers[type] || headers.pending;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-[#D946EF]/30">
                        {currentHeaders.map((h, i) => (
                            <th key={i} className="p-4 text-[#D8D2E7] font-bold text-lg">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={currentHeaders.length} className="p-8 text-center text-gray-500">
                                Nenhum registro encontrado.
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => (
                            <tr key={item.id || index} className="hover:bg-white/5 transition-colors">
                                {/* Exemplo de renderização condicional baseada no tipo */}
                                
                                {type === 'pending' && (
                                    <>
                                        <td className="p-4 text-white font-medium">{item.clientName}</td>
                                        <td className="p-4 text-gray-400">{item.auctionName}</td>
                                        <td className="p-4 text-green-400 font-bold">{formatCurrency(item.amount)}</td>
                                        <td className="p-4 text-gray-400">{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                                        <td className="p-4 space-x-2">
                                            <Button variant="primary" className="text-xs px-3 py-1" onClick={() => onAction('pay', item)}>
                                                Pagar
                                            </Button>
                                            <Button variant="danger" className="text-xs px-3 py-1" onClick={() => onAction('cancel', item)}>
                                                Cancelar
                                            </Button>
                                        </td>
                                    </>
                                )}
                                
                                {/* Outros tipos (history, clients) seguiriam lógica similar aqui */}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FinancialTable;