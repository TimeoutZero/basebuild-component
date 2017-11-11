import dep1 from './dep1'
import dep2, {dep2SecondExport} from './dep2'

export default {
  dep1: dep1(),
  dep2: dep2(),
  dep2SecondExport: dep2SecondExport,
  name: "moduleES6WithTSImport"
};