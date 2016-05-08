'use strict';

const chalk = require('chalk');
const _     = require('lodash');

module.exports = basebuildMainScript;

function basebuildMainScript(options){

  let packageJSON = require('../package.json');

  console.log(" _                    _           _ _     _                                                        _"    );
  console.log("| |__   __ _ ___  ___| |__  _   _(_) | __| |       ___ ___  _ __ ___  _ __   ___  _ __   ___ _ __ | |_ " );
  console.log("| '_ \\ / _` / __|/ _ \\ '_ \\| | | | | |/ _` |_____ / __/ _ \\| '_ ` _ \\| '_ \\ / _ \\| '_ \\ / _ \\ '_ \\| __|" );
  console.log("| |_) | (_| \\__ \\  __/ |_) | |_| | | | (_| |_____| (_| (_) | | | | | | |_) | (_) | | | |  __/ | | | |_"  );
  console.log("|_.__/ \\__,_|___ \\___|_.__/ \\__,_|_|_ \\__,_|      \\__ \\___/|_| |_| |_| .__/ \\___/|_| |_ \\___|_| |_ \\__|" );
  console.log("                                                                     |_|   " + chalk.green('v' + packageJSON.version) );
  console.log('\n\n');

  console.log( chalk.bgBlue('This module is under development, a beta version will be available soon ;)') );
  console.log('\n\n');

  let defaults = require('./defaults.js')();
  _.defaultsDeep(options, defaults);


  for(let key in options.modules){
    let value      = options.modules[key].uses;
    let category   = chalk.green(' external ');
    let useMode    = '';

    !options.modules[key] && (options.modules[key] = {});
    let bbModule = options.modules[key];

    !bbModule.notStart ? (useMode = 'required') : (useMode = 'using');
    bbModule.requireName = value;

    if(defaults.modules[key] && value === defaults.modules[key].defaultValue && !bbModule.isExternal){
      category = chalk.cyan(' built-in ');
    } else {
      bbModule.isDefault  = false;
      bbModule.isExternal = true;
      bbModule.requireName = process.cwd() + "/" + value;
    }

    if(!bbModule.notStart && bbModule.isEnabled  !== false){
      let moduleFunction = require( bbModule.requireName );
      _.isFunction(moduleFunction) && moduleFunction(options);
    }

    !bbModule.notLogOnStart && bbModule.isEnabled  !== false && console.log( chalk.white( '[ basebuild-component ] ') + useMode + category + chalk.magenta(key) + ' module as ' + chalk.magenta(value) );
  }

  console.log('\n');
};

