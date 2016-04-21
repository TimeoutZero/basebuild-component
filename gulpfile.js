'use strict';

var _ = require('lodash');

var defaultOptions = {
  "src"     : "./src",
  "dist"    : './builds/release',
  "modules" : {
    "bundler" : {
      "webpackConfig" : require('./webpack.config.js')
    }
  }
}

require('./bundler.js')(defaultOptions);