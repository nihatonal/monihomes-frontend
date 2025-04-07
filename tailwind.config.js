/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      backgroundImage: {
        'danger-gradient': "linear-gradient(-45deg, var(--color_danger) 0% 50%, #fff 50% 100%)",
      },
      colors: {
        tiktok: '#69C9D0',
      },
    },
  },

  plugins: [],
}

