var moduleES5    = require('./moduleES5.entry');
var moduleES5Dep = require('./dep');
var assert       = require('chai').assert;

describe('moduleES5',  function()  {
  describe('when imported', function () {

    it('should have name defined', function () {
      assert.equal('ModuleES5', moduleES5.name);
    });

    it('should have dep defined', function () {
      assert.equal(moduleES5Dep(), moduleES5.dep);
    });

  });
});