'use strict';
require('file-loader?name=moduleA/[name].[ext]!./bower.json');

module.exports = {
  name: "ModuleA",
  dep1: require("./dep1.js"),
  dep2: require("./dep2.js")
};