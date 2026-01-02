// src/config/theme.js

export const theme = {
    colors: {
        // Cores base (Backgrounds)
        bgMain: '#1A1129',
        panelBg: 'rgba(40, 25, 60, 0.5)',
        panelBorder: 'rgba(217, 70, 239, 0.2)',
        inputBg: 'rgba(0, 0, 0, 0.2)',
        modalBackdrop: 'rgba(26, 17, 41, 0.8)',

        // Acentos (Accents)
        primary: '#D946EF',   // Fuchsia-500
        secondary: '#A21CAF', // Fuchsia-700
        danger: '#F43F5E',    // Rose-500
        success: '#34D399',   // Green-400
        whatsapp: '#25D366',  // Brand Color

        // Texto
        textLight: '#F1F5F9',
        textMedium: '#D8D2E7',
        textDark: '#A09CB0',
        textContrast: '#1F2937'
    },
    
    // Configuração para gráficos (Chart.js)
    charts: {
        palette: ['#D946EF', '#A21CAF', '#34D399', '#FBBF24', '#F43F5E']
    }
};

// Função auxiliar para gerar gradientes se necessário via JS
export const getGradient = (ctx, colorStart, colorEnd) => {
    // Implementação futura para gráficos
    return null; 
};