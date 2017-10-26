const path = require("path");
const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');
const dir = path.resolve('src');

module.exports = {

  module: {
    rules: [

      {
        test: /\.(js|jsx|coffee)$/,
        include: dir,
        enforce: "post",
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true
        }
      },

      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components|^(?!.*\.spec\.js$).*\.js$)/,
        options: {
          env: {
            testing: {
              presets: [
                ['airbnb', { 'modules': 'umd' }]
              ]
            }
          },
          presets: [
            ['airbnb', { 'modules': 'umd' }]
          ],
        }
      },

      {
        test: /\.coffee$/,
        exclude: /(node_modules|bower_components|^(?!.*\.spec\.js$).*\.js$)/,
        loader: "coffee-loader"
      },

      // {
      //   test: path.resolve('c:\Users\bdfac\Documents\projects\basebuild-component\demo\node_modules\angular\angular.js'),
      //   // include: /node_modules/,
      //   use: "imports-loader?this=>global"
      // }

    ]
  },

  resolve: {
    alias: {
      angular: path.resolve(`${process.cwd()}/node_modules/angular/angular.js`)
    }
  },

  // plugins: [
  //   new webpack.DefinePlugin({
  //     angular: 'window.angular'
  //   })
  // ],

  // output: {
  //   devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  //   devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  // },

  // target: 'node',
  // externals: [nodeExternals()],
  devtool: "inline-cheap-module-source-map"

}