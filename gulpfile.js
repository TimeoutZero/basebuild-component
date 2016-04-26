'use strict';

var _ = require('lodash');

var defaultOptions = {
  "src"     : "./src",
  "dist"    : './builds/release',
  "tmp"     : './tmp',
  "modules" : {
    "bundler" : {
      "webpackConfig" : require('./tasks/webpack.bundler.config.js'),
      "webpackTestConfig" : require('./tasks/webpack.tests.config.js')
    }
  }
}

require('./tasks/bundler.js')(defaultOptions);
require('./tasks/unitTests.js')(defaultOptions);