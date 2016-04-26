'use strict';

module.exports = function(options){
  var gulp    = require(options.modules.gulp.uses),
      gutil   = require("gulp-util"),
      webpack = require("webpack"),
      named   = require('vinyl-named'),
      path    = require('path'),
      mocha   = require('gulp-mocha'),
      webpackStream    = require('webpack-stream'),
      WebpackDevServer = require("webpack-dev-server");

  gulp.task("devTest", function(callback){
    // Start a webpack-dev-server
    var configs = options.modules.unitTests.webpackTestConfig;
    configs.entry = "mocha?reporter=nyan&ui=tdd!" + configs.entry;
    var compiler = webpack(configs);

    new WebpackDevServer(compiler, {
        path: '/tests',
        publicPath: '/tests/',
        filename: 'test.build.js',
        contentBase: './tests',
        stats: {
          colors: true
        }
    }).listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        callback();
    });
  })


  gulp.task('prodTest', ['bundleTest'], function () {
    return gulp.src(options.tmp + '/test.build.js', {read: false})
      .pipe(mocha({reporter: 'nyan'}));
  });

  gulp.task("bundleTest", function(){
    return gulp
      .src("./test/index.js")
      .pipe(named(function(file){
        return "test.bundle.js";
      }))
      .pipe(webpackStream(options.modules.unitTests.webpackTestConfig))
      .pipe(gulp.dest(options.tmp + "/"));
  })

}