import 'file-loader?name=moduleES6/[name].[ext]!./bower.json'
import dep1 from './dep1'
import dep2 from './dep2'

export default {
  dep1: dep1(),
  dep2: dep2(),
  name: "ModuleES6"
};