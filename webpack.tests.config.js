module.exports = {
    output: {
        filename: 'test.build.js',
        path: 'tests/',
        publicPath: 'http://localhost:9123/tests'
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
        host: "localhost",
        port: "9123"
    }
};