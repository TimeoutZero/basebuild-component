'use strict';
const gutil           = require('gulp-util');
let basebuildMainFile = '../scripts/main.js';

let options = {
  modules : {
    gulp : {
      uses: '../demo/node_modules/gulp'
    }
  }
};

if(gutil.env.prod){
  options.modules.gulp.uses  = 'gulp';
  basebuildMainFile          = 'basebuild-component';
}

require(basebuildMainFile)(options);