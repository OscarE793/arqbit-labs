/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Precision Monolith - Stitch Design System
        background: '#00132e',
        surface: '#001a3d',
        'surface-container': '#00214d',
        'surface-container-low': '#001a3d',
        'surface-container-high': '#002a63',
        'surface-container-highest': '#003478',
        'on-background': '#d6e3ff',
        'on-surface': '#d6e3ff',
        'on-surface-variant': '#a9c0e4',
        primary: '#ff6a00',
        'on-primary': '#ffffff',
        'primary-container': '#ffb694',
        secondary: '#a9c0e4',
        outline: '#2a4372',
        'outline-variant': '#1f355c',
        error: '#ffb4ab',
        // Legacy tokens kept to avoid breaking old code while we migrate
        'arq-dark': '#00132e',
        'arq-blue': '#001a3d',
        'arq-sky': '#a9c0e4',
        'arq-orange': '#ff6a00',
        'arq-amber': '#ffb694',
        'arq-yellow': '#ffb694',
      },
      fontFamily: {
        headline: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Manrope', 'sans-serif'],
        // Legacy aliases
        exo: ['"Space Grotesk"', 'sans-serif'],
        rajdhani: ['"Space Grotesk"', 'sans-serif'],
        source: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #ffb694 0%, #ff6a00 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 19, 46, 0.37)',
        'card-hover': '0 20px 60px -15px rgba(255, 106, 0, 0.35)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
};
