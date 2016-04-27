'use strict';

module.exports = {
  output: {
    filename: "[name].js",
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
      /* ES6 */
      { test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: [require.resolve('babel-preset-es2015')]
        }
      }
    ]
  }
};