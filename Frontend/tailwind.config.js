/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        handwritten: ['Dancing Script', 'sans-serif'],
      },
      backgroundImage: {
        'header-bg': "url('.srcassets\background.jpg')",
      },
    },
  },
  plugins: [],
};
