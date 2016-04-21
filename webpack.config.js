'use strict';

module.exports = {
  output: {
    filename: "[name].js"
  },
  watch: true,
  devtool: "#eval-source-map",
  module: {
    loaders: [
      /* Styles */
      { test: /\.css$/,
        loader: "style!css" },
      /* Coffee */
      { test: /\.coffee$/,
        loader: "coffee-loader" },
      /* ES6 */
      { test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};