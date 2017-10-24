'use strict';

module.exports = function(options){

  var gulp             = require(options.modules.gulp.uses),
      gutil            = require('gulp-util'),
      webpack          = require('webpack'),
      webpackStream    = require('webpack-stream'),
      WebpackDevServer = require('webpack-dev-server');

  gulp.task('bundleTest', function(){
    return gulp.src('../tests/index.js')
      .pipe(webpackStream(options.modules.devServer.webpackTestConfig))
      .pipe(gulp.dest(options.tmp + '/'));
  });

  gulp.task("test:auto", function(callback){
    // Start a webpack-dev-server
    var configs = options.modules.devServer.webpackTestConfig;
    configs.entry = "mocha-loader?ui=bdd!" + configs.entry;
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
        contentBase: __dirname + '/../tests'
    });

    theServer.listen(8080, "localhost", function(err) {
      if (err) throw new gutil.PluginError("webpack-dev-server", err);
      // Server listening
      gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
  });

};