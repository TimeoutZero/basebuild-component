if(typeof window != 'undefined'){
  window.mocha.setup( {ui: 'tdd'} );
  require("!style!css!mocha/mocha.css");
}

var context = require.context('../src', true, /.+\.spec\.js$/);
context.keys().forEach(context);
module.exports = context;