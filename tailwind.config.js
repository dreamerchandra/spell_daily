/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          950: '#0f0a1a', // Deep purple-black
          900: '#1a1625', // Dark purple
          800: '#2a2438', // Medium purple-gray
          700: '#3d344a', // Lighter purple-gray
          600: '#4f4560', // Even lighter purple
          500: '#64748b', // neutral gray
        },
        // Game specific colors
        game: {
          primary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7', // Purple from logo - main primary
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
          },
          secondary: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b', // Yellow/Orange accent from logo
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          success: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
          },
          error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
          },
        },
      },
      backgroundImage: {
        'dark-gradient':
          'linear-gradient(to bottom right, #1a1625, #2a2438, #1a1625)',
        'game-gradient': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(135deg, #a855f7, #9333ea)',
        'secondary-gradient': 'linear-gradient(135deg, #f59e0b, #d97706)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
