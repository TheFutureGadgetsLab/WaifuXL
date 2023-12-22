const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      pink: {
        100: '#FF869C',
        200: '#FF869C',
        300: '#FF869C',
        400: '#FF869C',
        500: '#FF869C',
        600: '#FF869C',
        700: '#FF869C',
        800: '#FF869C',
        900: '#FF869C',
      },
      litepink: '#ffb3c1',
      brown: '#51393C',
      blue: {
        100: '#44ABBC',
        200: '#44ABBC',
        300: '#44ABBC',
        400: '#44ABBC',
        500: '#44ABBC',
        600: '#44ABBC',
        700: '#44ABBC',
        800: '#44ABBC',
        900: '#44ABBC',
      },
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      stockblue: colors.blue,
      zinc: colors.zinc
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
