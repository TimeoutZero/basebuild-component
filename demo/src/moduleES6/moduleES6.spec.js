import moduleES6 from './moduleES6.entry';
import moduleES6Dep1 from './dep1';
import moduleES6Dep2 from './dep2';
import { assert } from 'chai';

import angular from 'angular';

describe('moduleES6', () => {
  describe('when imported', () => {

    it('should have name defined', () => {
      console.log(angular.module('teste'))
      assert.equal('ModuleES6', moduleES6.name);
    });

    it('should have dep1 defined', () => {
      assert.equal(moduleES6Dep1(), moduleES6.dep1);
    });

    it('should have dep2 defined', () => {
      assert.equal(moduleES6Dep2(), moduleES6.dep2);
    });

  });
});