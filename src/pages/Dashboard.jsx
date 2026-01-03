import React, { useState, useMemo } from 'react';
import { 
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useData } from '../contexts/DataContext';
import { calculateFinancialKpis, formatCurrency } from '../utils/financialCalculations';
import Card from '../components/ui/Card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { payments, auctions, cards } = useData();
    
    // Filtros de Data (Restaurando funcionalidade original)
    const today = new Date();
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    // Cria data baseada nos selects
    const filterDate = useMemo(() => new Date(selectedYear, selectedMonth, 1), [selectedMonth, selectedYear]);

    // Recalcula KPIs
    const { kpis, dailyData, categoryData } = useMemo(() => {
        return calculateFinancialKpis(payments, auctions, cards, filterDate);
    }, [payments, auctions, cards, filterDate]);

    // Configuração dos Gráficos (Tema Escuro)
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
    };

    const lineData = {
        labels: Object.keys(dailyData),
        datasets: [
            {
                label: 'Faturamento',
                data: Object.values(dailyData).map(d => d.revenue),
                borderColor: '#d946ef',
                backgroundColor: 'rgba(217, 70, 239, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header com Filtros - EXATAMENTE COMO NO ORIGINAL */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Visão geral do desempenho</p>
                </div>
                
                <div className="flex gap-3 bg-[#1A1625] p-1 rounded-lg border border-white/5">
                    <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                        className="bg-transparent text-white px-4 py-2 outline-none cursor-pointer hover:bg-white/5 rounded-md"
                    >
                        {['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'].map((m, i) => (
                            <option key={i} value={i} className="bg-[#130d1e]">{m}</option>
                        ))}
                    </select>
                    <div className="w-[1px] bg-white/10 my-2"></div>
                    <select 
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="bg-transparent text-white px-4 py-2 outline-none cursor-pointer hover:bg-white/5 rounded-md"
                    >
                        {[2023, 2024, 2025, 2026].map(y => (
                            <option key={y} value={y} className="bg-[#130d1e]">{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Faturamento" value={formatCurrency(kpis.revenue)} icon="fa-sack-dollar" color="text-[#d946ef]" />
                <KPICard title="Lucro Líquido" value={formatCurrency(kpis.profit)} icon="fa-chart-line" color="text-[#22c55e]" />
                <KPICard title="Ticket Médio" value={formatCurrency(kpis.avgTicket)} icon="fa-receipt" color="text-blue-400" />
                <KPICard title="Conversão" value={`${kpis.conversionRate}%`} icon="fa-percent" color="text-yellow-400" />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 rounded-2xl h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <i className="fa-solid fa-chart-area text-[#d946ef]"></i> Evolução Diária
                    </h3>
                    <Line data={lineData} options={chartOptions} />
                </div>
                {/* Outro gráfico ou lista aqui */}
                <div className="glass-panel p-6 rounded-2xl h-[400px]">
                    <h3 className="text-lg font-bold text-white mb-6">Categorias</h3>
                    {/* Renderize o gráfico de barras aqui se necessário, igual ao anterior */}
                </div>
            </div>
        </div>
    );
};

// Componente auxiliar local para os Cards
const KPICard = ({ title, value, icon, color }) => (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className="relative z-10">
            <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className={`absolute -right-4 -bottom-4 text-6xl opacity-10 ${color} group-hover:scale-110 transition-transform`}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
    </div>
);

export default Dashboard;