/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'phone': { 'max': '480px' }, 
        'tablet': '768px', 
        'laptop': '1024px',
        'desktop': '1280px',
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
}

