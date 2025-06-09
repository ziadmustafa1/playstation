/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3c6e71',
          dark: '#284b63',
          light: '#d9d9d9',
        },
        accent: {
          DEFAULT: '#f58634',
          light: '#ffc26f',
        },
        text: {
          dark: '#333333',
          light: '#4f4f4f',
        },
        bg: {
          light: '#f9f9f9',
          white: '#ffffff',
        }
      },
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 8px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
      },
      transitionDuration: {
        DEFAULT: '300ms',
      }
    },
  },
  plugins: [],
}