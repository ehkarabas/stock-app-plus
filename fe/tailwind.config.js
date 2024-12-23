/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",

    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        firaCode: ["'Fira Code', monospace"],
      },
      screens: {
        lowest: "300px",
        mobile: "400px",
      },
    },
  },
  plugins: [],
};
