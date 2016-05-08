var webpack = require('webpack')
var path = require('path');
var webpackConfig = require(__dirname + '/webpack.tests.config.js');
webpackConfig.entry = {};

module.exports = function (config) {

  var conf = {
    browsers: [ ],//'Chrome' ], //run in Chrome
    browserNoActivityTimeout: 60000,
    singleRun: false, //just run once by default
    plugins: [
      require(__dirname + "/../node_modules/mocha"),
      require(__dirname + "/../node_modules/karma-mocha"),
      require(__dirname + "/../node_modules/karma-mocha-debug"),
      require(__dirname + "/../node_modules/karma-mocha-reporter"),
      require(__dirname + "/../node_modules/karma-sourcemap-loader"),
      require(__dirname + "/../node_modules/karma-coverage"),
      require(__dirname + "/../node_modules/karma-webpack")
    ],
    frameworks: [ 'mocha-debug', 'mocha' ], //use the mocha test framework
    files: [
      path.resolve(__dirname + "/../tests/index.js") //just load this file
    ],
    preprocessors: { },
    reporters: [ 'mocha', 'coverage' ], //report results in this format
    mochaReporter: {
      output: 'autowatch'
    },
    coverageReporter: {
      dir: 'build/reports/coverage',
      reporters: [
          {type: 'text'},
          {
              type: 'html',
              subdir: 'report-html'
          },
          {
              type: 'lcov',
              subdir: 'report-lcov'
          },
          {
              type: 'cobertura',
              subdir: '.',
              file: 'cobertura.txt'
          }
      ]
    },
    webpack: webpackConfig,
    webpackServer: {
      noInfo: false //please don't spam the console when running in karma!
    }
  }

  conf.preprocessors[path.resolve(__dirname + "/../tests/index.js")] = [ 'webpack', 'sourcemap' ];
  config.set(conf);
};