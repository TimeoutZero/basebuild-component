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
      root: path.join(__dirname, "../node_modules")
    },
    module: {
      loaders: [
        {
          test: /\.coffee$/,
          loader: "coffee-loader"
        },
        {
          test: /\.jsx?$/,
          loader: 'babel',
          exclude: /(node_modules|bower_components)/,
          query: {
            presets: [require.resolve('babel-preset-es2015')]
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
      postLoaders: [
          {
            test: /^(?!(.*\.spec\.js$|.*\.mock.js$)).*(\.jsx?|\.coffee)$/,
            include: [
                process.cwd() + '/src/'
            ],
            loader: 'istanbul-instrumenter'
          }
      ]
    },
    devServer: {
        contentBase: "tests/",
        host: "localhost",
        port: "9123"
    }
};