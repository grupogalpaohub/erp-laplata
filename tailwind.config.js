/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'fiori-bg': '#0b253a',       // fundo app (dark blue)
        'fiori-surface': '#122b45',  // cards/tiles
        'fiori-border': '#1c3b5a',
        'fiori-text': '#dfe8f1',
        'fiori-muted': '#9fb6ca',
        'fiori-accent': '#0a6ed1',   // azul SAP
        'fiori-kpi-good': '#2ecc71',
        'fiori-kpi-warn': '#f1c40f',
        'fiori-kpi-bad': '#e74c3c'
      },
      boxShadow: {
        fiori: '0 2px 8px rgba(0,0,0,0.25)'
      },
      borderRadius: {
        xl2: '1rem'
      }
    },
  },
  plugins: [],
}