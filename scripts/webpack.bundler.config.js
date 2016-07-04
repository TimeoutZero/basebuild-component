'use strict';
const path  = require("path");

module.exports = {
  output: {
    filename: "[name]/[name].js",
    library: "[name]",
    libraryTarget: "umd"
  },
  resolveLoader: {
      root: path.join(__dirname, "../node_modules")
  },

  module: {
    loaders: [
      /* Styles */
      { test: /\.css$/,
        loader: "style!css" },

      /* Coffee */
      { test: /\.coffee$/,
        loader: "coffee-loader" },

      /* ES6/Jsx */
      { test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: [require.resolve('babel-preset-es2015')]
        }
      },

      {
        test: /\.(spec|mock)/,
        loader: 'null-loader'
      },

      /* JSON */
      { test: /\.json$/,
        loader: "null-loader",
        exclude: /(src)/ }
    ]
  }
};