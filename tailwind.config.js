/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores extraídas do seu index (1).html original
        background: '#1A1129', // Fundo principal escuro
        surface: '#2D1B4E',    // Cor dos cards/sidebar (Roxo mais claro)
        primary: '#D946EF',    // Rosa/Roxo vibrante dos botões e destaques
        secondary: '#64748B',  // Cinza para textos secundários
        success: '#22C55E',    // Verde
        danger: '#EF4444',     // Vermelho
        text: '#F1F5F9',       // Texto claro
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Fonte original
      }
    },
  },
  plugins: [],
}