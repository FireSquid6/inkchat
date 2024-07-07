/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/**/*.{js,ts,tsx,jsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["dark"]
  }
}

