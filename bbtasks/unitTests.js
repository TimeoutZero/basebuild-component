'use strict';

module.exports = function(options){
  const gulp                   = require(options.modules.gulp.uses),
        shell                  = require('gulp-shell'),
        path                   = require('path'),
        cross_env              = path.resolve(require.resolve('cross-env').replace(/node_modules(.*)$/, 'node_modules/.bin/cross-env')),
        mocha_webpack          = path.resolve(require.resolve('mocha-webpack').replace(/node_modules(.*)$/, 'node_modules/mocha-webpack/bin/mocha-webpack')),
        nyc                    = path.resolve(require.resolve('nyc').replace(/node_modules(.*)$/, 'node_modules/.bin/nyc')),
        webpack_config         = path.resolve(`${__dirname}/../scripts/webpack.tests.config.js`),
        spec_files             = path.resolve(`${process.cwd()}/./src/**/*.spec.{ts, js,coffee}`),
        src_files              = path.resolve(`${process.cwd()}/./src/**/!(*.spec).{ts, js,coffee}`),
        nyc_output_folder_path = path.resolve(`${process.cwd()}/./coverage/.nyc_output`),
        moduleOptions          = options.modules.unitTests;

  // shell.task(
  //   `${cross_env} NODE_ENV=testing ${mocha_webpack} --require jsdom-global/register --webpack-config ${webpack_config} "${spec_files}"`
  // );
  let mochaWebpackOptions  = `--webpack-config ${webpack_config} ${moduleOptions.mochaOptions} "${spec_files}"`
  let testNodeCommand      = `node ${mocha_webpack} ${mochaWebpackOptions}`;
  let windowMakerCommand   = `--require jsdom-global/register`;
  let coverageCommand      = `${nyc} --temp-directory="${nyc_output_folder_path}" --instrument=true --source-map=false --include="${src_files}" --reporter=lcov --reporter=text --report-dir="${process.cwd()}/coverage" `;
  const commonShellOptions = {verbose: true};

  gulp.task('test:node', shell.task([
    testNodeCommand
    ], commonShellOptions)
  );

  gulp.task('test:node-auto', shell.task([
    `${testNodeCommand} --watch true`
    ], commonShellOptions)
  );

  gulp.task('test:coverage', shell.task([
      `${coverageCommand} ${mocha_webpack} --webpack-config ${webpack_config} "${spec_files}"`
    ], commonShellOptions)
  );
};