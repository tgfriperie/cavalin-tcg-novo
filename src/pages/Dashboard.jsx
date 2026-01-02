import React, { useState, useMemo } from 'react';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useData } from '../contexts/DataContext';
import { calculateFinancialKpis, formatCurrency } from '../utils/financialCalculations';
import Card from '../components/ui/Card';
import { theme } from '../config/theme'; // Criado na Fase 1

// Registra componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { payments, auctions, cards } = useData();
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Recalcula KPIs sempre que os dados ou a data mudam
    const { kpis, dailyData, categoryData } = useMemo(() => {
        return calculateFinancialKpis(payments, auctions, cards, selectedDate);
    }, [payments, auctions, cards, selectedDate]);

    // Dados para o Gráfico de Linha (Desempenho Diário)
    const lineChartData = {
        labels: Object.keys(dailyData),
        datasets: [
            {
                label: 'Faturamento',
                data: Object.values(dailyData).map(d => d.revenue),
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.primary + '33', // Transparência
                tension: 0.4
            },
            {
                label: 'Lucro',
                data: Object.values(dailyData).map(d => d.profit),
                borderColor: theme.colors.success,
                backgroundColor: theme.colors.success + '33',
                tension: 0.4
            }
        ]
    };

    // Dados para o Gráfico de Barras (Categorias)
    const barChartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: 'Lucro por Categoria',
            data: Object.values(categoryData).map(d => d.profit),
            backgroundColor: theme.charts.palette,
        }]
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#D946EF]">Dashboard</h1>
                {/* Aqui você pode adicionar o seletor de mês/ano depois */}
            </div>

            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                    <h3 className="text-[#D8D2E7] mb-2">FATURAMENTO (MÊS)</h3>
                    <p className="text-3xl font-bold text-[#F1F5F9]">{formatCurrency(kpis.revenue)}</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-[#D8D2E7] mb-2">LUCRO (MÊS)</h3>
                    <p className="text-3xl font-bold text-[#34D399]">{formatCurrency(kpis.profit)}</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-[#D8D2E7] mb-2">TICKET MÉDIO</h3>
                    <p className="text-3xl font-bold text-[#F1F5F9]">{formatCurrency(kpis.avgTicket)}</p>
                </Card>
                <Card className="text-center">
                    <h3 className="text-[#D8D2E7] mb-2">CONVERSÃO</h3>
                    <p className="text-3xl font-bold text-[#D946EF]">{kpis.conversionRate}%</p>
                </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 min-h-[300px]">
                    <h3 className="text-xl font-bold text-[#D946EF] mb-4">Evolução Financeira</h3>
                    <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </Card>
                <Card className="min-h-[300px]">
                    <h3 className="text-xl font-bold text-[#D946EF] mb-4">Por Categoria</h3>
                    <Bar data={barChartData} options={{ indexAxis: 'y', responsive: true, maintainAspectRatio: false }} />
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;