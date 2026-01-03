/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#130d1e', // Cor correta
        primary: '#d946ef',
        secondary: '#94a3b8',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)',
        'gradient-glass': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      }
    },
  },
  plugins: [],
}