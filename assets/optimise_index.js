const critical = require('critical');

critical
  .generate({
    base: '../dist/',
    src: 'index.html',
    dest: 'index.html',
    css: ['../dist/static/css/stcs.css'],
    inline: true,
    minify: true,
    dimensions: [
      {
        height: 200,
        width: 500,
      },
      {
        height: 900,
        width: 1200,
      },
      {
        height: 1080,
        width: 1920,
      },
    ],
    penthouse: {
      blockJSRequests: false,
    },
  });
