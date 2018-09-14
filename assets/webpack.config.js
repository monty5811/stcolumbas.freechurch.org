const path = require('path');
const webpack = require('webpack');

if (process.env.WATCH) {
  elmDebug = true;
  elmOpt = false;
} else {
  elmDebug = false;
  elmOpt = true;
}

module.exports = {
  entry: {
    stcs: ['./stcs.js'],
    cms: ['./cms.js'],
  },
  output: {
    path: path.resolve(__dirname + '/../static/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        loader: 'elm-webpack-loader',
        options: {
          debug: elmDebug,
          optimize: elmOpt,
        }
      },
    ],
    noParse: /\.elm$/,
  },
  plugins: [],
  devServer: {
    inline: true,
    stats: { colors: true },
  },
};
