/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'arq-dark': '#0B1F3A',
        'arq-blue': '#0D47A1',
        'arq-sky': '#1E88E5',
        'arq-orange': '#FF6A00',
        'arq-amber': '#FF8F00',
        'arq-yellow': '#FFC107',
      },
      fontFamily: {
        'exo': ['"Exo 2"', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'source': ['"Source Sans 3"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
