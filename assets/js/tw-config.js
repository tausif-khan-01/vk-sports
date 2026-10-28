/* Tailwind Play CDN theme — VK Sports brand tokens */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: '#07111B',
        volt: '#24D653',
        ice: '#F5F7FA',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
document.documentElement.classList.add('js');
