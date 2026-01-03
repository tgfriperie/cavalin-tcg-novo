import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // Importante para os gráficos funcionarem

// Componente de Card de Estatística (Visual Original)
const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-surface p-6 rounded-2xl border border-white/5 shadow-lg hover:border-white/10 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-opacity-20 ${colorClass.replace('text-', 'bg-')} group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fa-solid ${icon} text-xl ${colorClass}`}></i>
            </div>
            {/* Pill de variação (mockup por enquanto) */}
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400">
                +4.5%
            </span>
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);

const Dashboard = () => {
    const { clients, auctions, cards, payments } = useData();

    // Cálculos Simples (Você pode expandir isso depois)
    const kpis = useMemo(() => {
        const totalRevenue = payments
            .filter(p => p.status === 'Pago')
            .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        
        return {
            totalClients: clients.length,
            activeAuctions: auctions.filter(a => a.status === 'active').length,
            totalItems: cards.length,
            revenue: totalRevenue
        };
    }, [clients, auctions, cards, payments]);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                    <p className="text-gray-400 mt-1">Visão geral da sua loja</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-surface border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
                        <i className="fa-solid fa-download mr-2"></i> Relatório
                    </button>
                    <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-medium shadow-lg shadow-primary/25 transition-all">
                        <i className="fa-solid fa-plus mr-2"></i> Novo Leilão
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Receita Total" 
                    value={`R$ ${kpis.revenue.toFixed(2)}`} 
                    icon="fa-dollar-sign" 
                    colorClass="text-green-400" 
                />
                <StatCard 
                    title="Leilões Ativos" 
                    value={kpis.activeAuctions} 
                    icon="fa-gavel" 
                    colorClass="text-primary" 
                />
                <StatCard 
                    title="Total de Cartas" 
                    value={kpis.totalItems} 
                    icon="fa-layer-group" 
                    colorClass="text-blue-400" 
                />
                <StatCard 
                    title="Clientes" 
                    value={kpis.totalClients} 
                    icon="fa-users" 
                    colorClass="text-purple-400" 
                />
            </div>

            {/* Aqui virão os gráficos (Placeholder para manter igual ao original) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-surface p-6 rounded-2xl border border-white/5 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Receita Mensal</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500 bg-black/20 rounded-xl border border-white/5 border-dashed">
                        {/* Gráfico viria aqui */}
                        <p>Gráfico de Receita em Construção</p>
                    </div>
                </div>
                
                <div className="bg-surface p-6 rounded-2xl border border-white/5 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-6">Status de Pagamentos</h3>
                    <div className="h-64 flex items-center justify-center text-gray-500 bg-black/20 rounded-xl border border-white/5 border-dashed">
                        {/* Donut Chart viria aqui */}
                        <p>Gráfico Circular em Construção</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;