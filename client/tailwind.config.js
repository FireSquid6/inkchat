/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "client/**/*.{vue,js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["forest"]
  },
  plugins: [
    require("daisyui")
  ],
}

