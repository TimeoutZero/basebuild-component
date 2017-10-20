var moduleB    = require('./moduleB.entry');
var moduleBDep = require('./dep');
var assert     = require('chai').assert;

describe('moduleB',  function()  {
  describe('when imported', function () {

    it('should have name defined', function () {
      assert.equal('ModuleB', moduleB.name);
    });

    it('should have dep defined', function () {
      assert.equal(moduleBDep(), moduleB.dep);
    });

  });
});