var path = require("path");

module.exports = {
    entry: "./tests/index.js",
    output: {
        path: path.resolve(__dirname + 'tests'),
        publicPath: '/tests/',
        filename: 'test.build.js'
    },
    context: __dirname,
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