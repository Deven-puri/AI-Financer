/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        secondary: {
          50: '#e6fffb',
          100: '#b5f5ec',
          200: '#87e8de',
          300: '#5cdbd3',
          400: '#36cfc9',
          500: '#13c2c2',
          600: '#08979c',
          700: '#006d75',
          800: '#00474f',
          900: '#002329',
        },
        gradient: {
          start: '#1890ff', // Blue
          middle: '#13c2c2', // Teal
          end: '#52c41a', // Green
        },
      },
      backgroundImage: {
        'gradient-ai': 'linear-gradient(to right, #1890ff, #13c2c2, #52c41a)',
        'gradient-ai-vertical': 'linear-gradient(to bottom, #1890ff, #13c2c2, #52c41a)',
        'gradient-ai-diagonal': 'linear-gradient(135deg, #1890ff, #13c2c2, #52c41a)',
      },
    },
  },
  plugins: [],
};
