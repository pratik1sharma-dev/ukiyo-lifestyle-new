/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#fdf2f8',
          500: '#ec4899',
          600: '#db2777',
        }
      },
      fontFamily: {
        'cormorant': ['Cormorant Garamond', 'serif'],
      }
    },
  },
  plugins: [],
}