'use strict';
require('file?name=moduleB/[name].[ext]!./bower.json');

module.exports = {
  name: "ModuleB",
  dep1: require("./dep3.js"),
  dep2: require("./dep4.js")
}