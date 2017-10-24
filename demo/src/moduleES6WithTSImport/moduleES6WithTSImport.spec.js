import moduleES6WithTSImport from './moduleES6WithTSImport.entry';
import moduleES6WithTSImportDep1 from './dep1';
import moduleES6WithTSImportDep2 from './dep2';
import { assert } from 'chai';

import angular from 'angular';

describe('moduleES6WithTSImport', () => {
  describe('when imported', () => {

    it('should have name defined', () => {
      assert.equal('moduleES6WithTSImport', moduleES6WithTSImport.name);
    });

    it('should have dep1 defined', () => {
      assert.equal(moduleES6WithTSImportDep1(), moduleES6WithTSImport.dep1);
    });

    it('should have dep2 defined', () => {
      assert.equal(moduleES6WithTSImportDep2(), moduleES6WithTSImport.dep2);
    });

  });
});