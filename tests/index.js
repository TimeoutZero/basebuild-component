var context = require.context("$projectRoot/src", true, /.+\.spec\.(js|coffee)$/);
context.keys().forEach(context);

module.exports = context;