const path         = require('path');
const webpack      = require('webpack');
const webpackMerge = require('webpack-merge');
const dir          = path.resolve(`${process.cwd()}/src/`);

// let targets = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main'];
let targets = ['web', 'node'];


const contextReplacementPluginCallback = function(options) {
  options.request = options.request.replace('$projectRoot', process.cwd());
  return options;
};

const baseConfig =  {
  entry: __dirname + '/../test-config/index.js',

  output: {
    path: '/test-config',
    publicPath: '/test-config/',
    filename: 'test.build.js'
  },

  devtool: 'cheap-module-eval-source-map',

  plugins : [
    new webpack.ContextReplacementPlugin(/\$projectRoot.*/, contextReplacementPluginCallback),
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core/,
      process.cwd(), // location of your src
      { }
    )
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

targets = targets.map( (target) => {
  let base = webpackMerge(baseConfig, {
    target: target,
    output: {
      path: '/test-config',
      publicPath: '/test-config/',
      filename: 'test-config.' + target + '.js'
    }
  });


  return base;
});
module.exports = targets;