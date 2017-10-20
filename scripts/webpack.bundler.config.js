const path = require("path");
const webpack = require("webpack");

module.exports = {

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /(node_modules|bower_components|^(?!.*\.spec\.js$).*\.js$)/
      },

      {
        test: /\.coffee$/,
        loader: "coffee-loader",
        exclude: /(node_modules|bower_components|^(?!.*\.spec\.js$).*\.js$)/
      },

      {
        test: /\.css$/,
        loader: "style!css"
      },

      {
        test: /\.(spec|mock)/,
        loader: 'null-loader'
      },

      {
        test: /\.json$/,
        loader: "null-loader",
        exclude: /(src)/
      }
    ]
  },

  output: {
    filename: "[name]/[name].js",
    library: "[name]",
    libraryTarget: "umd",
    pathinfo: true
  },

  resolve: {
    extensions: [".js"],
    modules: [
      __dirname,
      path.resolve(__dirname, "../node_modules"),
    ]
  },

  resolveLoader: {
    moduleExtensions: ['-loader']
  }

};