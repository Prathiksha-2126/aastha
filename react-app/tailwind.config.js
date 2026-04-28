/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./src/**/*.js",
    "./src/**/*.jsx"
  ],
  safelist: [
    'bg-primary',
    'bg-secondary',
    'text-white',
    'rounded-xl',
    'p-6',
    'flex',
    'grid',
    'hidden',
    'md:block',
    'lg:flex'
  ],
  theme: {
    extend: {
      colors: {
        primary: "#173124",
        "primary-container": "#2d4739",
        "on-primary": "#ffffff",
        "on-primary-container": "#98b5a3",
        "primary-fixed": "#ccead6",
        "primary-fixed-dim": "#b0cdbb",
        secondary: "#99460a",
        "secondary-container": "#fc9354",
        "on-secondary": "#ffffff",
        "secondary-fixed": "#ffdbca",
        "secondary-fixed-dim": "#ffb68e",
        surface: "#fbf9f6",
        "surface-container": "#f0edea",
        "on-surface": "#1b1c1a",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        outline: "#727973",
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
