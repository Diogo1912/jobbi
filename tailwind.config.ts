import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Clean, vibrant blues
        jobbi: {
          dark: '#1e3a5f',       // Deep blue (sidebar)
          navy: '#2563eb',       // Vibrant blue
          slate: '#3b82f6',      // Bright blue
          muted: '#60a5fa',      // Light blue
          light: '#93c5fd',      // Very light blue
          50: '#eff6ff',         // Almost white blue
        },
        // Grays
        steel: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
        },
        // Accent orange
        accent: {
          light: '#fed7aa',
          DEFAULT: '#f97316',
          hover: '#ea580c',
          dark: '#c2410c',
        },
        // Status colors
        status: {
          saved: '#3b82f6',
          applied: '#f97316',
          interview: '#a855f7',
          accepted: '#22c55e',
          rejected: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 12px -2px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 20px -4px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
