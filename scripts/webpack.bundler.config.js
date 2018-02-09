const path = require("path");
const webpack = require("webpack");

module.exports = {

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname , '../tsconfig.json')
          }
        }
      },

      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
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
        }
      },

      {
        test: /\.coffee$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'coffee-loader',
          options: {
            transpile: {
              presets: ['env']
            }
          }
        }
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
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.coffee'],
    modules: [
      __dirname,
      process.cwd(),
      path.resolve(process.cwd(), "./node_modules"),
      "node_modules"
    ]
  },

  resolveLoader: {
    moduleExtensions: ['-loader']
  }

};