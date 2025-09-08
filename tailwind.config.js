/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          heading: ['var(--font-poppins)', 'sans-serif'],
          body: ['var(--font-noto-serif)', 'serif'],
        },
        colors: {
          'zinc-950': '#0C0C0D',
          'zinc-900': '#131315',
          'zinc-800': '#27272A',
          'zinc-300': '#D4D4D8',
          'zinc-400': '#A1A1AA',
          'zinc-500': '#71717A',
        },
        animation: {
          'background-shine': 'background-shine 5s linear infinite',
        },
        keyframes: {
          'background-shine': {
            'from': { backgroundPosition: '0 0' },
            'to': { backgroundPosition: '-200% 0' },
          },
        },
      },
    },
    plugins: [],
  }