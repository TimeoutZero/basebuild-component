var test = require('./moduleA.entry.js');
var assert = require('chai').assert;

describe('Array',  function()  {
  describe('#indexOf()', function () {
    describe('Line 3', function () {
      describe('Line 4', function () {
        describe('Line 5', function () {
          it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(1));
            assert.equal(-1, [1,2,3].indexOf(0));
          });
          it('should return -1 when the value is not present 2', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
          });
        });
      });
    });
  });
});