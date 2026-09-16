/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
        },
        care: {
          blue: '#2563eb',
          softblue: '#eff6ff',
          teal: '#0d9488',
          softgreen: '#f0fdf4',
          lavender: '#f5f3ff',
          lavenderDark: '#7c3aed',
          warmorange: '#ea580c',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
