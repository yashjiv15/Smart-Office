/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Adjust the paths according to your project structure
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-left': {
          '0%': { opacity: '0', transform: 'translateX(-200px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-right': {
          '0%': { opacity: '0', transform: 'translateX(200px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-left': 'fade-left 1.5s ease-in-out',
        'fade-right': 'fade-right 1.5s ease-in-out',
      },
      fontFamily: {
        merriweather: ['Merriweather', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  safelist: ['animate-fade-left', 'animate-fade-right'],
}