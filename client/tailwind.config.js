/** @type {import('tailwindcss').Config} */
module.exports = 
{
  theme: {
    extend: {},
    screens: {
      xs: "500px",
      ...require("tailwindcss/defaultTheme").screens,
    },
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [],
}

