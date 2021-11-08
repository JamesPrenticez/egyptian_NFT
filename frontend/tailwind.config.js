module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      dropShadow: {
        'red': '0px 0px 10px #FF0000',
        'green': '0px 0px 10px #00FF00',
        'blue': '0px 0px 10px #0000FF',
        'pink': '0px 0px 10px #FF00FF',
        'yellow': '0px 0px 10px #FFFF00',
        'white': '0px 0px 10px #FFFFFF',
      },
      scale: {
        '-1': '-1',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
