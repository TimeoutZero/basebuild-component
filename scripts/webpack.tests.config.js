const path = require("path");
const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');
const dir = path.resolve('src');

module.exports = {

  module: {
    rules: [
      {
        test: /\.(js|jsx|coffee)/,
        include: dir,
        enforce: "post",
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true
        }
      },

      {
        test: /\.coffee$/,
        loader: "coffee-loader",
        exclude: /(node_modules|bower_components|\.(test|spec)\..+$)/
      },

      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /(node_modules|bower_components|\.(test|spec)\..+$)/
      }

    ]
  },

  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },

  target: 'node',
  externals: [nodeExternals()],
  devtool: "inline-cheap-module-source-map"
}