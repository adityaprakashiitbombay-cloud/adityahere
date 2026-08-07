/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-green': '#39FF14',
        'neon-cyan': '#00E5FF',
        'neon-pink': '#FF007F',
        'neon-yellow': '#FFE600',
        'dark-bg': '#050505',
        'dark-card': '#111111',
        'dark-card-hover': '#181818',
        'dark-border': '#ffffff',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', '"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'brutal': '5px 5px 0px 0px #39FF14',
        'brutal-hover': '8px 8px 0px 0px #39FF14',
        'brutal-white': '5px 5px 0px 0px #ffffff',
        'brutal-white-hover': '8px 8px 0px 0px #ffffff',
        'brutal-cyan': '5px 5px 0px 0px #00E5FF',
        'brutal-pink': '5px 5px 0px 0px #FF007F',
        'brutal-inset': 'inset 3px 3px 0px 0px #39FF14',
      },
      animation: {
        'blink': 'blink 1s step-start infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
