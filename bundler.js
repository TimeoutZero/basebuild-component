'use strict';

module.exports = function(options){
  var gulp    = require('gulp'),
      webpack = require('webpack-stream'),
      named   = require('vinyl-named'),
      debug   = require('gulp-debug'),
      path    = require('path');

  gulp.task("bundle", function(){
    return gulp
      .src(options.src + "/**/*.entry.{js,jsx,coffee}")
      .pipe(named(function(file){
        return path.basename(file.path, ".entry" + path.extname(file.path));
      }))
      .pipe(webpack(options.modules.bundler.webpackConfig))
      .pipe(gulp.dest(options.dist + "/"));
  })

}