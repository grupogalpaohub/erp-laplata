/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Fiori Dark Theme Colors
        'fiori': {
          'primary': '#0070f3',
          'primary-hover': '#0051cc',
          'primary-active': '#003d99',
          'bg-primary': '#1a1a1a',
          'bg-secondary': '#2d2d2d',
          'bg-tertiary': '#404040',
          'text-primary': '#ffffff',
          'text-secondary': '#b3b3b3',
          'text-tertiary': '#808080',
          'border-primary': '#404040',
          'border-secondary': '#2d2d2d',
          'success': '#00c851',
          'warning': '#ffbb33',
          'error': '#ff4444',
          'info': '#33b5e5',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
  // Forçar tema escuro por padrão
  corePlugins: {
    preflight: false,
  },
}