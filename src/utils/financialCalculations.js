// src/utils/financialCalculations.js

/**
 * Calcula os KPIs financeiros baseados nos pagamentos e leilões do mês selecionado.
 * @param {Array} payments - Lista de todos os pagamentos (vindos do Firestore)
 * @param {Array} auctions - Lista de leilões
 * @param {Array} cards - Lista de cartas (necessário para calcular custo/lucro por categoria)
 * @param {Date} selectedDate - Data selecionada no filtro (mês/ano)
 */
export const calculateFinancialKpis = (payments, auctions, cards, selectedDate) => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    // 1. Filtrar pagamentos PAGOS no mês selecionado
    const paymentsInMonth = payments.filter(p => {
        // Garante que é um objeto Date válido (Firebase Timestamp convertido)
        const pDate = p.paymentDate instanceof Date ? p.paymentDate : new Date(p.paymentDate);
        return p.status === 'Pago' && 
               pDate.getMonth() === selectedMonth && 
               pDate.getFullYear() === selectedYear;
    });

    // 2. Filtrar leilões FINALIZADOS no mês selecionado
    const auctionsInMonth = auctions.filter(a => {
        const aDate = a.date instanceof Date ? a.date : new Date(a.date);
        return a.status === 'Finalizado' && 
               aDate.getMonth() === selectedMonth && 
               aDate.getFullYear() === selectedYear;
    });

    let totalRevenue = 0;
    let totalCost = 0;
    const uniqueClients = new Set();
    const dailyData = {};
    const categoryData = {};

    // 3. Processar Pagamentos (Receita, Lucro e Dados Diários)
    paymentsInMonth.forEach(p => {
        totalRevenue += (p.amount || 0);
        totalCost += (p.totalCost || 0);
        if (p.clientId) uniqueClients.add(p.clientId);

        const pDate = p.paymentDate instanceof Date ? p.paymentDate : new Date(p.paymentDate);
        const day = pDate.getDate();

        if (!dailyData[day]) {
            dailyData[day] = { revenue: 0, profit: 0 };
        }
        dailyData[day].revenue += p.amount;
        dailyData[day].profit += (p.amount - (p.totalCost || 0));
    });

    // 4. Processar Leilões (Conversão e Categorias)
    // Nota: winningBids e cardIds devem ser arrays, protegemos com ?. e || []
    const totalSoldItems = auctionsInMonth.reduce((sum, a) => sum + (a.winningBids?.length || 0), 0);
    const totalOfferedItems = auctionsInMonth.reduce((sum, a) => sum + (a.cardIds?.length || 0), 0);

    auctionsInMonth.forEach(auction => {
        (auction.winningBids || []).forEach(bid => {
            const card = cards.find(c => c.id === bid.cardId);
            
            if (card) {
                const category = card.category || 'Outros';
                
                if (!categoryData[category]) {
                    categoryData[category] = { revenue: 0, profit: 0 };
                }
                
                const finalValue = bid.finalValue || 0;
                const cost = card.cost || 0;
                
                categoryData[category].revenue += finalValue;
                categoryData[category].profit += (finalValue - cost);
            }
        });
    });

    return {
        kpis: {
            revenue: totalRevenue,
            profit: totalRevenue - totalCost,
            avgTicket: uniqueClients.size > 0 ? totalRevenue / uniqueClients.size : 0,
            conversionRate: totalOfferedItems > 0 ? ((totalSoldItems / totalOfferedItems) * 100).toFixed(0) : 0,
        },
        dailyData,
        categoryData
    };
};

/**
 * Formata valor monetário para BRL
 */
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
};