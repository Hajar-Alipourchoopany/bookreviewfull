/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
      'header-bg': "url('.\src\assets\background.jpg')",
    },},
  },
  plugins: [],
}

