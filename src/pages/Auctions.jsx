import React from 'react';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Auctions = () => {
    const { auctions } = useData();

    const getStatusColor = (status) => {
        switch(status) {
            case 'Finalizado': return 'bg-[#F43F5E]';
            case 'Em Andamento': return 'bg-yellow-500';
            default: return 'bg-[#34D399]';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#D946EF]">Leilões</h1>
                <Button variant="primary">Criar Novo Leilão</Button>
            </div>

            <Card noPadding>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#D946EF]/30 text-[#D8D2E7]">
                            <th className="p-4">Nome</th>
                            <th className="p-4">Data</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {auctions.map(auction => (
                            <tr key={auction.id} className="hover:bg-white/5">
                                <td className="p-4 text-white font-medium">{auction.name}</td>
                                <td className="p-4 text-gray-400">
                                    {new Date(auction.date).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(auction.status)}`}>
                                        {auction.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Button variant="secondary" className="px-3 py-1 text-sm">Gerenciar</Button>
                                    <Button variant="danger" className="px-3 py-1 text-sm">Excluir</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Auctions;