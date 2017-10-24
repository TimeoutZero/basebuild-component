const path = require('path');
const webpack = require('webpack');
const dir = path.resolve(`${process.cwd()}/src/`);
const contextReplacementPluginCallback = function(options) {
  options.request = options.request.replace('$projectRoot', process.cwd());
  return options;
};

console.log('path.resolve: ', path.resolve(process.cwd() + '/src/'));

module.exports = {
  entry: __dirname + '/../tests/index.js',

  output: {
    path: '/tests',
    publicPath: '/tests/',
    filename: 'test.build.js'
  },

  devtool: 'cheap-module-eval-source-map',

  plugins : [
    new webpack.ContextReplacementPlugin(/\$projectRoot.*/, contextReplacementPluginCallback)
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.coffee'],
    modules: [
      path.join(__dirname, '../node_modules'),
      'node_modules'
    ]
  },

  module: {

    rules: [

      {
        test: /\.(ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'ts-loader'
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