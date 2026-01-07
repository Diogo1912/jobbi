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
        // Brighter, more vibrant blues
        jobbi: {
          dark: '#1a365d',       // Deep blue (sidebar)
          navy: '#2563eb',       // Vibrant blue
          slate: '#3b82f6',      // Bright blue
          muted: '#60a5fa',      // Light blue
          light: '#93c5fd',      // Very light blue
          50: '#eff6ff',         // Almost white blue
        },
        // Grays with blue tint
        steel: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
        },
        // Accent orange - more vibrant
        accent: {
          light: '#fed7aa',
          DEFAULT: '#fb923c',
          hover: '#f97316',
          dark: '#ea580c',
        },
        // Status colors - brighter
        status: {
          saved: '#3b82f6',      // Blue
          applied: '#fb923c',    // Orange
          interview: '#a855f7',  // Purple
          accepted: '#22c55e',   // Green
          rejected: '#f43f5e',   // Rose
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
        'bubble': '3rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(59, 130, 246, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 8px 30px -4px rgba(59, 130, 246, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 12px 40px -4px rgba(59, 130, 246, 0.18), 0 8px 20px -4px rgba(0, 0, 0, 0.08)',
        'glow': '0 0 30px rgba(251, 146, 60, 0.4)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.3)',
        'bubble': '0 10px 40px -10px rgba(59, 130, 246, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
