'use strict';
require('file-loader?name=moduleB/[name].[ext]!./bower.json');
var moduleBDep = require("./dep");

module.exports = {
  name : "ModuleB",
  dep  : moduleBDep(),
};