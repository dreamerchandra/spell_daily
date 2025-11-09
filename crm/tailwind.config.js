/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        accent: {
          blue: '#60a5fa',
          orange: '#f97316',
          red: '#ef4444',
        },
      },
      backgroundColor: {
        app: '#111827',
        'app-secondary': '#1f2937',
        'app-hover': '#374151',
      },
      textColor: {
        'app-primary': '#ffffff',
        'app-secondary': '#9ca3af',
        'app-accent': '#60a5fa',
        'white-100': '#ffffff',
        'white-90': 'rgba(255, 255, 255, 0.9)',
        'white-70': 'rgba(255, 255, 255, 0.7)',
        'white-50': 'rgba(255, 255, 255, 0.5)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
