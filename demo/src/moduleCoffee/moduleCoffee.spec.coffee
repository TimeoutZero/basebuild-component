import moduleCoffee from './moduleCoffee.entry'
import moduleCoffeeDep from './dep'
import { assert } from 'chai'

describe 'moduleCoffee', () =>
  describe 'when imported', () =>

    it 'should have name defined', () =>
      assert.equal 'ModuleCoffee', moduleCoffee.name

    it 'should have dep1 defined', () =>
      assert.equal moduleCoffeeDep1(), moduleCoffee.dep1

    it 'should have dep2 defined', () =>
      assert.equal moduleCoffeeDep2(), moduleCoffee.dep2
