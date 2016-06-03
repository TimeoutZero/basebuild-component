'use strict';

module.exports = function(options){
  var gulp    = require(options.modules.gulp.uses),
      gutil   = require("gulp-util"),
      webpack = require("webpack"),
      named   = require('vinyl-named'),
      path    = require('path'),
      mocha   = require('gulp-mocha'),
      webpackStream    = require('webpack-stream'),
      WebpackDevServer = require("webpack-dev-server"),
      istanbul = require("gulp-istanbul");

  gulp.task("test", function(callback){
    // Start a webpack-dev-server
    var configs = options.modules.unitTests.webpackTestConfig;
    configs.entry = "mocha-loader?reporter=nyan&ui=tdd!" + configs.entry;
    var compiler = webpack(configs);

    compiler.plugin("done", function(stats) {
        console.log("done compiling")
        theServer.middleware.waitUntilValid(function(){
            console.log('Package is in a valid state', new Date());
            // console.log(theServer.middleware.fileSystem);
        });
    })

    var theServer = new WebpackDevServer(compiler, {
        path: __dirname + '/../tests',
        publicPath: '/tests/',
        filename: 'test.build.js',
        contentBase: __dirname + '/../tests',
        stats: {
          colors: true
        }
    });

    theServer.listen(8080, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        // Server listening
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");

        // keep the server alive or continue?
        //callback();
    });

    // theServer.middleware.fileSystem.watch('/',{recursive: true}, function(){
    //     console.log('fs changed');
    //     theServer.middleware.waitUntilValid(function(){
    //         console.log('Package is in a valid state', new Date());
    //         console.log(theServer.middleware.fileSystem);
    //     });
    // })

    // console.log(theServer);
  })


  gulp.task('test:prod', ['bundleTest'], function () {
    return gulp.src(options.tmp + '/test.build.js', {read: false})
      .pipe(istanbul.hookRequire())
      .pipe(mocha({reporter: 'nyan'}))
      .pipe(istanbul.writeReports());
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

  var Server = require('karma').Server;
  gulp.task('test:karma', function (done) {
    new Server({
      configFile: __dirname + '/karma.conf.js',
      basePath  : process.cwd()
    }, function(){ done() }).start();
  });

}