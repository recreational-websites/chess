// postcss.config.js
module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-nested-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
    "postcss-csso": {
      restructure: false,
    },
  },
};
