'use strict';

const path = require('path');

module.exports = function(){
  var defaultOptions = {
    src     : "src",
    dist    : 'builds/release',
    tmp     : './tmp',
    regexpToFindRegexp: /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/,

    modules : {
      gulp: {
        defaultValue : 'gulp'  ,
        notStart     : true,
        isExternal   : true
      },
      bundler : {
        defaultValue  : '../bbtasks/bundler.js',
        webpackConfig : require('./webpack.bundler.config.js')
      },
      devServer : {
        defaultValue  : '../bbtasks/devServer.js',
        webpackConfig : require('./webpack.devServer.config.js')
      },
      unitTests :{
        defaultValue      : '../bbtasks/unitTests.js',
        mochaOptions      : '--ui "bdd" --colors true',

        webpackConfig : require('./webpack.tests.config.js')
      }
    }
  };


  // Unit Tests Module
  defaultOptions.modules.unitTests.mergedUserOptionsFileName = 'webpack.merged-user-options.config.js';
  defaultOptions.modules.unitTests.mergedUserOptionsDir  = `${__dirname}/../test-config`;
  defaultOptions.modules.unitTests.mergedUserOptionsFilePath = path.resolve(`${defaultOptions.modules.unitTests.mergedUserOptionsDir}/${defaultOptions.modules.unitTests.mergedUserOptionsFileName}`);

  // Common initial properties
  for(let key in defaultOptions.modules){
    defaultOptions.modules[key].isDefault = true;
    defaultOptions.modules[key].isEnabled = true;
    defaultOptions.modules[key].uses = defaultOptions.modules[key].defaultValue;
  }

  return defaultOptions;
};