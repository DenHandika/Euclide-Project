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
        paper: {
          canvas: '#FAFAF7',
          surface: '#FFFFFF',
          muted: '#F3F3ED',
          border: '#E4E4DC',
          darkBorder: '#CECEC2',
        },
        ink: {
          DEFAULT: '#13224E',
          primary: '#13224E',
          medium: '#2A3C72',
          muted: '#637096',
          faint: '#9EABC7',
        },
        indigo: {
          DEFAULT: '#1B3B8C',
          light: '#274DB8',
          dark: '#132B66',
        },
        amber: {
          DEFAULT: '#EFA93B',
          highlight: '#EFA93B',
          light: '#FDF3E3',
          dark: '#C8831A',
        },
        crimson: {
          DEFAULT: '#D0342C',
          alert: '#D0342C',
          light: '#FDECEB',
          dark: '#A6211A',
        },
        emerald: {
          DEFAULT: '#1B8A5A',
          light: '#EAF7F0',
          dark: '#126340',
        },
      },
      fontFamily: {
        serif: ['Spectral', 'Georgia', 'serif'],
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'paper': 'none',
        'sheet': 'none',
      },
    },
  },
  plugins: [],
};
