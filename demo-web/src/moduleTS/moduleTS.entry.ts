import 'file-loader?name=moduleTS/[name].[ext]!./bower.json';
import { moduleTS } from './moduleTS.interface';
import dep1 from './dep1';
import dep2 from './dep2';

const obj: moduleTS = {
  dep1: dep1(),
  dep2: dep2(),
  name: "ModuleTS"
}

export default obj;