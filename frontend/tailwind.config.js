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
        relic: {
          dark: '#08090e',
          charcoal: '#0d1017',
          panel: '#131722',
          card: '#1a1f2e',
          border: '#242b3d',
          gold: '#f59e0b',
          goldGlow: '#fbbf24',
          cyan: '#06b6d4',
          cyanGlow: '#22d3ee',
          purple: '#8b5cf6',
          purpleGlow: '#a78bfa',
          crimson: '#f43f5e',
          emerald: '#10b981',
          muted: '#8e9bb0'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cinematic: ['Cinzel', 'Trajan Pro', 'serif']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        glow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.7))' }
        }
      }
    },
  },
  plugins: [],
}
