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
    module: {
        loaders: [
            { test: /\.jsx?$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: [require.resolve('babel-preset-es2015')]
                }
            },
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
        ]
    },
    devServer: {
        contentBase: "tests/",
        host: "localhost",
        port: "9123"
    }
};