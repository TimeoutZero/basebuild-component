var context = require.context("$projectRoot/src", true, /.+\.spec\.(js|jsx|ts|tsx|coffee)$/);
context.keys().forEach(context);

module.exports = context;