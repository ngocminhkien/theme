/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: '#172033',
        navy: '#111a2e',
        brand: { 50: '#eef4ff', 100: '#d9e8ff', 500: '#2563eb', 600: '#1d4ed8', 700: '#1d3ea8' },
      },
      boxShadow: { panel: '0 12px 32px rgba(15, 23, 42, 0.07)' },
    },
  },
  plugins: [],
};
