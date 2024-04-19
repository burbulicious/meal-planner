/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        grey: {
          DEFAULT: '#e6e6e6',
          900: '#191919',
          850: '#303030',
          800: '#5E5E5E',
          700: '#C0C0C0'
        },
        yellow: {
          DEFAULT: '#ffd000',
          100: '#f6f2dd'
        },
        violet: '#4E148C',
        magenta: '#D90866',
        green: {
          DEFAULT: '#2D9F64',
          light: '#edf7e7'
        },
        red: {
          DEFAULT: '#d55b60',
          light: '#ffdcd9'
        },
        blue: {
          DEFAULT: '#409cdd',
          light: '#e3edf3'
        }
      },
      screens: {
        xs: '420px',
        // => @media (min-width: 420px) { ... }

        sm: '640px',
        // => @media (min-width: 640px) { ... }

        md: '768px',
        // => @media (min-width: 768px) { ... }

        lg: '1024px',
        // => @media (min-width: 1024px) { ... }

        xl: '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px'
        // => @media (min-width: 1536px) { ... }
      }
    }
  },
  plugins: []
}
