'use strict';

module.exports = function(options){
  var gulp    = require('gulp'),
      named   = require('vinyl-named'),
      path    = require('path'),
      webpackStream    = require('webpack-stream');

  gulp.task("bundle", function(){
    return gulp
      .src(options.src + "/**/*.entry.{js,jsx,coffee}")
      .pipe(named(function(file){
        return path.basename(file.path, ".entry" + path.extname(file.path));
      }))
      .pipe(webpackStream(options.modules.bundler.webpackConfig))
      .pipe(gulp.dest(options.dist + "/"));
  })

}