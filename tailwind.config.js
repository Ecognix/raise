/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: {
          950: '#060B13', // deepest background
          900: '#0A1220', // main page background
          850: '#0E192D', // cards and panels
          800: '#14233C', // secondary cards / header
          700: '#1D3254', // borders and dividers
          600: '#2A4674',
        },
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          600: '#334E68',
          700: '#243B53',
          800: '#1B2F4B', // primary
          900: '#102A43',
          950: '#0B1A2C',
        },
        electric: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        cybercyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        primary: '#1B2F4B',
        accent: {
          DEFAULT: '#F2A900',
          hover: '#DB9700',
          light: '#FEF7E6',
        },
        severity: {
          good: '#10B981',
          'good-bg': 'rgba(16, 185, 129, 0.15)',
          moderate: '#F59E0B',
          'moderate-bg': 'rgba(245, 158, 11, 0.15)',
          severe: '#EF4444',
          'severe-bg': 'rgba(239, 68, 68, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 15px -3px rgba(59, 130, 246, 0.4)',
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.4)',
        'glow-amber': '0 0 15px -3px rgba(242, 169, 0, 0.35)',
        'glow-red': '0 0 15px -3px rgba(239, 68, 68, 0.4)',
      }
    },
  },
  plugins: [],
}
