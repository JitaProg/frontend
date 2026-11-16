/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7EF',
        sand: '#F1E8D7',
        linen: '#E7DAC4',
        ink: '#1E2A22',
        clay: '#B85C38',
        wheat: '#D9A441',
        forest: {
          50: '#F3F7F0',
          100: '#E5EEDE',
          200: '#CBDEBF',
          300: '#A6C494',
          400: '#7EA768',
          500: '#5D8848',
          600: '#476C37',
          700: '#38562D',
          800: '#2E4526',
          900: '#273A21',
          950: '#12200F',
        },
        leaf: {
          50: '#F4F8EF',
          100: '#E7F0DB',
          200: '#CFE2B9',
          300: '#AECD8E',
          400: '#88B263',
          500: '#689545',
          600: '#4F7734',
          700: '#3E5D2A',
          800: '#344B25',
          900: '#2C3F21',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 26px 60px -28px rgba(31, 58, 38, 0.45)',
        card: '0 18px 40px -24px rgba(31, 58, 38, 0.35)',
      },
      backgroundImage: {
        'leaf-glow':
          'radial-gradient(circle at 30% 30%, rgba(166,196,148,0.22), transparent 60%)',
      },
    },
  },
  plugins: [],
}
