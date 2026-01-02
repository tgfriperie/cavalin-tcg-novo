// src/config/store.js

export const storeConfig = {
    appName: "CAVALLIN TCG",
    currency: "BRL",
    
    // Define quem são os donos de estoque (permite adicionar mais no futuro)
    inventoryOwners: [
        { id: 'Rafael', label: 'Estoque Rafael', color: 'blue' },
        { id: 'Lucas', label: 'Estoque Lucas', color: 'purple' }
    ],

    // Categorias de cartas extraídas do código original
    categories: [
        'Slab/Graded', 
        'Selo', 
        'Vintage', 
        'Moderno', 
        'Lote', 
        'Outros'
    ],

    // Condições de cartas
    conditions: [
        'M (Mint)', 
        'NM (Near Mint)', 
        'SP (Slightly Played)', 
        'MP (Moderately Played)', 
        'HP (Heavily Played)', 
        'D (Damaged)'
    ],

    // Configurações padrão para novos leilões
    auctionDefaults: {
        timerSeconds: 60,
        minIncrement: 1.00,
        initialValue: 0.00
    },

    // Template padrão de mensagem (copiado do seu settings)
    whatsappTemplate: `⚫ Identificação: [Nome da Carta] ([Numeração da Carta])
🧐 Condição: [Condição]
💰 Valor Liga: R$ [Valor de Mercado]
🇯🇵 Idioma: [Idioma]
🤑 Valor inicial: R$ [Valor Inicial]
📈 Incremento mínimo: R$ [Incremento Mínimo]`
};