'use strict';

var _ = require('lodash');

var defaultOptions = {
  "src"     : "./src",
  "dist"    : './builds/release',
  "tmp"     : './tmp',
  "modules" : {
    "bundler" : {
      "webpackConfig" : require('./webpack.config.js'),
      "webpackTestConfig" : require('./webpack.tests.config.js')
    }
  }
}

require('./bundler.js')(defaultOptions);