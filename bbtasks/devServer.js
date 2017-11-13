'use strict';

module.exports = function(options){

  var gulp             = require(options.modules.gulp.uses),
      path             = require('path'),
      gutil            = require('gulp-util'),
      webpack          = require('webpack'),
      webpackStream    = require('webpack-stream'),
      WebpackDevServer = require('webpack-dev-server');

  gulp.task('bundleTest', function(){
    return gulp.src('../test-config/index.js')
      .pipe(webpackStream(options.modules.devServer.webpackConfig))
      .pipe(gulp.dest(options.tmp + '/'));
  });

  gulp.task("test:web-auto", function(callback){
    // Start a webpack-dev-server
    var configs = options.modules.devServer.webpackConfig;
    configs.entry = "mocha-loader?ui=bdd!" + path.resolve(configs.entry);
    var compiler = webpack(configs);

    compiler.plugin("done", function(stats) {
      console.log("done compiling")
      theServer.middleware.waitUntilValid(function(){
          console.log('Package is in a valid state', new Date());
      });
    })

    var theServer = new WebpackDevServer(compiler, {
        publicPath: '/tests/',
        filename: 'test.build.js',
        contentBase: path.resolve(__dirname + '/../test-config')
    });

    theServer.listen(8080, "localhost", function(err) {
      if (err) throw new gutil.PluginError("webpack-dev-server", err);
      // Server listening
      gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
  });

};