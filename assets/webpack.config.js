const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    stcs: ["./stcs.js"],
    cms: ["./cms.js"]
  },
  output: {
    path: path.resolve(__dirname + "/../static/js"),
    filename: "[name].js"
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }]
  },
  plugins: [],
  devServer: {
    inline: true,
    stats: { colors: true }
  }
};
