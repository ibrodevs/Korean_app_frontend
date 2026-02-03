/** @type {import('tailwindcss').Config} */

module.exports = {
  // ВАЖНО: добавляем NativeWind preset для v5
  presets: [require('nativewind/preset')],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        primary: '#1774F3',
        error: '#DC2626',
        success: '#059669',
        warning: '#D97706',
        secondary: '#475569',
        heading: '#0F172A',
        background: '#1774F3',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};