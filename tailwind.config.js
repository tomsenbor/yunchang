/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        night: '#07111f',
        navy: '#0f172a',
        ink: '#18202f',
        muted: '#607086',
        line: '#dbe3ee',
        brand: '#0e7490',
        brandBright: '#0891b2',
        accent: '#f97316',
        soft: '#f8fafc'
      },
      boxShadow: {
        soft: '0 16px 40px rgba(24, 32, 47, 0.08)',
        glow: '0 24px 70px rgba(8, 145, 178, 0.24)',
        card: '0 18px 45px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
