module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'she-pink': '#ff006c',
        cornflowerblue: '#46a1f3',
        discord: '#7289DA',
        darkpurple: '#7C6484',
        'glass-white': 'rgba(255, 255, 255, 0.5)',
        'glass-border': 'rgba(251, 250, 250, 0.7)',
        'dark-title': 'rgba(0, 0, 0, 0.7)',
      },
    },
    fontFamily: {
      title: ['Impact', 'sans-serif'],
      button: ['Oswald', 'sans-serif'],
    },
  },
  plugins: [],
};
