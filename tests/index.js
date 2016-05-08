// if(typeof window != 'undefined'){
//   window.mocha.setup( {ui: 'tdd'} );
//   require("mocha/mocha.css");
// }

var context2 = require.context("$projectRoot/src", true, /.+(\.jsx?|\.coffee)$/);
context2.keys().forEach(context2);

var context = require.context("$projectRoot/src", true, /.+\.spec\.js$/);
context.keys().forEach(context);

module.exports = context;