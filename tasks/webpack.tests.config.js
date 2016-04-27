var path  = require("path");
var webpack = require("webpack");
var contextReplacementPluginCallback = function(options) {
    options.request = options.request.replace("$projectRoot", process.cwd());
    return options;
};

module.exports = {
    entry: __dirname + "/../tests/index.js",
    output: {
      path: '/tests',
      publicPath: '/tests/',
      filename: 'test.build.js'
    },
    devtool: "#eval",
    plugins : [
      new webpack.ContextReplacementPlugin(/\$projectRoot.*/, contextReplacementPluginCallback)
    ],
    resolveLoader: {
      root: path.join(__dirname, "../node_modules")
    },
    isparta: {
      embedSource: true,
      noAutoWrap: true,
      // these babel options will be passed only to isparta and not to babel-loader
      babel: {
        presets: ['es2015']
      }
    },
    reporters: [ 'progress', 'coverage' ],
    coverageReporter: {
      type: 'html'
    },
    module: {
      loaders: [
        {
          test: /\.coffee$/,
          loader: "coffee-loader"
        },
        {
          test: /\.css$/,
          loader: 'null-loader'
        },
        {
          test: /(\.jpg|\.jpeg|\.png|\.gif)$/,
          loader: 'null-loader'
        }
      ],
      preLoaders: [
          { test: /\.jsx?$/,
            loader: 'babel',
            exclude: /(node_modules|bower_components)/,
            query: {
              presets: [require.resolve('babel-preset-es2015')]
            }
          },
          {
            test: /\.js?$/,
            include: path.resolve(process.cwd() + '/src/'),
            exclude: [/\.spec\.js/],
            loader: 'isparta'
          }
      ]
    },
    devServer: {
        contentBase: "tests/",
        host: "localhost",
        port: "9123"
    }
};