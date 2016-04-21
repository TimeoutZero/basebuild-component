var assert = require('chai').assert;

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(2));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
    it('should return -1 when the value is not present 2', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
    });
  });
});