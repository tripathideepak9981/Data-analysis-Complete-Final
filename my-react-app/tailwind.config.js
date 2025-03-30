import { keyframes } from 'framer-motion';
import scrollbarHide from 'tailwind-scrollbar-hide';
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounceSlow 1s infinite ease-in-out'
      },
      keyframes:{
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.5rem)' },
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'], // Add Poppins font
      },
      screens: {
        'xs': '480px', // Custom breakpoint
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    scrollbarHide
  ]
};