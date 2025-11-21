// postcss.config.js
export default {
  plugins: {
    // Tailwind handles utility generation + purging
    tailwindcss: {},

    // Adds vendor prefixes for cross-browser support
    autoprefixer: {},

    // Ready for future enhancements like nested CSS:
    // "postcss-nesting": {}
  },
};
