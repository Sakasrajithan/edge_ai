/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#060814', // deep space dark
          900: '#0e132b', // dark surface
          850: '#151c3f', // lighter surface
          800: '#1b244f', // borders and lines
          700: '#2c3a75', // secondary borders
          500: '#3b82f6', // primary blue
          400: '#60a5fa', // light blue
          300: '#93c5fd', // hover state blue
        }
      }
    },
  },
  plugins: [],
}
