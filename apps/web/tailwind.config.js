/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#bcdbff',
          300: '#8ec4ff',
          400: '#59a2ff',
          500: '#307eff',
          600: '#1b5ff6',
          700: '#1348e3',
          800: '#163bb7',
          900: '#173690',
          950: '#122257',
        },
      },
    },
  },
  plugins: [],
}

