var path  = require("path");
var webpack = require("webpack");
var contextReplacementPluginCallback = function(options) {
  options.request = options.request.replace("$projectRoot", process.cwd());
  return options;
};

console.log("path.resolve: ", path.resolve(process.cwd() + '/src/'));

module.exports = {
  entry: __dirname + "/../tests/index.js",
  output: {
    path: '/tests',
    publicPath: '/tests/',
    filename: 'test.build.js'
  },
  devtool: 'inline-source-map',
  plugins : [
    new webpack.ContextReplacementPlugin(/\$projectRoot.*/, contextReplacementPluginCallback)
  ],
  resolveLoader: {
    modules: [
      path.join(__dirname, "../node_modules")
    ]

  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,
        loader: "coffee-loader"
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ["env"]
        }
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
    rules: [
      {
        test: /^(?!(.*\.spec\.js$|.*\.mock.js$)).*(\.js|\.jsx|\.coffee)$/,
        enforce: "post",
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true
        },
        include: [
          process.cwd() + '/src/'
        ]
      }
    ]
  },
  devServer: {
    contentBase: "tests/",
    host: "localhost",
    port: "9123"
  }
};