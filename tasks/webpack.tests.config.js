var path = require("path");

module.exports = {
    entry: "./tests/index.js",
    output: {
        path: '/tests',
        publicPath: '/tests/',
        filename: 'test.build.js'
    },
    devtool: "#eval",
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel-loader']
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