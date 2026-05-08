/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F9F8F4',
        'app-text': '#2D3A31',
        primary: {
          DEFAULT: '#8C9A84',
          hover: '#7A8872',
        },
        secondary: '#DCCFC2',
        border: '#E6E2DA',
        interactive: {
          DEFAULT: '#C27B66',
          hover: '#B06855',
        },
        surface: '#FFFFFF',
        'surface-raised': '#F4F2EE',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['var(--font-source-sans)', '"Source Sans 3"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.5rem',
        pill: '9999px',
      },
      boxShadow: {
        'soft-sm': '0 1px 3px rgba(45,58,49,0.06), 0 1px 2px rgba(45,58,49,0.04)',
        'soft-md': '0 4px 16px rgba(45,58,49,0.08), 0 2px 6px rgba(45,58,49,0.05)',
        'soft-lg': '0 8px 32px rgba(45,58,49,0.10), 0 4px 12px rgba(45,58,49,0.06)',
        'soft-xl': '0 20px 48px rgba(45,58,49,0.12), 0 8px 16px rgba(45,58,49,0.07)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
