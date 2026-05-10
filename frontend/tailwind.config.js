/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#121212',
        border: '#2a2a2a',
        primary: '#00ffcc', // Cyberpunk neon cyan
        error: '#ff3366',
        success: '#00cc66',
        textMain: '#ffffff',
        textMuted: '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
