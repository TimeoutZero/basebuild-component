// import * as fs from 'fs';
const fs = require('fs');
import { assert } from 'chai';
declare let require;

describe("When there is a node module import", function () {

  it('imports the module', function (done) {
    assert.exists(fs);
  });

});
