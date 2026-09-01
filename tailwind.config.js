/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F5FF',
          100: '#E0EAFF',
          200: '#C7D7FE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E3A8A',
          900: '#0F172A',
        },
        paper: {
          canvas: '#F8FAFC',
          surface: '#FFFFFF',
          muted: '#F1F5F9',
          border: '#E2E8F0',
          darkBorder: '#CBD5E1',
        },
        ink: {
          DEFAULT: '#0F172A',
          primary: '#0F172A',
          medium: '#334155',
          muted: '#64748B',
          faint: '#94A3B8',
        },
        indigo: {
          DEFAULT: '#1E3A8A',
          light: '#2563EB',
          dark: '#0F172A',
        },
        amber: {
          DEFAULT: '#F59E0B',
          highlight: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        crimson: {
          DEFAULT: '#EF4444',
          alert: '#EF4444',
          light: '#FEE2E2',
          dark: '#B91C1C',
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#047857',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Spectral', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'sheet': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  plugins: [],
};
