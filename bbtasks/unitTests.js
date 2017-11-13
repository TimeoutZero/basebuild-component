'use strict';

module.exports = function(options){
  let originalRegExpToJSON     = null;
  const gulp                   = require(options.modules.gulp.uses),
        shell                  = require('gulp-shell'),
        path                   = require('path'),
        gulpFile               = require('gulp-file'),
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
  let mochaWebpackOptions  = `--webpack-config ${moduleOptions.mergedUserOptionsFilePath} ${moduleOptions.mochaOptions} "${spec_files}"`
  let testNodeCommand      = `node ${mocha_webpack} ${mochaWebpackOptions}`;
  let windowMakerCommand   = `--require jsdom-global/register`;
  let coverageCommand      = `${nyc} --temp-directory="${nyc_output_folder_path}" --instrument=true --source-map=false --include="${src_files}" --reporter=lcov --reporter=text --report-dir="${process.cwd()}/coverage" `;
  const commonShellOptions = {verbose: true};

  gulp.task('test:generate-merged-config-file', () => {
    let config      = JSON.stringify(moduleOptions.webpackConfig, regExpJSONReplacer, 2);
    config = config.replace(/"__REGEXP\s/gm, '');

    let regexpToFindRegexpAsString = `${options.regexpToFindRegexp}`;
    regexpToFindRegexpAsString = regexpToFindRegexpAsString.replace(/\\/g, '\\');
    regexpToFindRegexpAsString = regexpToFindRegexpAsString.slice(1, regexpToFindRegexpAsString.length - 1);
    regexpToFindRegexpAsString = [regexpToFindRegexpAsString, '"'].join('');

    let regexpToFindRegexp = new RegExp(regexpToFindRegexpAsString, 'gm');
    let regexps =  config.match(regexpToFindRegexp);
    if(regexps) {
      regexps.forEach((regexp) => {
        let newRegexp = regexp.replace(/\/\\\\/g, '/\\');  // Recovers the begging og regex (undo the string escape)
        newRegexp = newRegexp.replace(/"$/, '');
        config    = config.replace(`${regexp}`, newRegexp);
      });
    }

    let fileContent = `module.exports = ${config};`;

    return gulpFile(moduleOptions.mergedUserOptionsFileName, fileContent , { src: true })
      .pipe(gulp.dest(moduleOptions.mergedUserOptionsDir))
  })

  gulp.task('test:node', ['test:generate-merged-config-file'], shell.task([
    testNodeCommand
    ], commonShellOptions)
  );

  gulp.task('test:node-auto', ['test:generate-merged-config-file'], shell.task([
    `${testNodeCommand} --watch true`
    ], commonShellOptions)
  );

  gulp.task('test:coverage', ['test:generate-merged-config-file'], shell.task([
      `${coverageCommand} ${mocha_webpack} --webpack-config ${webpack_config} "${spec_files}"`
    ], commonShellOptions)
  );


  function regExpJSONReplacer(key, value) {
    if (value instanceof RegExp)
      return ("__REGEXP " + value.toString());
    else
      return value;
  }
};