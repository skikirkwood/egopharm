/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        quanata: {
          dark: '#0d1b2a',
          navy: '#1b263b',
          slate: '#415a77',
          accent: '#00d4aa',
          'accent-light': '#00f5c4',
          light: '#e0e1dd',
          magenta: '#e91e8c',
          'magenta-light': '#f54da6',
        },
      },
    },
  },
  plugins: [],
}

