/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          dark: '#C8AE7E',
          DEFAULT: '#D2BD96',
          light: '#EAE3C9',
          lighter: '#F8F5DD',
          lightest: '#FAFDF3',
        }
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}