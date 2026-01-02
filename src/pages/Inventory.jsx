import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { storeConfig } from '../config/store'; // Nomes dos donos
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { formatCurrency } from '../utils/financialCalculations';

const Inventory = () => {
    const { cards } = useData();
    const [activeOwner, setActiveOwner] = useState(storeConfig.inventoryOwners[0].id); // 'Rafael' default
    const [searchTerm, setSearchTerm] = useState('');

    // Filtra items: Apenas Status 'inventory', Dono atual e Busca
    const filteredItems = cards.filter(card => 
        card.status === 'inventory' &&
        card.stockOwner === activeOwner &&
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCost = filteredItems.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#D946EF]">Estoque</h1>
                    <p className="text-gray-400">Total em custo: <span className="text-[#F43F5E] font-bold">{formatCurrency(totalCost)}</span></p>
                </div>
                <Button variant="gradient">Novo Item</Button>
            </div>

            {/* Abas */}
            <div className="flex space-x-2 bg-[#28193C] p-1 rounded-lg w-fit">
                {storeConfig.inventoryOwners.map(owner => (
                    <button
                        key={owner.id}
                        onClick={() => setActiveOwner(owner.id)}
                        className={`px-4 py-2 rounded-md font-bold transition-colors ${
                            activeOwner === owner.id 
                            ? 'bg-[#D946EF] text-[#1A1129]' 
                            : 'text-[#D8D2E7] hover:bg-white/5'
                        }`}
                    >
                        Estoque {owner.name || owner.id}
                    </button>
                ))}
            </div>

            {/* Busca */}
            <Input 
                placeholder={`Buscar no estoque de ${activeOwner}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Tabela */}
            <Card noPadding>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#D946EF]/30 text-[#D8D2E7]">
                            <th className="p-4">Item</th>
                            <th className="p-4">Custo</th>
                            <th className="p-4">Categoria</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredItems.map(item => (
                            <tr key={item.id} className="hover:bg-white/5">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={item.img} alt="" className="w-10 h-14 object-cover rounded bg-black/50"/>
                                    <div>
                                        <p className="font-bold text-[#F1F5F9]">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.collection}</p>
                                    </div>
                                </td>
                                <td className="p-4 text-[#F43F5E] font-bold">{formatCurrency(item.cost)}</td>
                                <td className="p-4 text-gray-400">{item.category}</td>
                                <td className="p-4 text-right space-x-2">
                                    <Button variant="secondary" className="px-3 py-1 text-sm">Editar</Button>
                                    <Button variant="danger" className="px-3 py-1 text-sm">Excluir</Button>
                                </td>
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">Nenhum item encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Inventory;