'use strict';

module.exports = function(options){

  const gulp                   = require(options.modules.gulp.uses),
        shell                  = require('gulp-shell'),
        path                   = require('path'),
        cross_env              = path.resolve(`${__dirname}/../node_modules/.bin/cross-env`),
        mocha_webpack          = path.resolve(`${__dirname}/../node_modules/.bin/mocha-webpack`),
        nyc                    = path.resolve(`${__dirname}/../node_modules/.bin/nyc`),
        webpack_config         = path.resolve(`${__dirname}/../scripts/webpack.tests.config.js`),
        spec_files             = path.resolve(`${process.cwd()}/./src/**/*.spec.{js,coffee}`),
        nyc_output_folder_path = path.resolve(`${process.cwd()}/./coverage/.nyc_output`);

  gulp.task('test', shell.task(
    `${cross_env} NODE_ENV=testing ${mocha_webpack} --webpack-config ${webpack_config} "${spec_files}"`
  ));

  gulp.task('test:auto', shell.task(
    `${cross_env} NODE_ENV=testing ${mocha_webpack} --watch --webpack-config ${webpack_config} "${spec_files}"`
  ));

  gulp.task('test:coverage', shell.task(
    `${cross_env} NODE_ENV=testing ${nyc} --temp-directory="${nyc_output_folder_path}" --instrument=false --source-map=false --include="src/**/!(*.spec).{js,coffee}" --reporter=lcov --reporter=text --report-dir="${process.cwd()}/coverage" ${mocha_webpack} --webpack-config ${webpack_config} "${spec_files}"`
  ));
};