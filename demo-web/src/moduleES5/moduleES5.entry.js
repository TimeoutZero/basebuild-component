'use strict';
require('file-loader?name=moduleES5/[name].[ext]!./bower.json');
var moduleBDep = require("./dep");

module.exports = {
  name : "ModuleES5",
  dep  : moduleBDep(),
};