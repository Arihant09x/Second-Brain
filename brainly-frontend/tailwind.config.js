/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#000000",
          surface: "#111111",
          border: "#333333",
          text: "#ffffff",
          "text-secondary": "#a0a0a0",
        },
      },
    },
  },
  plugins: [],
};
