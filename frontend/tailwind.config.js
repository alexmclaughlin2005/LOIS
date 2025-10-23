/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          coral: '#FF6B6B',
          black: '#000000',
        },
        // Background colors
        background: {
          primary: '#FFFFFF',
          secondary: '#F7F7F6',
          tertiary: '#F5F5F5',
        },
        // Text colors
        text: {
          primary: '#161616',
          secondary: '#6B6B6B',
          tertiary: '#999999',
        },
        // Border colors
        border: {
          light: '#E0E0E0',
          medium: '#BDBDBD',
          dark: '#757575',
        },
        // Status colors
        status: {
          success: '#4CAF50',
          warning: '#FF6B6B',
          info: '#2196F3',
          portal: '#00C853',
        },
        // Neutral palette
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        display: ['"Helvetica Now Display"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.5' }],
        'sm': ['12px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.5' }],
        'lg': ['16px', { lineHeight: '1.5' }],
        'xl': ['18px', { lineHeight: '1.5' }],
        'xxl': ['21px', { lineHeight: '1.2' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        'pill': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'level-1': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'level-2': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'level-3': '0 4px 16px rgba(0, 0, 0, 0.16)',
        'level-4': '0 8px 24px rgba(0, 0, 0, 0.20)',
      },
    },
  },
  plugins: [],
}
