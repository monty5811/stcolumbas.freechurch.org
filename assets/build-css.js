'use strict';

const Promise = require('bluebird');
const Chalk = require('chalk');
const CSSnano = require('cssnano');
const FS = Promise.promisifyAll(require('fs'));
const Path = require('path');
const PostCSS = require('postcss');
const atImport = require('postcss-import');

function buildStyles() {
  return (
    Promise.resolve()
      // Create the dist folder if it doesn't exist
      .then(() => {
        if (!FS.existsSync(Path.join(__dirname, '../static/css'))) {
          return FS.mkdirAsync(Path.join(__dirname, '../static/css'));
        }
      })

      // Generate minified stylesheet
      .then(() => {
        let file = Path.join(__dirname, 'css/stcs.css');
        let css = FS.readFileSync(file, 'utf8');

        return PostCSS([
          atImport(),
          CSSnano({
            autoprefixer: false,
            safe: true,
          }),
        ]).process(css, { from: file });
      })

      // Write stylesheet to dist
      .then(result => {
        let file = Path.join(__dirname, '../static/css/stcs.css');

        // Output a message
        console.log(
          Chalk.green('CSS processed: %s! '),
          Path.relative(__dirname, file)
        );

        // Write output file
        return FS.writeFileAsync(file, result.css, 'utf8');
      })
  );
}

buildStyles();
