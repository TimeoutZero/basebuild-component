import moduleCoffee from './moduleCoffee.entry.coffee'
import moduleCoffeeDep from './dep.coffee'
import { assert } from 'chai'

describe 'moduleCoffee', () ->
  describe 'when imported', () ->

    it 'should have name defined', () ->
      assert.equal 'ModuleCoffee', moduleCoffee.name

    it 'should have dep1 defined', () ->
      assert.equal moduleCoffeeDep(), moduleCoffee.dep