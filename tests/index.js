if(typeof window != 'undefined'){
  window.mocha.setup( {ui: 'tdd'} );
  require("mocha/mocha.css");
}

var context = require.context("$projectRoot/src", true, /.+\.spec\.js$/);
context.keys().forEach(context);
module.exports = context;
