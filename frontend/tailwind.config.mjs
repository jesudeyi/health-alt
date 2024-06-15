/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        sulphurPoint: ['"Sulphur Point"', 'sans-serif'],
        pacifico: ['Pacifico', 'cursive']
      }
    }
  },
  plugins: []
}
