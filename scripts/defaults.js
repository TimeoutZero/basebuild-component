module.exports = function(){
  var defaultOptions = {
    src     : "./src",
    dist    : './builds/release',
    tmp     : './tmp',
    modules : {
      gulp: {
        defaultValue : 'gulp'  ,
        notStart     : true,
        isExternal   : true
      },

      bundler : {
        defaultValue  : '../tasks/bundler.js',
        webpackConfig : require('../tasks/webpack.bundler.config.js'),
      },
      unitTests :{
        defaultValue      : '../tasks/unitTests.js',
        webpackTestConfig : require('../tasks/webpack.tests.config.js')
      }
    }
  };

  // Common initial properties
  for(key in defaultOptions.modules){
    defaultOptions.modules[key].isDefault = true;
    defaultOptions.modules[key].isEnabled = true;
    defaultOptions.modules[key].uses = defaultOptions.modules[key].defaultValue;
  }

  return defaultOptions;
}