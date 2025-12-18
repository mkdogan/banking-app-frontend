/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#2bee79",
        "primary-dark": "#1fa855",
        "background-light": "#f6f8f7",
        "background-dark": "#102217",
        "surface-dark": "#1c3226",
        "surface-highlight": "#234832",
        "border-dark": "#326747",
        "text-secondary": "#92c9a8",
      },
      fontFamily: {
        "display": ["Spline Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "1.5rem",
        "xl": "2rem",
        "2xl": "3rem",
        "full": "9999px"
      },
      boxShadow: {
        "glow": "0 0 40px -10px rgba(43, 238, 121, 0.15)"
      }
    },
  },
  plugins: [],
}

