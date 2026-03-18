import type { Config } from 'tailwindcss';

export default {
  content: ['./entrypoints/**/*.{html,ts,tsx}', './src/**/*.{ts,tsx,css}'],
  theme: {
    extend: {
      colors: {
        primary: '#2ccfc1',
        accent: '#123d5a',
        background: '#040b16',
        surface: '#0a1428',
        success: '#34d399',
        danger: '#f87171',
      },
      boxShadow: {
        soft: '0 20px 80px rgba(12, 17, 34, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
