/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fef7f5',
          100: '#fdede9',
          200: '#fbd3c8',
          300: '#f7aa95',
          400: '#f17e5f',
          500: '#E07A5F', // Primary Brand Color
          600: '#ca6e56',
          700: '#a85c47',
          800: '#864939',
          900: '#6e3c2f'
        },
        secondary: {
          50: '#f2f8fb',
          100: '#e1eff6',
          200: '#bad9e9',
          300: '#86bad5',
          400: '#4c92b9',
          500: '#206691', // Secondary Brand Color
          600: '#1a5274',
          700: '#154461',
          800: '#11364d',
          900: '#0e2c3f'
        }
      }
    }
  },
  plugins: []
};
