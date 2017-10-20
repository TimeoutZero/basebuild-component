import moduleA from './moduleA.entry';
import moduleADep1 from './dep1';
import moduleADep2 from './dep2';
import { assert } from 'chai';

describe('moduleA', () => {
  describe('when imported', () => {

    it('should have name defined', () => {
      assert.equal('ModuleA', moduleA.name);
    });

    it('should have dep1 defined', () => {
      assert.equal(moduleADep1(), moduleA.dep1);
    });

    it('should have dep2 defined', () => {
      assert.equal(moduleADep2(), moduleA.dep2);
    });

  });
});