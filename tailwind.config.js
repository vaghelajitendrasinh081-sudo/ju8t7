/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: {
          DEFAULT: '#FF1E27',
          bright: '#FF2A2A',
          glow: 'rgba(255, 30, 39, 0.4)',
          dim: '#8B0000',
        },
        cyber: {
          black: '#000000',
          dark: '#080808',
          card: '#0D0D0D',
          border: '#1F1F1F',
          borderGlow: 'rgba(255, 30, 39, 0.25)',
          muted: '#8E8E93',
          light: '#E5E5EA',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'crimson-glow': '0 0 25px rgba(255, 30, 39, 0.3)',
        'crimson-glow-lg': '0 0 45px rgba(255, 30, 39, 0.45)',
        'card-glow': '0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 1px rgba(255, 30, 39, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
