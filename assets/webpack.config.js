const path = require('path');
const webpack = require('webpack');

if (process.env.WATCH) {
  elmLoader = 'elm-webpack-loader?debug=true';
} else {
  elmLoader = 'elm-webpack-loader';
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
        loader: elmLoader,
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
