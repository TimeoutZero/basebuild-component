import moduleTS from './moduleTS.entry';
import moduleTSDep1 from './dep1';
import moduleTSDep2 from './dep2';
import { assert } from 'chai';

import * as angular from 'angular';

describe('moduleTS', () => {
  describe('when imported', () => {

    it('should have name defined', () => {
      assert.equal('ModuleTS', moduleTS.name);
    });

    it('should have dep1 defined', () => {
      assert.equal(moduleTSDep1(), moduleTS.dep1);
    });

    it('should have dep2 defined', () => {
      assert.equal(moduleTSDep2(), moduleTS.dep2);
    });

  });
});