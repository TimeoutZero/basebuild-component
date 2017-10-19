var tests = require.context("$projectRoot/src", true, /.+\.spec\.js$/);
tests.keys().forEach(tests);

var components = require.context("$projectRoot/src", true, /.+(\.jsx?|\.coffee)$/);
components.keys().forEach(components);


module.exports = tests;