const path = require('path');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    path.join(__dirname, '..', '..', 'views') + '/*.ejs',
    path.join(__dirname, '..', '..', 'views') + '/**/*.ejs',
    path.join(__dirname, 'src') + '/*.js',
    path.join(__dirname, 'src') + '/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        96: '24rem',
      },
      colors: {
        primary: {
          100: '#dfd2f4',
          200: '#c0a6e9',
          300: '#a079df',
          400: '#814dd4',
          500: '#6120c9',
          600: '#4e1aa1',
          700: '#3a1379',
          800: '#270d50',
          900: '#130628',
        },
      },
    },
  },
  plugins: [
    require('animatecss-tailwind'), // https://www.npmjs.com/package/animatecss-tailwind
    require('tailwind-table-padding'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};
