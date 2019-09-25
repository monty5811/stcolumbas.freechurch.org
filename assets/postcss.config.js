const CSSnano = require("cssnano");
const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: [
    "../src/**/*.yml",
    "../src/**/*.md",
    "../templates/**/*.html",
    "**/*/.js"
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});
module.exports = {
  plugins: [
    require("tailwindcss"),
    ...(process.env.NODE_ENV === "production"
      ? [
          CSSnano({
            autoprefixer: true,
            safe: true
          }),
          purgecss
        ]
      : []),
    require("autoprefixer")
  ]
};
