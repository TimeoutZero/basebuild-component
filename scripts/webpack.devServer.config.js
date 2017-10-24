const path = require('path');
const webpack = require('webpack');
const dir = path.resolve(`${process.cwd()}/src/`);
const contextReplacementPluginCallback = function(options) {
  options.request = options.request.replace('$projectRoot', process.cwd());
  return options;
};

module.exports = {
  entry: __dirname + '/../test-config/index.js',

  output: {
    path: '/test-config',
    publicPath: '/test-config/',
    filename: 'test.build.js'
  },

  devtool: 'cheap-module-eval-source-map',

  plugins : [
    new webpack.ContextReplacementPlugin(/\$projectRoot.*/, contextReplacementPluginCallback)
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.coffee'],
    modules: [
      path.resolve(__dirname, '../node_modules'),
      'node_modules'
    ]
  },

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
        use: 'babel-loader'
      },


      {
        test: /\.coffee$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'coffee-loader'
      },

      {
        test: /\.css$/,
        loader: 'null-loader'
      },

      {
        test: /\.(jpg|jpeg|png|gif)/,
        loader: 'null-loader'
      }

    ]
  }

};