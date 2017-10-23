const jsdom = require('jsdom');
const { JSDOM } = jsdom;

global.document = new JSDOM('', {
    userAgent: 'node.js'
});

// global.window = document.defaultView;
// window.console = global.console;

// Object.keys(document.defaultView).forEach((property) => {
//   if (typeof global[property] === 'undefined') {
//     global[property] = document.defaultView[property];
//   }
// });

// global.navigator = {
// };