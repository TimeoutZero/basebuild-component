/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {module.exports = process.env.COV
	  ? __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib-cov/mocha\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	  : __webpack_require__(2);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 1 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module, __dirname, global) {/*!
	 * mocha
	 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var escapeRe = __webpack_require__(4);
	var path = __webpack_require__(5);
	var reporters = __webpack_require__(6);
	var utils = __webpack_require__(11);

	/**
	 * Expose `Mocha`.
	 */

	exports = module.exports = Mocha;

	/**
	 * To require local UIs and reporters when running in node.
	 */

	if (!process.browser) {
	  var cwd = process.cwd();
	  module.paths.push(cwd, path.join(cwd, 'node_modules'));
	}

	/**
	 * Expose internals.
	 */

	exports.utils = utils;
	exports.interfaces = __webpack_require__(102);
	exports.reporters = reporters;
	exports.Runnable = __webpack_require__(107);
	exports.Context = __webpack_require__(114);
	exports.Runner = __webpack_require__(115);
	exports.Suite = __webpack_require__(104);
	exports.Hook = __webpack_require__(106);
	exports.Test = __webpack_require__(109);

	/**
	 * Return image `name` path.
	 *
	 * @api private
	 * @param {string} name
	 * @return {string}
	 */
	function image(name) {
	  return path.join(__dirname, '../images', name + '.png');
	}

	/**
	 * Set up mocha with `options`.
	 *
	 * Options:
	 *
	 *   - `ui` name "bdd", "tdd", "exports" etc
	 *   - `reporter` reporter instance, defaults to `mocha.reporters.spec`
	 *   - `globals` array of accepted globals
	 *   - `timeout` timeout in milliseconds
	 *   - `retries` number of times to retry failed tests
	 *   - `bail` bail on the first test failure
	 *   - `slow` milliseconds to wait before considering a test slow
	 *   - `ignoreLeaks` ignore global leaks
	 *   - `fullTrace` display the full stack-trace on failing
	 *   - `grep` string or regexp to filter tests with
	 *
	 * @param {Object} options
	 * @api public
	 */
	function Mocha(options) {
	  options = options || {};
	  this.files = [];
	  this.options = options;
	  if (options.grep) {
	    this.grep(new RegExp(options.grep));
	  }
	  if (options.fgrep) {
	    this.grep(options.fgrep);
	  }
	  this.suite = new exports.Suite('', new exports.Context());
	  this.ui(options.ui);
	  this.bail(options.bail);
	  this.reporter(options.reporter, options.reporterOptions);
	  if (typeof options.timeout !== 'undefined' && options.timeout !== null) {
	    this.timeout(options.timeout);
	  }
	  if (typeof options.retries !== 'undefined' && options.retries !== null) {
	    this.retries(options.retries);
	  }
	  this.useColors(options.useColors);
	  if (options.enableTimeouts !== null) {
	    this.enableTimeouts(options.enableTimeouts);
	  }
	  if (options.slow) {
	    this.slow(options.slow);
	  }

	  this.suite.on('pre-require', function(context) {
	    exports.afterEach = context.afterEach || context.teardown;
	    exports.after = context.after || context.suiteTeardown;
	    exports.beforeEach = context.beforeEach || context.setup;
	    exports.before = context.before || context.suiteSetup;
	    exports.describe = context.describe || context.suite;
	    exports.it = context.it || context.test;
	    exports.setup = context.setup || context.beforeEach;
	    exports.suiteSetup = context.suiteSetup || context.before;
	    exports.suiteTeardown = context.suiteTeardown || context.after;
	    exports.suite = context.suite || context.describe;
	    exports.teardown = context.teardown || context.afterEach;
	    exports.test = context.test || context.it;
	    exports.run = context.run;
	  });
	}

	/**
	 * Enable or disable bailing on the first failure.
	 *
	 * @api public
	 * @param {boolean} [bail]
	 */
	Mocha.prototype.bail = function(bail) {
	  if (!arguments.length) {
	    bail = true;
	  }
	  this.suite.bail(bail);
	  return this;
	};

	/**
	 * Add test `file`.
	 *
	 * @api public
	 * @param {string} file
	 */
	Mocha.prototype.addFile = function(file) {
	  this.files.push(file);
	  return this;
	};

	/**
	 * Set reporter to `reporter`, defaults to "spec".
	 *
	 * @param {String|Function} reporter name or constructor
	 * @param {Object} reporterOptions optional options
	 * @api public
	 * @param {string|Function} reporter name or constructor
	 * @param {Object} reporterOptions optional options
	 */
	Mocha.prototype.reporter = function(reporter, reporterOptions) {
	  if (typeof reporter === 'function') {
	    this._reporter = reporter;
	  } else {
	    reporter = reporter || 'spec';
	    var _reporter;
	    // Try to load a built-in reporter.
	    if (reporters[reporter]) {
	      _reporter = reporters[reporter];
	    }
	    // Try to load reporters from process.cwd() and node_modules
	    if (!_reporter) {
	      try {
	        _reporter = __webpack_require__(116)(reporter);
	      } catch (err) {
	        err.message.indexOf('Cannot find module') !== -1
	          ? console.warn('"' + reporter + '" reporter not found')
	          : console.warn('"' + reporter + '" reporter blew up with error:\n' + err.stack);
	      }
	    }
	    if (!_reporter && reporter === 'teamcity') {
	      console.warn('The Teamcity reporter was moved to a package named '
	        + 'mocha-teamcity-reporter '
	        + '(https://npmjs.org/package/mocha-teamcity-reporter).');
	    }
	    if (!_reporter) {
	      throw new Error('invalid reporter "' + reporter + '"');
	    }
	    this._reporter = _reporter;
	  }
	  this.options.reporterOptions = reporterOptions;
	  return this;
	};

	/**
	 * Set test UI `name`, defaults to "bdd".
	 *
	 * @api public
	 * @param {string} bdd
	 */
	Mocha.prototype.ui = function(name) {
	  name = name || 'bdd';
	  this._ui = exports.interfaces[name];
	  if (!this._ui) {
	    try {
	      this._ui = __webpack_require__(116)(name);
	    } catch (err) {
	      throw new Error('invalid interface "' + name + '"');
	    }
	  }
	  this._ui = this._ui(this.suite);
	  return this;
	};

	/**
	 * Load registered files.
	 *
	 * @api private
	 */
	Mocha.prototype.loadFiles = function(fn) {
	  var self = this;
	  var suite = this.suite;
	  this.files.forEach(function(file) {
	    file = path.resolve(file);
	    suite.emit('pre-require', global, file, self);
	    suite.emit('require', __webpack_require__(116)(file), file, self);
	    suite.emit('post-require', global, file, self);
	  });
	  fn && fn();
	};

	/**
	 * Enable growl support.
	 *
	 * @api private
	 */
	Mocha.prototype._growl = function(runner, reporter) {
	  var notify = __webpack_require__(122);

	  runner.on('end', function() {
	    var stats = reporter.stats;
	    if (stats.failures) {
	      var msg = stats.failures + ' of ' + runner.total + ' tests failed';
	      notify(msg, { name: 'mocha', title: 'Failed', image: image('error') });
	    } else {
	      notify(stats.passes + ' tests passed in ' + stats.duration + 'ms', {
	        name: 'mocha',
	        title: 'Passed',
	        image: image('ok')
	      });
	    }
	  });
	};

	/**
	 * Add regexp to grep, if `re` is a string it is escaped.
	 *
	 * @param {RegExp|String} re
	 * @return {Mocha}
	 * @api public
	 * @param {RegExp|string} re
	 * @return {Mocha}
	 */
	Mocha.prototype.grep = function(re) {
	  this.options.grep = typeof re === 'string' ? new RegExp(escapeRe(re)) : re;
	  return this;
	};

	/**
	 * Invert `.grep()` matches.
	 *
	 * @return {Mocha}
	 * @api public
	 */
	Mocha.prototype.invert = function() {
	  this.options.invert = true;
	  return this;
	};

	/**
	 * Ignore global leaks.
	 *
	 * @param {Boolean} ignore
	 * @return {Mocha}
	 * @api public
	 * @param {boolean} ignore
	 * @return {Mocha}
	 */
	Mocha.prototype.ignoreLeaks = function(ignore) {
	  this.options.ignoreLeaks = Boolean(ignore);
	  return this;
	};

	/**
	 * Enable global leak checking.
	 *
	 * @return {Mocha}
	 * @api public
	 */
	Mocha.prototype.checkLeaks = function() {
	  this.options.ignoreLeaks = false;
	  return this;
	};

	/**
	 * Display long stack-trace on failing
	 *
	 * @return {Mocha}
	 * @api public
	 */
	Mocha.prototype.fullTrace = function() {
	  this.options.fullStackTrace = true;
	  return this;
	};

	/**
	 * Enable growl support.
	 *
	 * @return {Mocha}
	 * @api public
	 */
	Mocha.prototype.growl = function() {
	  this.options.growl = true;
	  return this;
	};

	/**
	 * Ignore `globals` array or string.
	 *
	 * @param {Array|String} globals
	 * @return {Mocha}
	 * @api public
	 * @param {Array|string} globals
	 * @return {Mocha}
	 */
	Mocha.prototype.globals = function(globals) {
	  this.options.globals = (this.options.globals || []).concat(globals);
	  return this;
	};

	/**
	 * Emit color output.
	 *
	 * @param {Boolean} colors
	 * @return {Mocha}
	 * @api public
	 * @param {boolean} colors
	 * @return {Mocha}
	 */
	Mocha.prototype.useColors = function(colors) {
	  if (colors !== undefined) {
	    this.options.useColors = colors;
	  }
	  return this;
	};

	/**
	 * Use inline diffs rather than +/-.
	 *
	 * @param {Boolean} inlineDiffs
	 * @return {Mocha}
	 * @api public
	 * @param {boolean} inlineDiffs
	 * @return {Mocha}
	 */
	Mocha.prototype.useInlineDiffs = function(inlineDiffs) {
	  this.options.useInlineDiffs = inlineDiffs !== undefined && inlineDiffs;
	  return this;
	};

	/**
	 * Set the timeout in milliseconds.
	 *
	 * @param {Number} timeout
	 * @return {Mocha}
	 * @api public
	 * @param {number} timeout
	 * @return {Mocha}
	 */
	Mocha.prototype.timeout = function(timeout) {
	  this.suite.timeout(timeout);
	  return this;
	};

	/**
	 * Set the number of times to retry failed tests.
	 *
	 * @param {Number} retry times
	 * @return {Mocha}
	 * @api public
	 */
	Mocha.prototype.retries = function(n) {
	  this.suite.retries(n);
	  return this;
	};

	/**
	 * Set slowness threshold in milliseconds.
	 *
	 * @param {Number} slow
	 * @return {Mocha}
	 * @api public
	 * @param {number} slow
	 * @return {Mocha}
	 */
	Mocha.prototype.slow = function(slow) {
	  this.suite.slow(slow);
	  return this;
	};

	/**
	 * Enable timeouts.
	 *
	 * @param {Boolean} enabled
	 * @return {Mocha}
	 * @api public
	 * @param {boolean} enabled
	 * @return {Mocha}
	 */
	Mocha.prototype.enableTimeouts = function(enabled) {
	  this.suite.enableTimeouts(arguments.length && enabled !== undefined ? enabled : true);
	  return this;
	};

	/**
	 * Makes all tests async (accepting a callback)
	 *
	 * @return {Mocha}
	 * @api public
	 */
	Mocha.prototype.asyncOnly = function() {
	  this.options.asyncOnly = true;
	  return this;
	};

	/**
	 * Disable syntax highlighting (in browser).
	 *
	 * @api public
	 */
	Mocha.prototype.noHighlighting = function() {
	  this.options.noHighlighting = true;
	  return this;
	};

	/**
	 * Enable uncaught errors to propagate (in browser).
	 *
	 * @return {Mocha}
	 * @api public
	 */
	Mocha.prototype.allowUncaught = function() {
	  this.options.allowUncaught = true;
	  return this;
	};

	/**
	 * Delay root suite execution.
	 * @returns {Mocha}
	 */
	Mocha.prototype.delay = function delay() {
	  this.options.delay = true;
	  return this;
	};

	/**
	 * Run tests and invoke `fn()` when complete.
	 *
	 * @api public
	 * @param {Function} fn
	 * @return {Runner}
	 */
	Mocha.prototype.run = function(fn) {
	  if (this.files.length) {
	    this.loadFiles();
	  }
	  var suite = this.suite;
	  var options = this.options;
	  options.files = this.files;
	  var runner = new exports.Runner(suite, options.delay);
	  var reporter = new this._reporter(runner, options);
	  runner.ignoreLeaks = options.ignoreLeaks !== false;
	  runner.fullStackTrace = options.fullStackTrace;
	  runner.asyncOnly = options.asyncOnly;
	  runner.allowUncaught = options.allowUncaught;
	  if (options.grep) {
	    runner.grep(options.grep, options.invert);
	  }
	  if (options.globals) {
	    runner.globals(options.globals);
	  }
	  if (options.growl) {
	    this._growl(runner, reporter);
	  }
	  if (options.useColors !== undefined) {
	    exports.reporters.Base.useColors = options.useColors;
	  }
	  exports.reporters.Base.inlineDiffs = options.useInlineDiffs;

	  function done(failures) {
	    if (reporter.done) {
	      reporter.done(failures, fn);
	    } else {
	      fn && fn(failures);
	    }
	  }

	  return runner.run(done);
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3)(module), "/", (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

	module.exports = function (str) {
		if (typeof str !== 'string') {
			throw new TypeError('Expected a string');
		}

		return str.replace(matchOperatorsRe,  '\\$&');
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}

	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// Alias exports to a their normalized format Mocha#reporter to prevent a need
	// for dynamic (try/catch) requires, which Browserify doesn't handle.
	exports.Base = exports.base = __webpack_require__(7);
	exports.Dot = exports.dot = __webpack_require__(38);
	exports.Doc = exports.doc = __webpack_require__(39);
	exports.TAP = exports.tap = __webpack_require__(40);
	exports.JSON = exports.json = __webpack_require__(41);
	exports.HTML = exports.html = __webpack_require__(42);
	exports.List = exports.list = __webpack_require__(44);
	exports.Min = exports.min = __webpack_require__(45);
	exports.Spec = exports.spec = __webpack_require__(46);
	exports.Nyan = exports.nyan = __webpack_require__(47);
	exports.XUnit = exports.xunit = __webpack_require__(48);
	exports.Markdown = exports.markdown = __webpack_require__(50);
	exports.Progress = exports.progress = __webpack_require__(51);
	exports.Landing = exports.landing = __webpack_require__(52);
	exports.JSONCov = exports['json-cov'] = __webpack_require__(53);
	exports.HTMLCov = exports['html-cov'] = __webpack_require__(54);
	exports.JSONStream = exports['json-stream'] = __webpack_require__(101);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {/**
	 * Module dependencies.
	 */

	var tty = __webpack_require__(8);
	var diff = __webpack_require__(9);
	var ms = __webpack_require__(10);
	var utils = __webpack_require__(11);
	var supportsColor = process.browser ? null : __webpack_require__(37);

	/**
	 * Expose `Base`.
	 */

	exports = module.exports = Base;

	/**
	 * Save timer references to avoid Sinon interfering.
	 * See: https://github.com/mochajs/mocha/issues/237
	 */

	/* eslint-disable no-unused-vars, no-native-reassign */
	var Date = global.Date;
	var setTimeout = global.setTimeout;
	var setInterval = global.setInterval;
	var clearTimeout = global.clearTimeout;
	var clearInterval = global.clearInterval;
	/* eslint-enable no-unused-vars, no-native-reassign */

	/**
	 * Check if both stdio streams are associated with a tty.
	 */

	var isatty = tty.isatty(1) && tty.isatty(2);

	/**
	 * Enable coloring by default, except in the browser interface.
	 */

	exports.useColors = !process.browser && (supportsColor || (process.env.MOCHA_COLORS !== undefined));

	/**
	 * Inline diffs instead of +/-
	 */

	exports.inlineDiffs = false;

	/**
	 * Default color map.
	 */

	exports.colors = {
	  pass: 90,
	  fail: 31,
	  'bright pass': 92,
	  'bright fail': 91,
	  'bright yellow': 93,
	  pending: 36,
	  suite: 0,
	  'error title': 0,
	  'error message': 31,
	  'error stack': 90,
	  checkmark: 32,
	  fast: 90,
	  medium: 33,
	  slow: 31,
	  green: 32,
	  light: 90,
	  'diff gutter': 90,
	  'diff added': 32,
	  'diff removed': 31
	};

	/**
	 * Default symbol map.
	 */

	exports.symbols = {
	  ok: '✓',
	  err: '✖',
	  dot: '․'
	};

	// With node.js on Windows: use symbols available in terminal default fonts
	if (process.platform === 'win32') {
	  exports.symbols.ok = '\u221A';
	  exports.symbols.err = '\u00D7';
	  exports.symbols.dot = '.';
	}

	/**
	 * Color `str` with the given `type`,
	 * allowing colors to be disabled,
	 * as well as user-defined color
	 * schemes.
	 *
	 * @param {string} type
	 * @param {string} str
	 * @return {string}
	 * @api private
	 */
	var color = exports.color = function(type, str) {
	  if (!exports.useColors) {
	    return String(str);
	  }
	  return '\u001b[' + exports.colors[type] + 'm' + str + '\u001b[0m';
	};

	/**
	 * Expose term window size, with some defaults for when stderr is not a tty.
	 */

	exports.window = {
	  width: 75
	};

	if (isatty) {
	  exports.window.width = process.stdout.getWindowSize
	      ? process.stdout.getWindowSize(1)[0]
	      : tty.getWindowSize()[1];
	}

	/**
	 * Expose some basic cursor interactions that are common among reporters.
	 */

	exports.cursor = {
	  hide: function() {
	    isatty && process.stdout.write('\u001b[?25l');
	  },

	  show: function() {
	    isatty && process.stdout.write('\u001b[?25h');
	  },

	  deleteLine: function() {
	    isatty && process.stdout.write('\u001b[2K');
	  },

	  beginningOfLine: function() {
	    isatty && process.stdout.write('\u001b[0G');
	  },

	  CR: function() {
	    if (isatty) {
	      exports.cursor.deleteLine();
	      exports.cursor.beginningOfLine();
	    } else {
	      process.stdout.write('\r');
	    }
	  }
	};

	/**
	 * Outut the given `failures` as a list.
	 *
	 * @param {Array} failures
	 * @api public
	 */

	exports.list = function(failures) {
	  console.log();
	  failures.forEach(function(test, i) {
	    // format
	    var fmt = color('error title', '  %s) %s:\n')
	      + color('error message', '     %s')
	      + color('error stack', '\n%s\n');

	    // msg
	    var msg;
	    var err = test.err;
	    var message;
	    if (err.message) {
	      message = err.message;
	    } else if (typeof err.inspect === 'function') {
	      message = err.inspect() + '';
	    } else {
	      message = '';
	    }
	    var stack = err.stack || message;
	    var index = stack.indexOf(message);
	    var actual = err.actual;
	    var expected = err.expected;
	    var escape = true;

	    if (index === -1) {
	      msg = message;
	    } else {
	      index += message.length;
	      msg = stack.slice(0, index);
	      // remove msg from stack
	      stack = stack.slice(index + 1);
	    }

	    // uncaught
	    if (err.uncaught) {
	      msg = 'Uncaught ' + msg;
	    }
	    // explicitly show diff
	    if (err.showDiff !== false && sameType(actual, expected) && expected !== undefined) {
	      escape = false;
	      if (!(utils.isString(actual) && utils.isString(expected))) {
	        err.actual = actual = utils.stringify(actual);
	        err.expected = expected = utils.stringify(expected);
	      }

	      fmt = color('error title', '  %s) %s:\n%s') + color('error stack', '\n%s\n');
	      var match = message.match(/^([^:]+): expected/);
	      msg = '\n      ' + color('error message', match ? match[1] : msg);

	      if (exports.inlineDiffs) {
	        msg += inlineDiff(err, escape);
	      } else {
	        msg += unifiedDiff(err, escape);
	      }
	    }

	    // indent stack trace
	    stack = stack.replace(/^/gm, '  ');

	    console.log(fmt, (i + 1), test.fullTitle(), msg, stack);
	  });
	};

	/**
	 * Initialize a new `Base` reporter.
	 *
	 * All other reporters generally
	 * inherit from this reporter, providing
	 * stats such as test duration, number
	 * of tests passed / failed etc.
	 *
	 * @param {Runner} runner
	 * @api public
	 */

	function Base(runner) {
	  var stats = this.stats = { suites: 0, tests: 0, passes: 0, pending: 0, failures: 0 };
	  var failures = this.failures = [];

	  if (!runner) {
	    return;
	  }
	  this.runner = runner;

	  runner.stats = stats;

	  runner.on('start', function() {
	    stats.start = new Date();
	  });

	  runner.on('suite', function(suite) {
	    stats.suites = stats.suites || 0;
	    suite.root || stats.suites++;
	  });

	  runner.on('test end', function() {
	    stats.tests = stats.tests || 0;
	    stats.tests++;
	  });

	  runner.on('pass', function(test) {
	    stats.passes = stats.passes || 0;

	    if (test.duration > test.slow()) {
	      test.speed = 'slow';
	    } else if (test.duration > test.slow() / 2) {
	      test.speed = 'medium';
	    } else {
	      test.speed = 'fast';
	    }

	    stats.passes++;
	  });

	  runner.on('fail', function(test, err) {
	    stats.failures = stats.failures || 0;
	    stats.failures++;
	    test.err = err;
	    failures.push(test);
	  });

	  runner.on('end', function() {
	    stats.end = new Date();
	    stats.duration = new Date() - stats.start;
	  });

	  runner.on('pending', function() {
	    stats.pending++;
	  });
	}

	/**
	 * Output common epilogue used by many of
	 * the bundled reporters.
	 *
	 * @api public
	 */
	Base.prototype.epilogue = function() {
	  var stats = this.stats;
	  var fmt;

	  console.log();

	  // passes
	  fmt = color('bright pass', ' ')
	    + color('green', ' %d passing')
	    + color('light', ' (%s)');

	  console.log(fmt,
	    stats.passes || 0,
	    ms(stats.duration));

	  // pending
	  if (stats.pending) {
	    fmt = color('pending', ' ')
	      + color('pending', ' %d pending');

	    console.log(fmt, stats.pending);
	  }

	  // failures
	  if (stats.failures) {
	    fmt = color('fail', '  %d failing');

	    console.log(fmt, stats.failures);

	    Base.list(this.failures);
	    console.log();
	  }

	  console.log();
	};

	/**
	 * Pad the given `str` to `len`.
	 *
	 * @api private
	 * @param {string} str
	 * @param {string} len
	 * @return {string}
	 */
	function pad(str, len) {
	  str = String(str);
	  return Array(len - str.length + 1).join(' ') + str;
	}

	/**
	 * Returns an inline diff between 2 strings with coloured ANSI output
	 *
	 * @api private
	 * @param {Error} err with actual/expected
	 * @param {boolean} escape
	 * @return {string} Diff
	 */
	function inlineDiff(err, escape) {
	  var msg = errorDiff(err, 'WordsWithSpace', escape);

	  // linenos
	  var lines = msg.split('\n');
	  if (lines.length > 4) {
	    var width = String(lines.length).length;
	    msg = lines.map(function(str, i) {
	      return pad(++i, width) + ' |' + ' ' + str;
	    }).join('\n');
	  }

	  // legend
	  msg = '\n'
	    + color('diff removed', 'actual')
	    + ' '
	    + color('diff added', 'expected')
	    + '\n\n'
	    + msg
	    + '\n';

	  // indent
	  msg = msg.replace(/^/gm, '      ');
	  return msg;
	}

	/**
	 * Returns a unified diff between two strings.
	 *
	 * @api private
	 * @param {Error} err with actual/expected
	 * @param {boolean} escape
	 * @return {string} The diff.
	 */
	function unifiedDiff(err, escape) {
	  var indent = '      ';
	  function cleanUp(line) {
	    if (escape) {
	      line = escapeInvisibles(line);
	    }
	    if (line[0] === '+') {
	      return indent + colorLines('diff added', line);
	    }
	    if (line[0] === '-') {
	      return indent + colorLines('diff removed', line);
	    }
	    if (line.match(/\@\@/)) {
	      return null;
	    }
	    if (line.match(/\\ No newline/)) {
	      return null;
	    }
	    return indent + line;
	  }
	  function notBlank(line) {
	    return typeof line !== 'undefined' && line !== null;
	  }
	  var msg = diff.createPatch('string', err.actual, err.expected);
	  var lines = msg.split('\n').splice(4);
	  return '\n      '
	    + colorLines('diff added', '+ expected') + ' '
	    + colorLines('diff removed', '- actual')
	    + '\n\n'
	    + lines.map(cleanUp).filter(notBlank).join('\n');
	}

	/**
	 * Return a character diff for `err`.
	 *
	 * @api private
	 * @param {Error} err
	 * @param {string} type
	 * @param {boolean} escape
	 * @return {string}
	 */
	function errorDiff(err, type, escape) {
	  var actual = escape ? escapeInvisibles(err.actual) : err.actual;
	  var expected = escape ? escapeInvisibles(err.expected) : err.expected;
	  return diff['diff' + type](actual, expected).map(function(str) {
	    if (str.added) {
	      return colorLines('diff added', str.value);
	    }
	    if (str.removed) {
	      return colorLines('diff removed', str.value);
	    }
	    return str.value;
	  }).join('');
	}

	/**
	 * Returns a string with all invisible characters in plain text
	 *
	 * @api private
	 * @param {string} line
	 * @return {string}
	 */
	function escapeInvisibles(line) {
	  return line.replace(/\t/g, '<tab>')
	    .replace(/\r/g, '<CR>')
	    .replace(/\n/g, '<LF>\n');
	}

	/**
	 * Color lines for `str`, using the color `name`.
	 *
	 * @api private
	 * @param {string} name
	 * @param {string} str
	 * @return {string}
	 */
	function colorLines(name, str) {
	  return str.split('\n').map(function(str) {
	    return color(name, str);
	  }).join('\n');
	}

	/**
	 * Object#toString reference.
	 */
	var objToString = Object.prototype.toString;

	/**
	 * Check that a / b have the same type.
	 *
	 * @api private
	 * @param {Object} a
	 * @param {Object} b
	 * @return {boolean}
	 */
	function sameType(a, b) {
	  return objToString.call(a) === objToString.call(b);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {exports.isatty = function isatty() {
	  return true;
	};

	exports.getWindowSize = function getWindowSize() {
	  if ('innerHeight' in global) {
	    return [global.innerHeight, global.innerWidth];
	  }
	  // In a Web Worker, the DOM Window is not available.
	  return [640, 480];
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* See LICENSE file for terms of use */

	/*
	 * Text diff implementation.
	 *
	 * This library supports the following APIS:
	 * JsDiff.diffChars: Character by character diff
	 * JsDiff.diffWords: Word (as defined by \b regex) diff which ignores whitespace
	 * JsDiff.diffLines: Line based diff
	 *
	 * JsDiff.diffCss: Diff targeted at CSS content
	 *
	 * These methods are based on the implementation proposed in
	 * "An O(ND) Difference Algorithm and its Variations" (Myers, 1986).
	 * http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.4.6927
	 */
	(function(global, undefined) {
	  var objectPrototypeToString = Object.prototype.toString;

	  /*istanbul ignore next*/
	  function map(arr, mapper, that) {
	    if (Array.prototype.map) {
	      return Array.prototype.map.call(arr, mapper, that);
	    }

	    var other = new Array(arr.length);

	    for (var i = 0, n = arr.length; i < n; i++) {
	      other[i] = mapper.call(that, arr[i], i, arr);
	    }
	    return other;
	  }
	  function clonePath(path) {
	    return { newPos: path.newPos, components: path.components.slice(0) };
	  }
	  function removeEmpty(array) {
	    var ret = [];
	    for (var i = 0; i < array.length; i++) {
	      if (array[i]) {
	        ret.push(array[i]);
	      }
	    }
	    return ret;
	  }
	  function escapeHTML(s) {
	    var n = s;
	    n = n.replace(/&/g, '&amp;');
	    n = n.replace(/</g, '&lt;');
	    n = n.replace(/>/g, '&gt;');
	    n = n.replace(/"/g, '&quot;');

	    return n;
	  }

	  // This function handles the presence of circular references by bailing out when encountering an
	  // object that is already on the "stack" of items being processed.
	  function canonicalize(obj, stack, replacementStack) {
	    stack = stack || [];
	    replacementStack = replacementStack || [];

	    var i;

	    for (i = 0; i < stack.length; i += 1) {
	      if (stack[i] === obj) {
	        return replacementStack[i];
	      }
	    }

	    var canonicalizedObj;

	    if ('[object Array]' === objectPrototypeToString.call(obj)) {
	      stack.push(obj);
	      canonicalizedObj = new Array(obj.length);
	      replacementStack.push(canonicalizedObj);
	      for (i = 0; i < obj.length; i += 1) {
	        canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack);
	      }
	      stack.pop();
	      replacementStack.pop();
	    } else if (typeof obj === 'object' && obj !== null) {
	      stack.push(obj);
	      canonicalizedObj = {};
	      replacementStack.push(canonicalizedObj);
	      var sortedKeys = [],
	          key;
	      for (key in obj) {
	        sortedKeys.push(key);
	      }
	      sortedKeys.sort();
	      for (i = 0; i < sortedKeys.length; i += 1) {
	        key = sortedKeys[i];
	        canonicalizedObj[key] = canonicalize(obj[key], stack, replacementStack);
	      }
	      stack.pop();
	      replacementStack.pop();
	    } else {
	      canonicalizedObj = obj;
	    }
	    return canonicalizedObj;
	  }

	  function buildValues(components, newString, oldString, useLongestToken) {
	    var componentPos = 0,
	        componentLen = components.length,
	        newPos = 0,
	        oldPos = 0;

	    for (; componentPos < componentLen; componentPos++) {
	      var component = components[componentPos];
	      if (!component.removed) {
	        if (!component.added && useLongestToken) {
	          var value = newString.slice(newPos, newPos + component.count);
	          value = map(value, function(value, i) {
	            var oldValue = oldString[oldPos + i];
	            return oldValue.length > value.length ? oldValue : value;
	          });

	          component.value = value.join('');
	        } else {
	          component.value = newString.slice(newPos, newPos + component.count).join('');
	        }
	        newPos += component.count;

	        // Common case
	        if (!component.added) {
	          oldPos += component.count;
	        }
	      } else {
	        component.value = oldString.slice(oldPos, oldPos + component.count).join('');
	        oldPos += component.count;

	        // Reverse add and remove so removes are output first to match common convention
	        // The diffing algorithm is tied to add then remove output and this is the simplest
	        // route to get the desired output with minimal overhead.
	        if (componentPos && components[componentPos - 1].added) {
	          var tmp = components[componentPos - 1];
	          components[componentPos - 1] = components[componentPos];
	          components[componentPos] = tmp;
	        }
	      }
	    }

	    return components;
	  }

	  function Diff(ignoreWhitespace) {
	    this.ignoreWhitespace = ignoreWhitespace;
	  }
	  Diff.prototype = {
	    diff: function(oldString, newString, callback) {
	      var self = this;

	      function done(value) {
	        if (callback) {
	          setTimeout(function() { callback(undefined, value); }, 0);
	          return true;
	        } else {
	          return value;
	        }
	      }

	      // Handle the identity case (this is due to unrolling editLength == 0
	      if (newString === oldString) {
	        return done([{ value: newString }]);
	      }
	      if (!newString) {
	        return done([{ value: oldString, removed: true }]);
	      }
	      if (!oldString) {
	        return done([{ value: newString, added: true }]);
	      }

	      newString = this.tokenize(newString);
	      oldString = this.tokenize(oldString);

	      var newLen = newString.length, oldLen = oldString.length;
	      var editLength = 1;
	      var maxEditLength = newLen + oldLen;
	      var bestPath = [{ newPos: -1, components: [] }];

	      // Seed editLength = 0, i.e. the content starts with the same values
	      var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);
	      if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
	        // Identity per the equality and tokenizer
	        return done([{value: newString.join('')}]);
	      }

	      // Main worker method. checks all permutations of a given edit length for acceptance.
	      function execEditLength() {
	        for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
	          var basePath;
	          var addPath = bestPath[diagonalPath - 1],
	              removePath = bestPath[diagonalPath + 1],
	              oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;
	          if (addPath) {
	            // No one else is going to attempt to use this value, clear it
	            bestPath[diagonalPath - 1] = undefined;
	          }

	          var canAdd = addPath && addPath.newPos + 1 < newLen,
	              canRemove = removePath && 0 <= oldPos && oldPos < oldLen;
	          if (!canAdd && !canRemove) {
	            // If this path is a terminal then prune
	            bestPath[diagonalPath] = undefined;
	            continue;
	          }

	          // Select the diagonal that we want to branch from. We select the prior
	          // path whose position in the new string is the farthest from the origin
	          // and does not pass the bounds of the diff graph
	          if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
	            basePath = clonePath(removePath);
	            self.pushComponent(basePath.components, undefined, true);
	          } else {
	            basePath = addPath;   // No need to clone, we've pulled it from the list
	            basePath.newPos++;
	            self.pushComponent(basePath.components, true, undefined);
	          }

	          oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath);

	          // If we have hit the end of both strings, then we are done
	          if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
	            return done(buildValues(basePath.components, newString, oldString, self.useLongestToken));
	          } else {
	            // Otherwise track this path as a potential candidate and continue.
	            bestPath[diagonalPath] = basePath;
	          }
	        }

	        editLength++;
	      }

	      // Performs the length of edit iteration. Is a bit fugly as this has to support the
	      // sync and async mode which is never fun. Loops over execEditLength until a value
	      // is produced.
	      if (callback) {
	        (function exec() {
	          setTimeout(function() {
	            // This should not happen, but we want to be safe.
	            /*istanbul ignore next */
	            if (editLength > maxEditLength) {
	              return callback();
	            }

	            if (!execEditLength()) {
	              exec();
	            }
	          }, 0);
	        }());
	      } else {
	        while (editLength <= maxEditLength) {
	          var ret = execEditLength();
	          if (ret) {
	            return ret;
	          }
	        }
	      }
	    },

	    pushComponent: function(components, added, removed) {
	      var last = components[components.length - 1];
	      if (last && last.added === added && last.removed === removed) {
	        // We need to clone here as the component clone operation is just
	        // as shallow array clone
	        components[components.length - 1] = {count: last.count + 1, added: added, removed: removed };
	      } else {
	        components.push({count: 1, added: added, removed: removed });
	      }
	    },
	    extractCommon: function(basePath, newString, oldString, diagonalPath) {
	      var newLen = newString.length,
	          oldLen = oldString.length,
	          newPos = basePath.newPos,
	          oldPos = newPos - diagonalPath,

	          commonCount = 0;
	      while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
	        newPos++;
	        oldPos++;
	        commonCount++;
	      }

	      if (commonCount) {
	        basePath.components.push({count: commonCount});
	      }

	      basePath.newPos = newPos;
	      return oldPos;
	    },

	    equals: function(left, right) {
	      var reWhitespace = /\S/;
	      return left === right || (this.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right));
	    },
	    tokenize: function(value) {
	      return value.split('');
	    }
	  };

	  var CharDiff = new Diff();

	  var WordDiff = new Diff(true);
	  var WordWithSpaceDiff = new Diff();
	  WordDiff.tokenize = WordWithSpaceDiff.tokenize = function(value) {
	    return removeEmpty(value.split(/(\s+|\b)/));
	  };

	  var CssDiff = new Diff(true);
	  CssDiff.tokenize = function(value) {
	    return removeEmpty(value.split(/([{}:;,]|\s+)/));
	  };

	  var LineDiff = new Diff();

	  var TrimmedLineDiff = new Diff();
	  TrimmedLineDiff.ignoreTrim = true;

	  LineDiff.tokenize = TrimmedLineDiff.tokenize = function(value) {
	    var retLines = [],
	        lines = value.split(/^/m);
	    for (var i = 0; i < lines.length; i++) {
	      var line = lines[i],
	          lastLine = lines[i - 1],
	          lastLineLastChar = lastLine && lastLine[lastLine.length - 1];

	      // Merge lines that may contain windows new lines
	      if (line === '\n' && lastLineLastChar === '\r') {
	          retLines[retLines.length - 1] = retLines[retLines.length - 1].slice(0, -1) + '\r\n';
	      } else {
	        if (this.ignoreTrim) {
	          line = line.trim();
	          // add a newline unless this is the last line.
	          if (i < lines.length - 1) {
	            line += '\n';
	          }
	        }
	        retLines.push(line);
	      }
	    }

	    return retLines;
	  };

	  var PatchDiff = new Diff();
	  PatchDiff.tokenize = function(value) {
	    var ret = [],
	        linesAndNewlines = value.split(/(\n|\r\n)/);

	    // Ignore the final empty token that occurs if the string ends with a new line
	    if (!linesAndNewlines[linesAndNewlines.length - 1]) {
	      linesAndNewlines.pop();
	    }

	    // Merge the content and line separators into single tokens
	    for (var i = 0; i < linesAndNewlines.length; i++) {
	      var line = linesAndNewlines[i];

	      if (i % 2) {
	        ret[ret.length - 1] += line;
	      } else {
	        ret.push(line);
	      }
	    }
	    return ret;
	  };

	  var SentenceDiff = new Diff();
	  SentenceDiff.tokenize = function(value) {
	    return removeEmpty(value.split(/(\S.+?[.!?])(?=\s+|$)/));
	  };

	  var JsonDiff = new Diff();
	  // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
	  // dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:
	  JsonDiff.useLongestToken = true;
	  JsonDiff.tokenize = LineDiff.tokenize;
	  JsonDiff.equals = function(left, right) {
	    return LineDiff.equals(left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'));
	  };

	  var JsDiff = {
	    Diff: Diff,

	    diffChars: function(oldStr, newStr, callback) { return CharDiff.diff(oldStr, newStr, callback); },
	    diffWords: function(oldStr, newStr, callback) { return WordDiff.diff(oldStr, newStr, callback); },
	    diffWordsWithSpace: function(oldStr, newStr, callback) { return WordWithSpaceDiff.diff(oldStr, newStr, callback); },
	    diffLines: function(oldStr, newStr, callback) { return LineDiff.diff(oldStr, newStr, callback); },
	    diffTrimmedLines: function(oldStr, newStr, callback) { return TrimmedLineDiff.diff(oldStr, newStr, callback); },

	    diffSentences: function(oldStr, newStr, callback) { return SentenceDiff.diff(oldStr, newStr, callback); },

	    diffCss: function(oldStr, newStr, callback) { return CssDiff.diff(oldStr, newStr, callback); },
	    diffJson: function(oldObj, newObj, callback) {
	      return JsonDiff.diff(
	        typeof oldObj === 'string' ? oldObj : JSON.stringify(canonicalize(oldObj), undefined, '  '),
	        typeof newObj === 'string' ? newObj : JSON.stringify(canonicalize(newObj), undefined, '  '),
	        callback
	      );
	    },

	    createTwoFilesPatch: function(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader) {
	      var ret = [];

	      if (oldFileName == newFileName) {
	        ret.push('Index: ' + oldFileName);
	      }
	      ret.push('===================================================================');
	      ret.push('--- ' + oldFileName + (typeof oldHeader === 'undefined' ? '' : '\t' + oldHeader));
	      ret.push('+++ ' + newFileName + (typeof newHeader === 'undefined' ? '' : '\t' + newHeader));

	      var diff = PatchDiff.diff(oldStr, newStr);
	      diff.push({value: '', lines: []});   // Append an empty value to make cleanup easier

	      // Formats a given set of lines for printing as context lines in a patch
	      function contextLines(lines) {
	        return map(lines, function(entry) { return ' ' + entry; });
	      }

	      // Outputs the no newline at end of file warning if needed
	      function eofNL(curRange, i, current) {
	        var last = diff[diff.length - 2],
	            isLast = i === diff.length - 2,
	            isLastOfType = i === diff.length - 3 && current.added !== last.added;

	        // Figure out if this is the last line for the given file and missing NL
	        if (!(/\n$/.test(current.value)) && (isLast || isLastOfType)) {
	          curRange.push('\\ No newline at end of file');
	        }
	      }

	      var oldRangeStart = 0, newRangeStart = 0, curRange = [],
	          oldLine = 1, newLine = 1;
	      for (var i = 0; i < diff.length; i++) {
	        var current = diff[i],
	            lines = current.lines || current.value.replace(/\n$/, '').split('\n');
	        current.lines = lines;

	        if (current.added || current.removed) {
	          // If we have previous context, start with that
	          if (!oldRangeStart) {
	            var prev = diff[i - 1];
	            oldRangeStart = oldLine;
	            newRangeStart = newLine;

	            if (prev) {
	              curRange = contextLines(prev.lines.slice(-4));
	              oldRangeStart -= curRange.length;
	              newRangeStart -= curRange.length;
	            }
	          }

	          // Output our changes
	          curRange.push.apply(curRange, map(lines, function(entry) {
	            return (current.added ? '+' : '-') + entry;
	          }));
	          eofNL(curRange, i, current);

	          // Track the updated file position
	          if (current.added) {
	            newLine += lines.length;
	          } else {
	            oldLine += lines.length;
	          }
	        } else {
	          // Identical context lines. Track line changes
	          if (oldRangeStart) {
	            // Close out any changes that have been output (or join overlapping)
	            if (lines.length <= 8 && i < diff.length - 2) {
	              // Overlapping
	              curRange.push.apply(curRange, contextLines(lines));
	            } else {
	              // end the range and output
	              var contextSize = Math.min(lines.length, 4);
	              ret.push(
	                  '@@ -' + oldRangeStart + ',' + (oldLine - oldRangeStart + contextSize)
	                  + ' +' + newRangeStart + ',' + (newLine - newRangeStart + contextSize)
	                  + ' @@');
	              ret.push.apply(ret, curRange);
	              ret.push.apply(ret, contextLines(lines.slice(0, contextSize)));
	              if (lines.length <= 4) {
	                eofNL(ret, i, current);
	              }

	              oldRangeStart = 0;
	              newRangeStart = 0;
	              curRange = [];
	            }
	          }
	          oldLine += lines.length;
	          newLine += lines.length;
	        }
	      }

	      return ret.join('\n') + '\n';
	    },

	    createPatch: function(fileName, oldStr, newStr, oldHeader, newHeader) {
	      return JsDiff.createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader);
	    },

	    applyPatch: function(oldStr, uniDiff) {
	      var diffstr = uniDiff.split('\n'),
	          hunks = [],
	          i = 0,
	          remEOFNL = false,
	          addEOFNL = false;

	      // Skip to the first change hunk
	      while (i < diffstr.length && !(/^@@/.test(diffstr[i]))) {
	        i++;
	      }

	      // Parse the unified diff
	      for (; i < diffstr.length; i++) {
	        if (diffstr[i][0] === '@') {
	          var chnukHeader = diffstr[i].split(/@@ -(\d+),(\d+) \+(\d+),(\d+) @@/);
	          hunks.unshift({
	            start: chnukHeader[3],
	            oldlength: +chnukHeader[2],
	            removed: [],
	            newlength: chnukHeader[4],
	            added: []
	          });
	        } else if (diffstr[i][0] === '+') {
	          hunks[0].added.push(diffstr[i].substr(1));
	        } else if (diffstr[i][0] === '-') {
	          hunks[0].removed.push(diffstr[i].substr(1));
	        } else if (diffstr[i][0] === ' ') {
	          hunks[0].added.push(diffstr[i].substr(1));
	          hunks[0].removed.push(diffstr[i].substr(1));
	        } else if (diffstr[i][0] === '\\') {
	          if (diffstr[i - 1][0] === '+') {
	            remEOFNL = true;
	          } else if (diffstr[i - 1][0] === '-') {
	            addEOFNL = true;
	          }
	        }
	      }

	      // Apply the diff to the input
	      var lines = oldStr.split('\n');
	      for (i = hunks.length - 1; i >= 0; i--) {
	        var hunk = hunks[i];
	        // Sanity check the input string. Bail if we don't match.
	        for (var j = 0; j < hunk.oldlength; j++) {
	          if (lines[hunk.start - 1 + j] !== hunk.removed[j]) {
	            return false;
	          }
	        }
	        Array.prototype.splice.apply(lines, [hunk.start - 1, hunk.oldlength].concat(hunk.added));
	      }

	      // Handle EOFNL insertion/removal
	      if (remEOFNL) {
	        while (!lines[lines.length - 1]) {
	          lines.pop();
	        }
	      } else if (addEOFNL) {
	        lines.push('');
	      }
	      return lines.join('\n');
	    },

	    convertChangesToXML: function(changes) {
	      var ret = [];
	      for (var i = 0; i < changes.length; i++) {
	        var change = changes[i];
	        if (change.added) {
	          ret.push('<ins>');
	        } else if (change.removed) {
	          ret.push('<del>');
	        }

	        ret.push(escapeHTML(change.value));

	        if (change.added) {
	          ret.push('</ins>');
	        } else if (change.removed) {
	          ret.push('</del>');
	        }
	      }
	      return ret.join('');
	    },

	    // See: http://code.google.com/p/google-diff-match-patch/wiki/API
	    convertChangesToDMP: function(changes) {
	      var ret = [],
	          change,
	          operation;
	      for (var i = 0; i < changes.length; i++) {
	        change = changes[i];
	        if (change.added) {
	          operation = 1;
	        } else if (change.removed) {
	          operation = -1;
	        } else {
	          operation = 0;
	        }

	        ret.push([operation, change.value]);
	      }
	      return ret;
	    },

	    canonicalize: canonicalize
	  };

	  /*istanbul ignore next */
	  /*global module */
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = JsDiff;
	  } else if (true) {
	    /*global define */
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() { return JsDiff; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof global.JsDiff === 'undefined') {
	    global.JsDiff = JsDiff;
	  }
	}(this));


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @api public
	 * @param {string|number} val
	 * @param {Object} options
	 * @return {string|number}
	 */
	module.exports = function(val, options) {
	  options = options || {};
	  if (typeof val === 'string') {
	    return parse(val);
	  }
	  // https://github.com/mochajs/mocha/pull/1035
	  return options['long'] ? longFormat(val) : shortFormat(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @api private
	 * @param {string} str
	 * @return {number}
	 */
	function parse(str) {
	  var match = (/^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i).exec(str);
	  if (!match) {
	    return;
	  }
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 's':
	      return n * s;
	    case 'ms':
	      return n;
	    default:
	      // No default case
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @api private
	 * @param {number} ms
	 * @return {string}
	 */
	function shortFormat(ms) {
	  if (ms >= d) {
	    return Math.round(ms / d) + 'd';
	  }
	  if (ms >= h) {
	    return Math.round(ms / h) + 'h';
	  }
	  if (ms >= m) {
	    return Math.round(ms / m) + 'm';
	  }
	  if (ms >= s) {
	    return Math.round(ms / s) + 's';
	  }
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @api private
	 * @param {number} ms
	 * @return {string}
	 */
	function longFormat(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 *
	 * @api private
	 * @param {number} ms
	 * @param {number} n
	 * @param {string} name
	 */
	function plural(ms, n, name) {
	  if (ms < n) {
	    return;
	  }
	  if (ms < n * 1.5) {
	    return Math.floor(ms / n) + ' ' + name;
	  }
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, process) {/* eslint-env browser */

	/**
	 * Module dependencies.
	 */

	var basename = __webpack_require__(5).basename;
	var debug = __webpack_require__(16)('mocha:watch');
	var exists = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).existsSync || __webpack_require__(5).existsSync;
	var glob = __webpack_require__(17);
	var join = __webpack_require__(5).join;
	var readdirSync = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readdirSync;
	var statSync = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).statSync;
	var watchFile = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).watchFile;

	/**
	 * Ignored directories.
	 */

	var ignore = ['node_modules', '.git'];

	exports.inherits = __webpack_require__(20).inherits;

	/**
	 * Escape special characters in the given string of html.
	 *
	 * @api private
	 * @param  {string} html
	 * @return {string}
	 */
	exports.escape = function(html) {
	  return String(html)
	    .replace(/&/g, '&amp;')
	    .replace(/"/g, '&quot;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;');
	};

	/**
	 * Array#forEach (<=IE8)
	 *
	 * @api private
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Object} scope
	 */
	exports.forEach = function(arr, fn, scope) {
	  for (var i = 0, l = arr.length; i < l; i++) {
	    fn.call(scope, arr[i], i);
	  }
	};

	/**
	 * Test if the given obj is type of string.
	 *
	 * @api private
	 * @param {Object} obj
	 * @return {boolean}
	 */
	exports.isString = function(obj) {
	  return typeof obj === 'string';
	};

	/**
	 * Array#map (<=IE8)
	 *
	 * @api private
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Object} scope
	 * @return {Array}
	 */
	exports.map = function(arr, fn, scope) {
	  var result = [];
	  for (var i = 0, l = arr.length; i < l; i++) {
	    result.push(fn.call(scope, arr[i], i, arr));
	  }
	  return result;
	};

	/**
	 * Array#indexOf (<=IE8)
	 *
	 * @api private
	 * @param {Array} arr
	 * @param {Object} obj to find index of
	 * @param {number} start
	 * @return {number}
	 */
	exports.indexOf = function(arr, obj, start) {
	  for (var i = start || 0, l = arr.length; i < l; i++) {
	    if (arr[i] === obj) {
	      return i;
	    }
	  }
	  return -1;
	};

	/**
	 * Array#reduce (<=IE8)
	 *
	 * @api private
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Object} val Initial value.
	 * @return {*}
	 */
	exports.reduce = function(arr, fn, val) {
	  var rval = val;

	  for (var i = 0, l = arr.length; i < l; i++) {
	    rval = fn(rval, arr[i], i, arr);
	  }

	  return rval;
	};

	/**
	 * Array#filter (<=IE8)
	 *
	 * @api private
	 * @param {Array} arr
	 * @param {Function} fn
	 * @return {Array}
	 */
	exports.filter = function(arr, fn) {
	  var ret = [];

	  for (var i = 0, l = arr.length; i < l; i++) {
	    var val = arr[i];
	    if (fn(val, i, arr)) {
	      ret.push(val);
	    }
	  }

	  return ret;
	};

	/**
	 * Object.keys (<=IE8)
	 *
	 * @api private
	 * @param {Object} obj
	 * @return {Array} keys
	 */
	exports.keys = typeof Object.keys === 'function' ? Object.keys : function(obj) {
	  var keys = [];
	  var has = Object.prototype.hasOwnProperty; // for `window` on <=IE8

	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      keys.push(key);
	    }
	  }

	  return keys;
	};

	/**
	 * Watch the given `files` for changes
	 * and invoke `fn(file)` on modification.
	 *
	 * @api private
	 * @param {Array} files
	 * @param {Function} fn
	 */
	exports.watch = function(files, fn) {
	  var options = { interval: 100 };
	  files.forEach(function(file) {
	    debug('file %s', file);
	    watchFile(file, options, function(curr, prev) {
	      if (prev.mtime < curr.mtime) {
	        fn(file);
	      }
	    });
	  });
	};

	/**
	 * Array.isArray (<=IE8)
	 *
	 * @api private
	 * @param {Object} obj
	 * @return {Boolean}
	 */
	var isArray = typeof Array.isArray === 'function' ? Array.isArray : function(obj) {
	  return Object.prototype.toString.call(obj) === '[object Array]';
	};

	exports.isArray = isArray;

	/**
	 * Buffer.prototype.toJSON polyfill.
	 *
	 * @type {Function}
	 */
	if (typeof Buffer !== 'undefined' && Buffer.prototype) {
	  Buffer.prototype.toJSON = Buffer.prototype.toJSON || function() {
	    return Array.prototype.slice.call(this, 0);
	  };
	}

	/**
	 * Ignored files.
	 *
	 * @api private
	 * @param {string} path
	 * @return {boolean}
	 */
	function ignored(path) {
	  return !~ignore.indexOf(path);
	}

	/**
	 * Lookup files in the given `dir`.
	 *
	 * @api private
	 * @param {string} dir
	 * @param {string[]} [ext=['.js']]
	 * @param {Array} [ret=[]]
	 * @return {Array}
	 */
	exports.files = function(dir, ext, ret) {
	  ret = ret || [];
	  ext = ext || ['js'];

	  var re = new RegExp('\\.(' + ext.join('|') + ')$');

	  readdirSync(dir)
	    .filter(ignored)
	    .forEach(function(path) {
	      path = join(dir, path);
	      if (statSync(path).isDirectory()) {
	        exports.files(path, ext, ret);
	      } else if (path.match(re)) {
	        ret.push(path);
	      }
	    });

	  return ret;
	};

	/**
	 * Compute a slug from the given `str`.
	 *
	 * @api private
	 * @param {string} str
	 * @return {string}
	 */
	exports.slug = function(str) {
	  return str
	    .toLowerCase()
	    .replace(/ +/g, '-')
	    .replace(/[^-\w]/g, '');
	};

	/**
	 * Strip the function definition from `str`, and re-indent for pre whitespace.
	 *
	 * @param {string} str
	 * @return {string}
	 */
	exports.clean = function(str) {
	  str = str
	    .replace(/\r\n?|[\n\u2028\u2029]/g, '\n').replace(/^\uFEFF/, '')
	    .replace(/^function *\(.*\)\s*\{|\(.*\) *=> *\{?/, '')
	    .replace(/\s+\}$/, '');

	  var spaces = str.match(/^\n?( *)/)[1].length;
	  var tabs = str.match(/^\n?(\t*)/)[1].length;
	  var re = new RegExp('^\n?' + (tabs ? '\t' : ' ') + '{' + (tabs ? tabs : spaces) + '}', 'gm');

	  str = str.replace(re, '');

	  return exports.trim(str);
	};

	/**
	 * Trim the given `str`.
	 *
	 * @api private
	 * @param {string} str
	 * @return {string}
	 */
	exports.trim = function(str) {
	  return str.replace(/^\s+|\s+$/g, '');
	};

	/**
	 * Parse the given `qs`.
	 *
	 * @api private
	 * @param {string} qs
	 * @return {Object}
	 */
	exports.parseQuery = function(qs) {
	  return exports.reduce(qs.replace('?', '').split('&'), function(obj, pair) {
	    var i = pair.indexOf('=');
	    var key = pair.slice(0, i);
	    var val = pair.slice(++i);

	    obj[key] = decodeURIComponent(val);
	    return obj;
	  }, {});
	};

	/**
	 * Highlight the given string of `js`.
	 *
	 * @api private
	 * @param {string} js
	 * @return {string}
	 */
	function highlight(js) {
	  return js
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
	    .replace(/('.*?')/gm, '<span class="string">$1</span>')
	    .replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
	    .replace(/(\d+)/gm, '<span class="number">$1</span>')
	    .replace(/\bnew[ \t]+(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
	    .replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>');
	}

	/**
	 * Highlight the contents of tag `name`.
	 *
	 * @api private
	 * @param {string} name
	 */
	exports.highlightTags = function(name) {
	  var code = document.getElementById('mocha').getElementsByTagName(name);
	  for (var i = 0, len = code.length; i < len; ++i) {
	    code[i].innerHTML = highlight(code[i].innerHTML);
	  }
	};

	/**
	 * If a value could have properties, and has none, this function is called,
	 * which returns a string representation of the empty value.
	 *
	 * Functions w/ no properties return `'[Function]'`
	 * Arrays w/ length === 0 return `'[]'`
	 * Objects w/ no properties return `'{}'`
	 * All else: return result of `value.toString()`
	 *
	 * @api private
	 * @param {*} value The value to inspect.
	 * @param {string} [type] The type of the value, if known.
	 * @returns {string}
	 */
	function emptyRepresentation(value, type) {
	  type = type || exports.type(value);

	  switch (type) {
	    case 'function':
	      return '[Function]';
	    case 'object':
	      return '{}';
	    case 'array':
	      return '[]';
	    default:
	      return value.toString();
	  }
	}

	/**
	 * Takes some variable and asks `Object.prototype.toString()` what it thinks it
	 * is.
	 *
	 * @api private
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
	 * @param {*} value The value to test.
	 * @returns {string}
	 * @example
	 * type({}) // 'object'
	 * type([]) // 'array'
	 * type(1) // 'number'
	 * type(false) // 'boolean'
	 * type(Infinity) // 'number'
	 * type(null) // 'null'
	 * type(new Date()) // 'date'
	 * type(/foo/) // 'regexp'
	 * type('type') // 'string'
	 * type(global) // 'global'
	 */
	exports.type = function type(value) {
	  if (value === undefined) {
	    return 'undefined';
	  } else if (value === null) {
	    return 'null';
	  } else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
	    return 'buffer';
	  }
	  return Object.prototype.toString.call(value)
	    .replace(/^\[.+\s(.+?)\]$/, '$1')
	    .toLowerCase();
	};

	/**
	 * Stringify `value`. Different behavior depending on type of value:
	 *
	 * - If `value` is undefined or null, return `'[undefined]'` or `'[null]'`, respectively.
	 * - If `value` is not an object, function or array, return result of `value.toString()` wrapped in double-quotes.
	 * - If `value` is an *empty* object, function, or array, return result of function
	 *   {@link emptyRepresentation}.
	 * - If `value` has properties, call {@link exports.canonicalize} on it, then return result of
	 *   JSON.stringify().
	 *
	 * @api private
	 * @see exports.type
	 * @param {*} value
	 * @return {string}
	 */
	exports.stringify = function(value) {
	  var type = exports.type(value);

	  if (!~exports.indexOf(['object', 'array', 'function'], type)) {
	    if (type !== 'buffer') {
	      return jsonStringify(value);
	    }
	    var json = value.toJSON();
	    // Based on the toJSON result
	    return jsonStringify(json.data && json.type ? json.data : json, 2)
	      .replace(/,(\n|$)/g, '$1');
	  }

	  for (var prop in value) {
	    if (Object.prototype.hasOwnProperty.call(value, prop)) {
	      return jsonStringify(exports.canonicalize(value), 2).replace(/,(\n|$)/g, '$1');
	    }
	  }

	  return emptyRepresentation(value, type);
	};

	/**
	 * like JSON.stringify but more sense.
	 *
	 * @api private
	 * @param {Object}  object
	 * @param {number=} spaces
	 * @param {number=} depth
	 * @returns {*}
	 */
	function jsonStringify(object, spaces, depth) {
	  if (typeof spaces === 'undefined') {
	    // primitive types
	    return _stringify(object);
	  }

	  depth = depth || 1;
	  var space = spaces * depth;
	  var str = isArray(object) ? '[' : '{';
	  var end = isArray(object) ? ']' : '}';
	  var length = object.length || exports.keys(object).length;
	  // `.repeat()` polyfill
	  function repeat(s, n) {
	    return new Array(n).join(s);
	  }

	  function _stringify(val) {
	    switch (exports.type(val)) {
	      case 'null':
	      case 'undefined':
	        val = '[' + val + ']';
	        break;
	      case 'array':
	      case 'object':
	        val = jsonStringify(val, spaces, depth + 1);
	        break;
	      case 'boolean':
	      case 'regexp':
	      case 'number':
	        val = val === 0 && (1 / val) === -Infinity // `-0`
	          ? '-0'
	          : val.toString();
	        break;
	      case 'date':
	        var sDate = isNaN(val.getTime())        // Invalid date
	          ? val.toString()
	          : val.toISOString();
	        val = '[Date: ' + sDate + ']';
	        break;
	      case 'buffer':
	        var json = val.toJSON();
	        // Based on the toJSON result
	        json = json.data && json.type ? json.data : json;
	        val = '[Buffer: ' + jsonStringify(json, 2, depth + 1) + ']';
	        break;
	      default:
	        val = (val === '[Function]' || val === '[Circular]')
	          ? val
	          : JSON.stringify(val); // string
	    }
	    return val;
	  }

	  for (var i in object) {
	    if (!object.hasOwnProperty(i)) {
	      continue; // not my business
	    }
	    --length;
	    str += '\n ' + repeat(' ', space)
	      + (isArray(object) ? '' : '"' + i + '": ') // key
	      + _stringify(object[i])                     // value
	      + (length ? ',' : '');                     // comma
	  }

	  return str
	    // [], {}
	    + (str.length !== 1 ? '\n' + repeat(' ', --space) + end : end);
	}

	/**
	 * Test if a value is a buffer.
	 *
	 * @api private
	 * @param {*} value The value to test.
	 * @return {boolean} True if `value` is a buffer, otherwise false
	 */
	exports.isBuffer = function(value) {
	  return typeof Buffer !== 'undefined' && Buffer.isBuffer(value);
	};

	/**
	 * Return a new Thing that has the keys in sorted order. Recursive.
	 *
	 * If the Thing...
	 * - has already been seen, return string `'[Circular]'`
	 * - is `undefined`, return string `'[undefined]'`
	 * - is `null`, return value `null`
	 * - is some other primitive, return the value
	 * - is not a primitive or an `Array`, `Object`, or `Function`, return the value of the Thing's `toString()` method
	 * - is a non-empty `Array`, `Object`, or `Function`, return the result of calling this function again.
	 * - is an empty `Array`, `Object`, or `Function`, return the result of calling `emptyRepresentation()`
	 *
	 * @api private
	 * @see {@link exports.stringify}
	 * @param {*} value Thing to inspect.  May or may not have properties.
	 * @param {Array} [stack=[]] Stack of seen values
	 * @return {(Object|Array|Function|string|undefined)}
	 */
	exports.canonicalize = function(value, stack) {
	  var canonicalizedObj;
	  /* eslint-disable no-unused-vars */
	  var prop;
	  /* eslint-enable no-unused-vars */
	  var type = exports.type(value);
	  function withStack(value, fn) {
	    stack.push(value);
	    fn();
	    stack.pop();
	  }

	  stack = stack || [];

	  if (exports.indexOf(stack, value) !== -1) {
	    return '[Circular]';
	  }

	  switch (type) {
	    case 'undefined':
	    case 'buffer':
	    case 'null':
	      canonicalizedObj = value;
	      break;
	    case 'array':
	      withStack(value, function() {
	        canonicalizedObj = exports.map(value, function(item) {
	          return exports.canonicalize(item, stack);
	        });
	      });
	      break;
	    case 'function':
	      /* eslint-disable guard-for-in */
	      for (prop in value) {
	        canonicalizedObj = {};
	        break;
	      }
	      /* eslint-enable guard-for-in */
	      if (!canonicalizedObj) {
	        canonicalizedObj = emptyRepresentation(value, type);
	        break;
	      }
	    /* falls through */
	    case 'object':
	      canonicalizedObj = canonicalizedObj || {};
	      withStack(value, function() {
	        exports.forEach(exports.keys(value).sort(), function(key) {
	          canonicalizedObj[key] = exports.canonicalize(value[key], stack);
	        });
	      });
	      break;
	    case 'date':
	    case 'number':
	    case 'regexp':
	    case 'boolean':
	      canonicalizedObj = value;
	      break;
	    default:
	      canonicalizedObj = value + '';
	  }

	  return canonicalizedObj;
	};

	/**
	 * Lookup file names at the given `path`.
	 *
	 * @api public
	 * @param {string} path Base path to start searching from.
	 * @param {string[]} extensions File extensions to look for.
	 * @param {boolean} recursive Whether or not to recurse into subdirectories.
	 * @return {string[]} An array of paths.
	 */
	exports.lookupFiles = function lookupFiles(path, extensions, recursive) {
	  var files = [];
	  var re = new RegExp('\\.(' + extensions.join('|') + ')$');

	  if (!exists(path)) {
	    if (exists(path + '.js')) {
	      path += '.js';
	    } else {
	      files = glob.sync(path);
	      if (!files.length) {
	        throw new Error("cannot resolve path (or pattern) '" + path + "'");
	      }
	      return files;
	    }
	  }

	  try {
	    var stat = statSync(path);
	    if (stat.isFile()) {
	      return path;
	    }
	  } catch (err) {
	    // ignore error
	    return;
	  }

	  readdirSync(path).forEach(function(file) {
	    file = join(path, file);
	    try {
	      var stat = statSync(file);
	      if (stat.isDirectory()) {
	        if (recursive) {
	          files = files.concat(lookupFiles(file, extensions, recursive));
	        }
	        return;
	      }
	    } catch (err) {
	      // ignore error
	      return;
	    }
	    if (!stat.isFile() || !re.test(file) || basename(file)[0] === '.') {
	      return;
	    }
	    files.push(file);
	  });

	  return files;
	};

	/**
	 * Generate an undefined error with a message warning the user.
	 *
	 * @return {Error}
	 */

	exports.undefinedError = function() {
	  return new Error('Caught undefined error, did you throw without specifying what?');
	};

	/**
	 * Generate an undefined error if `err` is not defined.
	 *
	 * @param {Error} err
	 * @return {Error}
	 */

	exports.getError = function(err) {
	  return err || exports.undefinedError();
	};

	/**
	 * @summary
	 * This Filter based on `mocha-clean` module.(see: `github.com/rstacruz/mocha-clean`)
	 * @description
	 * When invoking this function you get a filter function that get the Error.stack as an input,
	 * and return a prettify output.
	 * (i.e: strip Mocha and internal node functions from stack trace).
	 * @returns {Function}
	 */
	exports.stackTraceFilter = function() {
	  // TODO: Replace with `process.browser`
	  var slash = '/';
	  var is = typeof document === 'undefined' ? { node: true } : { browser: true };
	  var cwd = is.node
	      ? process.cwd() + slash
	      : (typeof location === 'undefined' ? window.location : location).href.replace(/\/[^\/]*$/, '/');

	  function isMochaInternal(line) {
	    return (~line.indexOf('node_modules' + slash + 'mocha' + slash))
	      || (~line.indexOf('components' + slash + 'mochajs' + slash))
	      || (~line.indexOf('components' + slash + 'mocha' + slash))
	      || (~line.indexOf(slash + 'mocha.js'));
	  }

	  function isNodeInternal(line) {
	    return (~line.indexOf('(timers.js:'))
	      || (~line.indexOf('(events.js:'))
	      || (~line.indexOf('(node.js:'))
	      || (~line.indexOf('(module.js:'))
	      || (~line.indexOf('GeneratorFunctionPrototype.next (native)'))
	      || false;
	  }

	  return function(stack) {
	    stack = stack.split('\n');

	    stack = exports.reduce(stack, function(list, line) {
	      if (isMochaInternal(line)) {
	        return list;
	      }

	      if (is.node && isNodeInternal(line)) {
	        return list;
	      }

	      // Clean up cwd(absolute)
	      list.push(line.replace(cwd, ''));
	      return list;
	    }, []);

	    return stack.join('\n');
	  };
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).Buffer, __webpack_require__(1)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */

	'use strict'

	var base64 = __webpack_require__(13)
	var ieee754 = __webpack_require__(14)
	var isArray = __webpack_require__(15)

	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation

	var rootParent = {}

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()

	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }

	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }

	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }

	  // Unusual.
	  return fromObject(this, arg)
	}

	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)

	  that.write(string, encoding)
	  return that
	}

	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

	  if (isArray(object)) return fromArray(that, object)

	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }

	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }

	  if (object.length) return fromArrayLike(that, object)

	  return fromJsonObject(that, object)
	}

	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}

	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}

	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0

	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)

	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}

	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }

	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent

	  return that
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length
	  var y = b.length

	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break

	    ++i
	  }

	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

	  if (list.length === 0) {
	    return new Buffer(0)
	  }

	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }

	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}

	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string

	  var len = string.length
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength

	function slowToString (encoding, start, end) {
	  var loweredCase = false

	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0

	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'binary':
	        return binarySlice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}

	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}

	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}

	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0

	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1

	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }

	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}

	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }

	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8'

	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'binary':
	        return binaryWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []

	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }

	    res.push(codePoint)
	    i += bytesPerSequence
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}

	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)

	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length

	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len

	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end

	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }

	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }

	  if (end < start) end = start

	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }

	  if (newBuf.length) newBuf.parent = this.parent || this

	  return newBuf
	}

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }

	  return val
	}

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }

	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }

	  return val
	}

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)

	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

	  return val
	}

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)

	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }

	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }

	  return offset + byteLength
	}

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }

	  var len = end - start
	  var i

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }

	  return len
	}

	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length

	  if (end < start) throw new RangeError('end < start')

	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return

	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }

	  return this
	}

	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}

	// HELPER FUNCTIONS
	// ================

	var BP = Buffer.prototype

	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true

	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set

	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set

	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer

	  return arr
	}

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []

	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }

	    leadSurrogate = null

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12).Buffer, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	;(function (exports) {
		'use strict';

	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array

		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)

		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}

		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr

			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}

			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)

			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length

			var L = 0

			function push (v) {
				arr[L++] = v
			}

			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}

			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}

			return arr
		}

		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length

			function encode (num) {
				return lookup.charAt(num)
			}

			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}

			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}

			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}

			return output
		}

		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 14 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]

	  i += d

	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

	  value = Math.abs(value)

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }

	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 15 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 16 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	module.exports = function(type) {
	  return function() {};
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Approach:
	//
	// 1. Get the minimatch set
	// 2. For each pattern in the set, PROCESS(pattern)
	// 3. Store matches per-set, then uniq them
	//
	// PROCESS(pattern)
	// Get the first [n] items from pattern that are all strings
	// Join these together.  This is PREFIX.
	//   If there is no more remaining, then stat(PREFIX) and
	//   add to matches if it succeeds.  END.
	// readdir(PREFIX) as ENTRIES
	//   If fails, END
	//   If pattern[n] is GLOBSTAR
	//     // handle the case where the globstar match is empty
	//     // by pruning it out, and testing the resulting pattern
	//     PROCESS(pattern[0..n] + pattern[n+1 .. $])
	//     // handle other cases.
	//     for ENTRY in ENTRIES (not dotfiles)
	//       // attach globstar + tail onto the entry
	//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $])
	//
	//   else // not globstar
	//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
	//       Test ENTRY against pattern[n]
	//       If fails, continue
	//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
	//
	// Caveat:
	//   Cache all stats and readdirs results to minimize syscall.  Since all
	//   we ever care about is existence and directory-ness, we can just keep
	//   `true` for files, and [children,...] for directories, or `false` for
	//   things that don't exist.



	module.exports = glob

	var fs = __webpack_require__(18)
	, minimatch = __webpack_require__(25)
	, Minimatch = minimatch.Minimatch
	, inherits = __webpack_require__(35)
	, EE = __webpack_require__(36).EventEmitter
	, path = __webpack_require__(5)
	, isDir = {}
	, assert = __webpack_require__(19).ok

	function glob (pattern, options, cb) {
	  if (typeof options === "function") cb = options, options = {}
	  if (!options) options = {}

	  if (typeof options === "number") {
	    deprecated()
	    return
	  }

	  var g = new Glob(pattern, options, cb)
	  return g.sync ? g.found : g
	}

	glob.fnmatch = deprecated

	function deprecated () {
	  throw new Error("glob's interface has changed. Please see the docs.")
	}

	glob.sync = globSync
	function globSync (pattern, options) {
	  if (typeof options === "number") {
	    deprecated()
	    return
	  }

	  options = options || {}
	  options.sync = true
	  return glob(pattern, options)
	}


	glob.Glob = Glob
	inherits(Glob, EE)
	function Glob (pattern, options, cb) {
	  if (!(this instanceof Glob)) {
	    return new Glob(pattern, options, cb)
	  }

	  if (typeof cb === "function") {
	    this.on("error", cb)
	    this.on("end", function (matches) {
	      cb(null, matches)
	    })
	  }

	  options = options || {}

	  this.EOF = {}
	  this._emitQueue = []

	  this.maxDepth = options.maxDepth || 1000
	  this.maxLength = options.maxLength || Infinity
	  this.cache = options.cache || {}
	  this.statCache = options.statCache || {}

	  this.changedCwd = false
	  var cwd = process.cwd()
	  if (!options.hasOwnProperty("cwd")) this.cwd = cwd
	  else {
	    this.cwd = options.cwd
	    this.changedCwd = path.resolve(options.cwd) !== cwd
	  }

	  this.root = options.root || path.resolve(this.cwd, "/")
	  this.root = path.resolve(this.root)
	  if (process.platform === "win32")
	    this.root = this.root.replace(/\\/g, "/")

	  this.nomount = !!options.nomount

	  if (!pattern) {
	    throw new Error("must provide pattern")
	  }

	  // base-matching: just use globstar for that.
	  if (options.matchBase && -1 === pattern.indexOf("/")) {
	    if (options.noglobstar) {
	      throw new Error("base matching requires globstar")
	    }
	    pattern = "**/" + pattern
	  }

	  this.strict = options.strict !== false
	  this.dot = !!options.dot
	  this.mark = !!options.mark
	  this.sync = !!options.sync
	  this.nounique = !!options.nounique
	  this.nonull = !!options.nonull
	  this.nosort = !!options.nosort
	  this.nocase = !!options.nocase
	  this.stat = !!options.stat

	  this.debug = !!options.debug || !!options.globDebug
	  if (this.debug)
	    this.log = console.error

	  this.silent = !!options.silent

	  var mm = this.minimatch = new Minimatch(pattern, options)
	  this.options = mm.options
	  pattern = this.pattern = mm.pattern

	  this.error = null
	  this.aborted = false

	  // list of all the patterns that ** has resolved do, so
	  // we can avoid visiting multiple times.
	  this._globstars = {}

	  EE.call(this)

	  // process each pattern in the minimatch set
	  var n = this.minimatch.set.length

	  // The matches are stored as {<filename>: true,...} so that
	  // duplicates are automagically pruned.
	  // Later, we do an Object.keys() on these.
	  // Keep them as a list so we can fill in when nonull is set.
	  this.matches = new Array(n)

	  this.minimatch.set.forEach(iterator.bind(this))
	  function iterator (pattern, i, set) {
	    this._process(pattern, 0, i, function (er) {
	      if (er) this.emit("error", er)
	      if (-- n <= 0) this._finish()
	    })
	  }
	}

	Glob.prototype.log = function () {}

	Glob.prototype._finish = function () {
	  assert(this instanceof Glob)

	  var nou = this.nounique
	  , all = nou ? [] : {}

	  for (var i = 0, l = this.matches.length; i < l; i ++) {
	    var matches = this.matches[i]
	    this.log("matches[%d] =", i, matches)
	    // do like the shell, and spit out the literal glob
	    if (!matches) {
	      if (this.nonull) {
	        var literal = this.minimatch.globSet[i]
	        if (nou) all.push(literal)
	        else all[literal] = true
	      }
	    } else {
	      // had matches
	      var m = Object.keys(matches)
	      if (nou) all.push.apply(all, m)
	      else m.forEach(function (m) {
	        all[m] = true
	      })
	    }
	  }

	  if (!nou) all = Object.keys(all)

	  if (!this.nosort) {
	    all = all.sort(this.nocase ? alphasorti : alphasort)
	  }

	  if (this.mark) {
	    // at *some* point we statted all of these
	    all = all.map(function (m) {
	      var sc = this.cache[m]
	      if (!sc)
	        return m
	      var isDir = (Array.isArray(sc) || sc === 2)
	      if (isDir && m.slice(-1) !== "/") {
	        return m + "/"
	      }
	      if (!isDir && m.slice(-1) === "/") {
	        return m.replace(/\/+$/, "")
	      }
	      return m
	    }, this)
	  }

	  this.log("emitting end", all)

	  this.EOF = this.found = all
	  this.emitMatch(this.EOF)
	}

	function alphasorti (a, b) {
	  a = a.toLowerCase()
	  b = b.toLowerCase()
	  return alphasort(a, b)
	}

	function alphasort (a, b) {
	  return a > b ? 1 : a < b ? -1 : 0
	}

	Glob.prototype.abort = function () {
	  this.aborted = true
	  this.emit("abort")
	}

	Glob.prototype.pause = function () {
	  if (this.paused) return
	  if (this.sync)
	    this.emit("error", new Error("Can't pause/resume sync glob"))
	  this.paused = true
	  this.emit("pause")
	}

	Glob.prototype.resume = function () {
	  if (!this.paused) return
	  if (this.sync)
	    this.emit("error", new Error("Can't pause/resume sync glob"))
	  this.paused = false
	  this.emit("resume")
	  this._processEmitQueue()
	  //process.nextTick(this.emit.bind(this, "resume"))
	}

	Glob.prototype.emitMatch = function (m) {
	  if (!this.stat || this.statCache[m] || m === this.EOF) {
	    this._emitQueue.push(m)
	    this._processEmitQueue()
	  } else {
	    this._stat(m, function(exists, isDir) {
	      if (exists) {
	        this._emitQueue.push(m)
	        this._processEmitQueue()
	      }
	    })
	  }
	}

	Glob.prototype._processEmitQueue = function (m) {
	  while (!this._processingEmitQueue &&
	         !this.paused) {
	    this._processingEmitQueue = true
	    var m = this._emitQueue.shift()
	    if (!m) {
	      this._processingEmitQueue = false
	      break
	    }

	    this.log('emit!', m === this.EOF ? "end" : "match")

	    this.emit(m === this.EOF ? "end" : "match", m)
	    this._processingEmitQueue = false
	  }
	}

	Glob.prototype._process = function (pattern, depth, index, cb_) {
	  assert(this instanceof Glob)

	  var cb = function cb (er, res) {
	    assert(this instanceof Glob)
	    if (this.paused) {
	      if (!this._processQueue) {
	        this._processQueue = []
	        this.once("resume", function () {
	          var q = this._processQueue
	          this._processQueue = null
	          q.forEach(function (cb) { cb() })
	        })
	      }
	      this._processQueue.push(cb_.bind(this, er, res))
	    } else {
	      cb_.call(this, er, res)
	    }
	  }.bind(this)

	  if (this.aborted) return cb()

	  if (depth > this.maxDepth) return cb()

	  // Get the first [n] parts of pattern that are all strings.
	  var n = 0
	  while (typeof pattern[n] === "string") {
	    n ++
	  }
	  // now n is the index of the first one that is *not* a string.

	  // see if there's anything else
	  var prefix
	  switch (n) {
	    // if not, then this is rather simple
	    case pattern.length:
	      prefix = pattern.join("/")
	      this._stat(prefix, function (exists, isDir) {
	        // either it's there, or it isn't.
	        // nothing more to do, either way.
	        if (exists) {
	          if (prefix && isAbsolute(prefix) && !this.nomount) {
	            if (prefix.charAt(0) === "/") {
	              prefix = path.join(this.root, prefix)
	            } else {
	              prefix = path.resolve(this.root, prefix)
	            }
	          }

	          if (process.platform === "win32")
	            prefix = prefix.replace(/\\/g, "/")

	          this.matches[index] = this.matches[index] || {}
	          this.matches[index][prefix] = true
	          this.emitMatch(prefix)
	        }
	        return cb()
	      })
	      return

	    case 0:
	      // pattern *starts* with some non-trivial item.
	      // going to readdir(cwd), but not include the prefix in matches.
	      prefix = null
	      break

	    default:
	      // pattern has some string bits in the front.
	      // whatever it starts with, whether that's "absolute" like /foo/bar,
	      // or "relative" like "../baz"
	      prefix = pattern.slice(0, n)
	      prefix = prefix.join("/")
	      break
	  }

	  // get the list of entries.
	  var read
	  if (prefix === null) read = "."
	  else if (isAbsolute(prefix) || isAbsolute(pattern.join("/"))) {
	    if (!prefix || !isAbsolute(prefix)) {
	      prefix = path.join("/", prefix)
	    }
	    read = prefix = path.resolve(prefix)

	    // if (process.platform === "win32")
	    //   read = prefix = prefix.replace(/^[a-zA-Z]:|\\/g, "/")

	    this.log('absolute: ', prefix, this.root, pattern, read)
	  } else {
	    read = prefix
	  }

	  this.log('readdir(%j)', read, this.cwd, this.root)

	  return this._readdir(read, function (er, entries) {
	    if (er) {
	      // not a directory!
	      // this means that, whatever else comes after this, it can never match
	      return cb()
	    }

	    // globstar is special
	    if (pattern[n] === minimatch.GLOBSTAR) {
	      // test without the globstar, and with every child both below
	      // and replacing the globstar.
	      var s = [ pattern.slice(0, n).concat(pattern.slice(n + 1)) ]
	      entries.forEach(function (e) {
	        if (e.charAt(0) === "." && !this.dot) return
	        // instead of the globstar
	        s.push(pattern.slice(0, n).concat(e).concat(pattern.slice(n + 1)))
	        // below the globstar
	        s.push(pattern.slice(0, n).concat(e).concat(pattern.slice(n)))
	      }, this)

	      s = s.filter(function (pattern) {
	        var key = gsKey(pattern)
	        var seen = !this._globstars[key]
	        this._globstars[key] = true
	        return seen
	      }, this)

	      if (!s.length)
	        return cb()

	      // now asyncForEach over this
	      var l = s.length
	      , errState = null
	      s.forEach(function (gsPattern) {
	        this._process(gsPattern, depth + 1, index, function (er) {
	          if (errState) return
	          if (er) return cb(errState = er)
	          if (--l <= 0) return cb()
	        })
	      }, this)

	      return
	    }

	    // not a globstar
	    // It will only match dot entries if it starts with a dot, or if
	    // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
	    var pn = pattern[n]
	    var rawGlob = pattern[n]._glob
	    , dotOk = this.dot || rawGlob.charAt(0) === "."

	    entries = entries.filter(function (e) {
	      return (e.charAt(0) !== "." || dotOk) &&
	             e.match(pattern[n])
	    })

	    // If n === pattern.length - 1, then there's no need for the extra stat
	    // *unless* the user has specified "mark" or "stat" explicitly.
	    // We know that they exist, since the readdir returned them.
	    if (n === pattern.length - 1 &&
	        !this.mark &&
	        !this.stat) {
	      entries.forEach(function (e) {
	        if (prefix) {
	          if (prefix !== "/") e = prefix + "/" + e
	          else e = prefix + e
	        }
	        if (e.charAt(0) === "/" && !this.nomount) {
	          e = path.join(this.root, e)
	        }

	        if (process.platform === "win32")
	          e = e.replace(/\\/g, "/")

	        this.matches[index] = this.matches[index] || {}
	        this.matches[index][e] = true
	        this.emitMatch(e)
	      }, this)
	      return cb.call(this)
	    }


	    // now test all the remaining entries as stand-ins for that part
	    // of the pattern.
	    var l = entries.length
	    , errState = null
	    if (l === 0) return cb() // no matches possible
	    entries.forEach(function (e) {
	      var p = pattern.slice(0, n).concat(e).concat(pattern.slice(n + 1))
	      this._process(p, depth + 1, index, function (er) {
	        if (errState) return
	        if (er) return cb(errState = er)
	        if (--l === 0) return cb.call(this)
	      })
	    }, this)
	  })

	}

	function gsKey (pattern) {
	  return '**' + pattern.map(function (p) {
	    return (p === minimatch.GLOBSTAR) ? '**' : (''+p)
	  }).join('/')
	}

	Glob.prototype._stat = function (f, cb) {
	  assert(this instanceof Glob)
	  var abs = f
	  if (f.charAt(0) === "/") {
	    abs = path.join(this.root, f)
	  } else if (this.changedCwd) {
	    abs = path.resolve(this.cwd, f)
	  }

	  if (f.length > this.maxLength) {
	    var er = new Error("Path name too long")
	    er.code = "ENAMETOOLONG"
	    er.path = f
	    return this._afterStat(f, abs, cb, er)
	  }

	  this.log('stat', [this.cwd, f, '=', abs])

	  if (!this.stat && this.cache.hasOwnProperty(f)) {
	    var exists = this.cache[f]
	    , isDir = exists && (Array.isArray(exists) || exists === 2)
	    if (this.sync) return cb.call(this, !!exists, isDir)
	    return process.nextTick(cb.bind(this, !!exists, isDir))
	  }

	  var stat = this.statCache[abs]
	  if (this.sync || stat) {
	    var er
	    try {
	      stat = fs.statSync(abs)
	    } catch (e) {
	      er = e
	    }
	    this._afterStat(f, abs, cb, er, stat)
	  } else {
	    fs.stat(abs, this._afterStat.bind(this, f, abs, cb))
	  }
	}

	Glob.prototype._afterStat = function (f, abs, cb, er, stat) {
	  var exists
	  assert(this instanceof Glob)

	  if (abs.slice(-1) === "/" && stat && !stat.isDirectory()) {
	    this.log("should be ENOTDIR, fake it")

	    er = new Error("ENOTDIR, not a directory '" + abs + "'")
	    er.path = abs
	    er.code = "ENOTDIR"
	    stat = null
	  }

	  var emit = !this.statCache[abs]
	  this.statCache[abs] = stat

	  if (er || !stat) {
	    exists = false
	  } else {
	    exists = stat.isDirectory() ? 2 : 1
	    if (emit)
	      this.emit('stat', f, stat)
	  }
	  this.cache[f] = this.cache[f] || exists
	  cb.call(this, !!exists, exists === 2)
	}

	Glob.prototype._readdir = function (f, cb) {
	  assert(this instanceof Glob)
	  var abs = f
	  if (f.charAt(0) === "/") {
	    abs = path.join(this.root, f)
	  } else if (isAbsolute(f)) {
	    abs = f
	  } else if (this.changedCwd) {
	    abs = path.resolve(this.cwd, f)
	  }

	  if (f.length > this.maxLength) {
	    var er = new Error("Path name too long")
	    er.code = "ENAMETOOLONG"
	    er.path = f
	    return this._afterReaddir(f, abs, cb, er)
	  }

	  this.log('readdir', [this.cwd, f, abs])
	  if (this.cache.hasOwnProperty(f)) {
	    var c = this.cache[f]
	    if (Array.isArray(c)) {
	      if (this.sync) return cb.call(this, null, c)
	      return process.nextTick(cb.bind(this, null, c))
	    }

	    if (!c || c === 1) {
	      // either ENOENT or ENOTDIR
	      var code = c ? "ENOTDIR" : "ENOENT"
	      , er = new Error((c ? "Not a directory" : "Not found") + ": " + f)
	      er.path = f
	      er.code = code
	      this.log(f, er)
	      if (this.sync) return cb.call(this, er)
	      return process.nextTick(cb.bind(this, er))
	    }

	    // at this point, c === 2, meaning it's a dir, but we haven't
	    // had to read it yet, or c === true, meaning it's *something*
	    // but we don't have any idea what.  Need to read it, either way.
	  }

	  if (this.sync) {
	    var er, entries
	    try {
	      entries = fs.readdirSync(abs)
	    } catch (e) {
	      er = e
	    }
	    return this._afterReaddir(f, abs, cb, er, entries)
	  }

	  fs.readdir(abs, this._afterReaddir.bind(this, f, abs, cb))
	}

	Glob.prototype._afterReaddir = function (f, abs, cb, er, entries) {
	  assert(this instanceof Glob)
	  if (entries && !er) {
	    this.cache[f] = entries
	    // if we haven't asked to stat everything for suresies, then just
	    // assume that everything in there exists, so we can avoid
	    // having to stat it a second time.  This also gets us one step
	    // further into ELOOP territory.
	    if (!this.mark && !this.stat) {
	      entries.forEach(function (e) {
	        if (f === "/") e = f + e
	        else e = f + "/" + e
	        this.cache[e] = true
	      }, this)
	    }

	    return cb.call(this, er, entries)
	  }

	  // now handle errors, and cache the information
	  if (er) switch (er.code) {
	    case "ENOTDIR": // totally normal. means it *does* exist.
	      this.cache[f] = 1
	      return cb.call(this, er)
	    case "ENOENT": // not terribly unusual
	    case "ELOOP":
	    case "ENAMETOOLONG":
	    case "UNKNOWN":
	      this.cache[f] = false
	      return cb.call(this, er)
	    default: // some unusual error.  Treat as failure.
	      this.cache[f] = false
	      if (this.strict) this.emit("error", er)
	      if (!this.silent) console.error("glob error", er)
	      return cb.call(this, er)
	  }
	}

	var isAbsolute = process.platform === "win32" ? absWin : absUnix

	function absWin (p) {
	  if (absUnix(p)) return true
	  // pull off the device/UNC bit from a windows path.
	  // from node's lib/path.js
	  var splitDeviceRe =
	      /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/
	    , result = splitDeviceRe.exec(p)
	    , device = result[1] || ''
	    , isUnc = device && device.charAt(1) !== ':'
	    , isAbsolute = !!result[2] || isUnc // UNC paths are always absolute

	  return isAbsolute
	}

	function absUnix (p) {
	  return p.charAt(0) === "/" || p === ""
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Monkey-patching the fs module.
	// It's ugly, but there is simply no other way to do this.
	var fs = module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var assert = __webpack_require__(19)

	// fix up some busted stuff, mostly on windows and old nodes
	__webpack_require__(23)

	// The EMFILE enqueuing stuff

	var util = __webpack_require__(20)

	function noop () {}

	var debug = noop
	if (util.debuglog)
	  debug = util.debuglog('gfs')
	else if (/\bgfs\b/i.test(process.env.NODE_DEBUG || ''))
	  debug = function() {
	    var m = util.format.apply(util, arguments)
	    m = 'GFS: ' + m.split(/\n/).join('\nGFS: ')
	    console.error(m)
	  }

	if (/\bgfs\b/i.test(process.env.NODE_DEBUG || '')) {
	  process.on('exit', function() {
	    debug('fds', fds)
	    debug(queue)
	    assert.equal(queue.length, 0)
	  })
	}


	var originalOpen = fs.open
	fs.open = open

	function open(path, flags, mode, cb) {
	  if (typeof mode === "function") cb = mode, mode = null
	  if (typeof cb !== "function") cb = noop
	  new OpenReq(path, flags, mode, cb)
	}

	function OpenReq(path, flags, mode, cb) {
	  this.path = path
	  this.flags = flags
	  this.mode = mode
	  this.cb = cb
	  Req.call(this)
	}

	util.inherits(OpenReq, Req)

	OpenReq.prototype.process = function() {
	  originalOpen.call(fs, this.path, this.flags, this.mode, this.done)
	}

	var fds = {}
	OpenReq.prototype.done = function(er, fd) {
	  debug('open done', er, fd)
	  if (fd)
	    fds['fd' + fd] = this.path
	  Req.prototype.done.call(this, er, fd)
	}


	var originalReaddir = fs.readdir
	fs.readdir = readdir

	function readdir(path, cb) {
	  if (typeof cb !== "function") cb = noop
	  new ReaddirReq(path, cb)
	}

	function ReaddirReq(path, cb) {
	  this.path = path
	  this.cb = cb
	  Req.call(this)
	}

	util.inherits(ReaddirReq, Req)

	ReaddirReq.prototype.process = function() {
	  originalReaddir.call(fs, this.path, this.done)
	}

	ReaddirReq.prototype.done = function(er, files) {
	  if (files && files.sort)
	    files = files.sort()
	  Req.prototype.done.call(this, er, files)
	  onclose()
	}


	var originalClose = fs.close
	fs.close = close

	function close (fd, cb) {
	  debug('close', fd)
	  if (typeof cb !== "function") cb = noop
	  delete fds['fd' + fd]
	  originalClose.call(fs, fd, function(er) {
	    onclose()
	    cb(er)
	  })
	}


	var originalCloseSync = fs.closeSync
	fs.closeSync = closeSync

	function closeSync (fd) {
	  try {
	    return originalCloseSync(fd)
	  } finally {
	    onclose()
	  }
	}


	// Req class
	function Req () {
	  // start processing
	  this.done = this.done.bind(this)
	  this.failures = 0
	  this.process()
	}

	Req.prototype.done = function (er, result) {
	  var tryAgain = false
	  if (er) {
	    var code = er.code
	    var tryAgain = code === "EMFILE"
	    if (process.platform === "win32")
	      tryAgain = tryAgain || code === "OK"
	  }

	  if (tryAgain) {
	    this.failures ++
	    enqueue(this)
	  } else {
	    var cb = this.cb
	    cb(er, result)
	  }
	}

	var queue = []

	function enqueue(req) {
	  queue.push(req)
	  debug('enqueue %d %s', queue.length, req.constructor.name, req)
	}

	function onclose() {
	  var req = queue.shift()
	  if (req) {
	    debug('process', req.constructor.name, req)
	    req.process()
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

	// when used in node, this will actually load the util module we depend on
	// versus loading the builtin util module as happens otherwise
	// this is a bug in node module loading as far as I am concerned
	var util = __webpack_require__(20);

	var pSlice = Array.prototype.slice;
	var hasOwn = Object.prototype.hasOwnProperty;

	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.

	var assert = module.exports = ok;

	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })

	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;

	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  }
	  else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;

	      // try to strip useless frames
	      var fn_name = stackStartFunction.name;
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }

	      this.stack = out;
	    }
	  }
	};

	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);

	function replacer(key, value) {
	  if (util.isUndefined(value)) {
	    return '' + value;
	  }
	  if (util.isNumber(value) && !isFinite(value)) {
	    return value.toString();
	  }
	  if (util.isFunction(value) || util.isRegExp(value)) {
	    return value.toString();
	  }
	  return value;
	}

	function truncate(s, n) {
	  if (util.isString(s)) {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}

	function getMessage(self) {
	  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(JSON.stringify(self.expected, replacer), 128);
	}

	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.

	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.

	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}

	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;

	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.

	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;

	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);

	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};

	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);

	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};

	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);

	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};

	function _deepEqual(actual, expected) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;

	  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
	    if (actual.length != expected.length) return false;

	    for (var i = 0; i < actual.length; i++) {
	      if (actual[i] !== expected[i]) return false;
	    }

	    return true;

	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();

	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;

	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!util.isObject(actual) && !util.isObject(expected)) {
	    return actual == expected;

	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected);
	  }
	}

	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	function objEquiv(a, b) {
	  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b)) {
	    return a === b;
	  }
	  var aIsArgs = isArguments(a),
	      bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b);
	  }
	  var ka = objectKeys(a),
	      kb = objectKeys(b),
	      key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key])) return false;
	  }
	  return true;
	}

	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);

	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};

	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);

	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};

	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};

	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }

	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  } else if (actual instanceof expected) {
	    return true;
	  } else if (expected.call({}, actual) === true) {
	    return true;
	  }

	  return false;
	}

	function _throws(shouldThrow, block, expected, message) {
	  var actual;

	  if (util.isString(expected)) {
	    message = expected;
	    expected = null;
	  }

	  try {
	    block();
	  } catch (e) {
	    actual = e;
	  }

	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');

	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }

	  if (!shouldThrow && expectedException(actual, expected)) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }

	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}

	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);

	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws.apply(this, [true].concat(pSlice.call(arguments)));
	};

	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/message) {
	  _throws.apply(this, [false].concat(pSlice.call(arguments)));
	};

	assert.ifError = function(err) { if (err) {throw err;}};

	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(21);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(22);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(1)))

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 22 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	var constants = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"constants\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))

	var origCwd = process.cwd
	var cwd = null
	process.cwd = function() {
	  if (!cwd)
	    cwd = origCwd.call(process)
	  return cwd
	}
	var chdir = process.chdir
	process.chdir = function(d) {
	  cwd = null
	  chdir.call(process, d)
	}

	// (re-)implement some things that are known busted or missing.

	// lchmod, broken prior to 0.6.2
	// back-port the fix here.
	if (constants.hasOwnProperty('O_SYMLINK') &&
	    process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
	  fs.lchmod = function (path, mode, callback) {
	    callback = callback || noop
	    fs.open( path
	           , constants.O_WRONLY | constants.O_SYMLINK
	           , mode
	           , function (err, fd) {
	      if (err) {
	        callback(err)
	        return
	      }
	      // prefer to return the chmod error, if one occurs,
	      // but still try to close, and report closing errors if they occur.
	      fs.fchmod(fd, mode, function (err) {
	        fs.close(fd, function(err2) {
	          callback(err || err2)
	        })
	      })
	    })
	  }

	  fs.lchmodSync = function (path, mode) {
	    var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode)

	    // prefer to return the chmod error, if one occurs,
	    // but still try to close, and report closing errors if they occur.
	    var err, err2
	    try {
	      var ret = fs.fchmodSync(fd, mode)
	    } catch (er) {
	      err = er
	    }
	    try {
	      fs.closeSync(fd)
	    } catch (er) {
	      err2 = er
	    }
	    if (err || err2) throw (err || err2)
	    return ret
	  }
	}


	// lutimes implementation, or no-op
	if (!fs.lutimes) {
	  if (constants.hasOwnProperty("O_SYMLINK")) {
	    fs.lutimes = function (path, at, mt, cb) {
	      fs.open(path, constants.O_SYMLINK, function (er, fd) {
	        cb = cb || noop
	        if (er) return cb(er)
	        fs.futimes(fd, at, mt, function (er) {
	          fs.close(fd, function (er2) {
	            return cb(er || er2)
	          })
	        })
	      })
	    }

	    fs.lutimesSync = function (path, at, mt) {
	      var fd = fs.openSync(path, constants.O_SYMLINK)
	        , err
	        , err2
	        , ret

	      try {
	        var ret = fs.futimesSync(fd, at, mt)
	      } catch (er) {
	        err = er
	      }
	      try {
	        fs.closeSync(fd)
	      } catch (er) {
	        err2 = er
	      }
	      if (err || err2) throw (err || err2)
	      return ret
	    }

	  } else if (fs.utimensat && constants.hasOwnProperty("AT_SYMLINK_NOFOLLOW")) {
	    // maybe utimensat will be bound soonish?
	    fs.lutimes = function (path, at, mt, cb) {
	      fs.utimensat(path, at, mt, constants.AT_SYMLINK_NOFOLLOW, cb)
	    }

	    fs.lutimesSync = function (path, at, mt) {
	      return fs.utimensatSync(path, at, mt, constants.AT_SYMLINK_NOFOLLOW)
	    }

	  } else {
	    fs.lutimes = function (_a, _b, _c, cb) { process.nextTick(cb) }
	    fs.lutimesSync = function () {}
	  }
	}


	// https://github.com/isaacs/node-graceful-fs/issues/4
	// Chown should not fail on einval or eperm if non-root.

	fs.chown = chownFix(fs.chown)
	fs.fchown = chownFix(fs.fchown)
	fs.lchown = chownFix(fs.lchown)

	fs.chownSync = chownFixSync(fs.chownSync)
	fs.fchownSync = chownFixSync(fs.fchownSync)
	fs.lchownSync = chownFixSync(fs.lchownSync)

	function chownFix (orig) {
	  if (!orig) return orig
	  return function (target, uid, gid, cb) {
	    return orig.call(fs, target, uid, gid, function (er, res) {
	      if (chownErOk(er)) er = null
	      cb(er, res)
	    })
	  }
	}

	function chownFixSync (orig) {
	  if (!orig) return orig
	  return function (target, uid, gid) {
	    try {
	      return orig.call(fs, target, uid, gid)
	    } catch (er) {
	      if (!chownErOk(er)) throw er
	    }
	  }
	}

	function chownErOk (er) {
	  // if there's no getuid, or if getuid() is something other than 0,
	  // and the error is EINVAL or EPERM, then just ignore it.
	  // This specific case is a silent failure in cp, install, tar,
	  // and most other unix tools that manage permissions.
	  // When running as root, or if other types of errors are encountered,
	  // then it's strict.
	  if (!er || (!process.getuid || process.getuid() !== 0)
	      && (er.code === "EINVAL" || er.code === "EPERM")) return true
	}


	// if lchmod/lchown do not exist, then make them no-ops
	if (!fs.lchmod) {
	  fs.lchmod = function (path, mode, cb) {
	    process.nextTick(cb)
	  }
	  fs.lchmodSync = function () {}
	}
	if (!fs.lchown) {
	  fs.lchown = function (path, uid, gid, cb) {
	    process.nextTick(cb)
	  }
	  fs.lchownSync = function () {}
	}



	// on Windows, A/V software can lock the directory, causing this
	// to fail with an EACCES or EPERM if the directory contains newly
	// created files.  Try again on failure, for up to 1 second.
	if (process.platform === "win32") {
	  var rename_ = fs.rename
	  fs.rename = function rename (from, to, cb) {
	    var start = Date.now()
	    rename_(from, to, function CB (er) {
	      if (er
	          && (er.code === "EACCES" || er.code === "EPERM")
	          && Date.now() - start < 1000) {
	        return rename_(from, to, CB)
	      }
	      cb(er)
	    })
	  }
	}


	// if read() returns EAGAIN, then just try it again.
	var read = fs.read
	fs.read = function (fd, buffer, offset, length, position, callback_) {
	  var callback
	  if (callback_ && typeof callback_ === 'function') {
	    var eagCounter = 0
	    callback = function (er, _, __) {
	      if (er && er.code === 'EAGAIN' && eagCounter < 10) {
	        eagCounter ++
	        return read.call(fs, fd, buffer, offset, length, position, callback)
	      }
	      callback_.apply(this, arguments)
	    }
	  }
	  return read.call(fs, fd, buffer, offset, length, position, callback)
	}

	var readSync = fs.readSync
	fs.readSync = function (fd, buffer, offset, length, position) {
	  var eagCounter = 0
	  while (true) {
	    try {
	      return readSync.call(fs, fd, buffer, offset, length, position)
	    } catch (er) {
	      if (er.code === 'EAGAIN' && eagCounter < 10) {
	        eagCounter ++
	        continue
	      }
	      throw er
	    }
	  }
	}


	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 24 */,
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;/* WEBPACK VAR INJECTION */(function(module, process) {;(function (require, exports, module, platform) {

	if (module) module.exports = minimatch
	else exports.minimatch = minimatch

	if (!__webpack_require__(26)) {
	  require = function (id) {
	    switch (id) {
	      case "sigmund": return function sigmund (obj) {
	        return JSON.stringify(obj)
	      }
	      case "path": return { basename: function (f) {
	        f = f.split(/[\/\\]/)
	        var e = f.pop()
	        if (!e) e = f.pop()
	        return e
	      }}
	      case "lru-cache": return function LRUCache () {
	        // not quite an LRU, but still space-limited.
	        var cache = {}
	        var cnt = 0
	        this.set = function (k, v) {
	          cnt ++
	          if (cnt >= 100) cache = {}
	          cache[k] = v
	        }
	        this.get = function (k) { return cache[k] }
	      }
	    }
	  }
	}

	minimatch.Minimatch = Minimatch

	var LRU = require("lru-cache")
	  , cache = minimatch.cache = new LRU({max: 100})
	  , GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
	  , sigmund = require("sigmund")

	var path = require("path")
	  // any single thing other than /
	  // don't need to escape / when using new RegExp()
	  , qmark = "[^/]"

	  // * => any number of characters
	  , star = qmark + "*?"

	  // ** when dots are allowed.  Anything goes, except .. and .
	  // not (^ or / followed by one or two dots followed by $ or /),
	  // followed by anything, any number of times.
	  , twoStarDot = "(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?"

	  // not a ^ or / followed by a dot,
	  // followed by anything, any number of times.
	  , twoStarNoDot = "(?:(?!(?:\\\/|^)\\.).)*?"

	  // characters that need to be escaped in RegExp.
	  , reSpecials = charSet("().*{}+?[]^$\\!")

	// "abc" -> { a:true, b:true, c:true }
	function charSet (s) {
	  return s.split("").reduce(function (set, c) {
	    set[c] = true
	    return set
	  }, {})
	}

	// normalizes slashes.
	var slashSplit = /\/+/

	minimatch.filter = filter
	function filter (pattern, options) {
	  options = options || {}
	  return function (p, i, list) {
	    return minimatch(p, pattern, options)
	  }
	}

	function ext (a, b) {
	  a = a || {}
	  b = b || {}
	  var t = {}
	  Object.keys(b).forEach(function (k) {
	    t[k] = b[k]
	  })
	  Object.keys(a).forEach(function (k) {
	    t[k] = a[k]
	  })
	  return t
	}

	minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return minimatch

	  var orig = minimatch

	  var m = function minimatch (p, pattern, options) {
	    return orig.minimatch(p, pattern, ext(def, options))
	  }

	  m.Minimatch = function Minimatch (pattern, options) {
	    return new orig.Minimatch(pattern, ext(def, options))
	  }

	  return m
	}

	Minimatch.defaults = function (def) {
	  if (!def || !Object.keys(def).length) return Minimatch
	  return minimatch.defaults(def).Minimatch
	}


	function minimatch (p, pattern, options) {
	  if (typeof pattern !== "string") {
	    throw new TypeError("glob pattern string required")
	  }

	  if (!options) options = {}

	  // shortcut: comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === "#") {
	    return false
	  }

	  // "" only matches ""
	  if (pattern.trim() === "") return p === ""

	  return new Minimatch(pattern, options).match(p)
	}

	function Minimatch (pattern, options) {
	  if (!(this instanceof Minimatch)) {
	    return new Minimatch(pattern, options, cache)
	  }

	  if (typeof pattern !== "string") {
	    throw new TypeError("glob pattern string required")
	  }

	  if (!options) options = {}
	  pattern = pattern.trim()

	  // windows: need to use /, not \
	  // On other platforms, \ is a valid (albeit bad) filename char.
	  if (platform === "win32") {
	    pattern = pattern.split("\\").join("/")
	  }

	  // lru storage.
	  // these things aren't particularly big, but walking down the string
	  // and turning it into a regexp can get pretty costly.
	  var cacheKey = pattern + "\n" + sigmund(options)
	  var cached = minimatch.cache.get(cacheKey)
	  if (cached) return cached
	  minimatch.cache.set(cacheKey, this)

	  this.options = options
	  this.set = []
	  this.pattern = pattern
	  this.regexp = null
	  this.negate = false
	  this.comment = false
	  this.empty = false

	  // make the set of regexps etc.
	  this.make()
	}

	Minimatch.prototype.debug = function() {}

	Minimatch.prototype.make = make
	function make () {
	  // don't do it more than once.
	  if (this._made) return

	  var pattern = this.pattern
	  var options = this.options

	  // empty patterns and comments match nothing.
	  if (!options.nocomment && pattern.charAt(0) === "#") {
	    this.comment = true
	    return
	  }
	  if (!pattern) {
	    this.empty = true
	    return
	  }

	  // step 1: figure out negation, etc.
	  this.parseNegate()

	  // step 2: expand braces
	  var set = this.globSet = this.braceExpand()

	  if (options.debug) this.debug = console.error

	  this.debug(this.pattern, set)

	  // step 3: now we have a set, so turn each one into a series of path-portion
	  // matching patterns.
	  // These will be regexps, except in the case of "**", which is
	  // set to the GLOBSTAR object for globstar behavior,
	  // and will not contain any / characters
	  set = this.globParts = set.map(function (s) {
	    return s.split(slashSplit)
	  })

	  this.debug(this.pattern, set)

	  // glob --> regexps
	  set = set.map(function (s, si, set) {
	    return s.map(this.parse, this)
	  }, this)

	  this.debug(this.pattern, set)

	  // filter out everything that didn't compile properly.
	  set = set.filter(function (s) {
	    return -1 === s.indexOf(false)
	  })

	  this.debug(this.pattern, set)

	  this.set = set
	}

	Minimatch.prototype.parseNegate = parseNegate
	function parseNegate () {
	  var pattern = this.pattern
	    , negate = false
	    , options = this.options
	    , negateOffset = 0

	  if (options.nonegate) return

	  for ( var i = 0, l = pattern.length
	      ; i < l && pattern.charAt(i) === "!"
	      ; i ++) {
	    negate = !negate
	    negateOffset ++
	  }

	  if (negateOffset) this.pattern = pattern.substr(negateOffset)
	  this.negate = negate
	}

	// Brace expansion:
	// a{b,c}d -> abd acd
	// a{b,}c -> abc ac
	// a{0..3}d -> a0d a1d a2d a3d
	// a{b,c{d,e}f}g -> abg acdfg acefg
	// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
	//
	// Invalid sets are not expanded.
	// a{2..}b -> a{2..}b
	// a{b}c -> a{b}c
	minimatch.braceExpand = function (pattern, options) {
	  return new Minimatch(pattern, options).braceExpand()
	}

	Minimatch.prototype.braceExpand = braceExpand
	function braceExpand (pattern, options) {
	  options = options || this.options
	  pattern = typeof pattern === "undefined"
	    ? this.pattern : pattern

	  if (typeof pattern === "undefined") {
	    throw new Error("undefined pattern")
	  }

	  if (options.nobrace ||
	      !pattern.match(/\{.*\}/)) {
	    // shortcut. no need to expand.
	    return [pattern]
	  }

	  var escaping = false

	  // examples and comments refer to this crazy pattern:
	  // a{b,c{d,e},{f,g}h}x{y,z}
	  // expected:
	  // abxy
	  // abxz
	  // acdxy
	  // acdxz
	  // acexy
	  // acexz
	  // afhxy
	  // afhxz
	  // aghxy
	  // aghxz

	  // everything before the first \{ is just a prefix.
	  // So, we pluck that off, and work with the rest,
	  // and then prepend it to everything we find.
	  if (pattern.charAt(0) !== "{") {
	    this.debug(pattern)
	    var prefix = null
	    for (var i = 0, l = pattern.length; i < l; i ++) {
	      var c = pattern.charAt(i)
	      this.debug(i, c)
	      if (c === "\\") {
	        escaping = !escaping
	      } else if (c === "{" && !escaping) {
	        prefix = pattern.substr(0, i)
	        break
	      }
	    }

	    // actually no sets, all { were escaped.
	    if (prefix === null) {
	      this.debug("no sets")
	      return [pattern]
	    }

	   var tail = braceExpand.call(this, pattern.substr(i), options)
	    return tail.map(function (t) {
	      return prefix + t
	    })
	  }

	  // now we have something like:
	  // {b,c{d,e},{f,g}h}x{y,z}
	  // walk through the set, expanding each part, until
	  // the set ends.  then, we'll expand the suffix.
	  // If the set only has a single member, then'll put the {} back

	  // first, handle numeric sets, since they're easier
	  var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/)
	  if (numset) {
	    this.debug("numset", numset[1], numset[2])
	    var suf = braceExpand.call(this, pattern.substr(numset[0].length), options)
	      , start = +numset[1]
	      , end = +numset[2]
	      , inc = start > end ? -1 : 1
	      , set = []
	    for (var i = start; i != (end + inc); i += inc) {
	      // append all the suffixes
	      for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
	        set.push(i + suf[ii])
	      }
	    }
	    return set
	  }

	  // ok, walk through the set
	  // We hope, somewhat optimistically, that there
	  // will be a } at the end.
	  // If the closing brace isn't found, then the pattern is
	  // interpreted as braceExpand("\\" + pattern) so that
	  // the leading \{ will be interpreted literally.
	  var i = 1 // skip the \{
	    , depth = 1
	    , set = []
	    , member = ""
	    , sawEnd = false
	    , escaping = false

	  function addMember () {
	    set.push(member)
	    member = ""
	  }

	  this.debug("Entering for")
	  FOR: for (i = 1, l = pattern.length; i < l; i ++) {
	    var c = pattern.charAt(i)
	    this.debug("", i, c)

	    if (escaping) {
	      escaping = false
	      member += "\\" + c
	    } else {
	      switch (c) {
	        case "\\":
	          escaping = true
	          continue

	        case "{":
	          depth ++
	          member += "{"
	          continue

	        case "}":
	          depth --
	          // if this closes the actual set, then we're done
	          if (depth === 0) {
	            addMember()
	            // pluck off the close-brace
	            i ++
	            break FOR
	          } else {
	            member += c
	            continue
	          }

	        case ",":
	          if (depth === 1) {
	            addMember()
	          } else {
	            member += c
	          }
	          continue

	        default:
	          member += c
	          continue
	      } // switch
	    } // else
	  } // for

	  // now we've either finished the set, and the suffix is
	  // pattern.substr(i), or we have *not* closed the set,
	  // and need to escape the leading brace
	  if (depth !== 0) {
	    this.debug("didn't close", pattern)
	    return braceExpand.call(this, "\\" + pattern, options)
	  }

	  // x{y,z} -> ["xy", "xz"]
	  this.debug("set", set)
	  this.debug("suffix", pattern.substr(i))
	  var suf = braceExpand.call(this, pattern.substr(i), options)
	  // ["b", "c{d,e}","{f,g}h"] ->
	  //   [["b"], ["cd", "ce"], ["fh", "gh"]]
	  var addBraces = set.length === 1
	  this.debug("set pre-expanded", set)
	  set = set.map(function (p) {
	    return braceExpand.call(this, p, options)
	  }, this)
	  this.debug("set expanded", set)


	  // [["b"], ["cd", "ce"], ["fh", "gh"]] ->
	  //   ["b", "cd", "ce", "fh", "gh"]
	  set = set.reduce(function (l, r) {
	    return l.concat(r)
	  })

	  if (addBraces) {
	    set = set.map(function (s) {
	      return "{" + s + "}"
	    })
	  }

	  // now attach the suffixes.
	  var ret = []
	  for (var i = 0, l = set.length; i < l; i ++) {
	    for (var ii = 0, ll = suf.length; ii < ll; ii ++) {
	      ret.push(set[i] + suf[ii])
	    }
	  }
	  return ret
	}

	// parse a component of the expanded set.
	// At this point, no pattern may contain "/" in it
	// so we're going to return a 2d array, where each entry is the full
	// pattern, split on '/', and then turned into a regular expression.
	// A regexp is made at the end which joins each array with an
	// escaped /, and another full one which joins each regexp with |.
	//
	// Following the lead of Bash 4.1, note that "**" only has special meaning
	// when it is the *only* thing in a path portion.  Otherwise, any series
	// of * is equivalent to a single *.  Globstar behavior is enabled by
	// default, and can be disabled by setting options.noglobstar.
	Minimatch.prototype.parse = parse
	var SUBPARSE = {}
	function parse (pattern, isSub) {
	  var options = this.options

	  // shortcuts
	  if (!options.noglobstar && pattern === "**") return GLOBSTAR
	  if (pattern === "") return ""

	  var re = ""
	    , hasMagic = !!options.nocase
	    , escaping = false
	    // ? => one single character
	    , patternListStack = []
	    , plType
	    , stateChar
	    , inClass = false
	    , reClassStart = -1
	    , classStart = -1
	    // . and .. never match anything that doesn't start with .,
	    // even when options.dot is set.
	    , patternStart = pattern.charAt(0) === "." ? "" // anything
	      // not (start or / followed by . or .. followed by / or end)
	      : options.dot ? "(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))"
	      : "(?!\\.)"
	    , self = this

	  function clearStateChar () {
	    if (stateChar) {
	      // we had some state-tracking character
	      // that wasn't consumed by this pass.
	      switch (stateChar) {
	        case "*":
	          re += star
	          hasMagic = true
	          break
	        case "?":
	          re += qmark
	          hasMagic = true
	          break
	        default:
	          re += "\\"+stateChar
	          break
	      }
	      self.debug('clearStateChar %j %j', stateChar, re)
	      stateChar = false
	    }
	  }

	  for ( var i = 0, len = pattern.length, c
	      ; (i < len) && (c = pattern.charAt(i))
	      ; i ++ ) {

	    this.debug("%s\t%s %s %j", pattern, i, re, c)

	    // skip over any that are escaped.
	    if (escaping && reSpecials[c]) {
	      re += "\\" + c
	      escaping = false
	      continue
	    }

	    SWITCH: switch (c) {
	      case "/":
	        // completely not allowed, even escaped.
	        // Should already be path-split by now.
	        return false

	      case "\\":
	        clearStateChar()
	        escaping = true
	        continue

	      // the various stateChar values
	      // for the "extglob" stuff.
	      case "?":
	      case "*":
	      case "+":
	      case "@":
	      case "!":
	        this.debug("%s\t%s %s %j <-- stateChar", pattern, i, re, c)

	        // all of those are literals inside a class, except that
	        // the glob [!a] means [^a] in regexp
	        if (inClass) {
	          this.debug('  in class')
	          if (c === "!" && i === classStart + 1) c = "^"
	          re += c
	          continue
	        }

	        // if we already have a stateChar, then it means
	        // that there was something like ** or +? in there.
	        // Handle the stateChar, then proceed with this one.
	        self.debug('call clearStateChar %j', stateChar)
	        clearStateChar()
	        stateChar = c
	        // if extglob is disabled, then +(asdf|foo) isn't a thing.
	        // just clear the statechar *now*, rather than even diving into
	        // the patternList stuff.
	        if (options.noext) clearStateChar()
	        continue

	      case "(":
	        if (inClass) {
	          re += "("
	          continue
	        }

	        if (!stateChar) {
	          re += "\\("
	          continue
	        }

	        plType = stateChar
	        patternListStack.push({ type: plType
	                              , start: i - 1
	                              , reStart: re.length })
	        // negation is (?:(?!js)[^/]*)
	        re += stateChar === "!" ? "(?:(?!" : "(?:"
	        this.debug('plType %j %j', stateChar, re)
	        stateChar = false
	        continue

	      case ")":
	        if (inClass || !patternListStack.length) {
	          re += "\\)"
	          continue
	        }

	        clearStateChar()
	        hasMagic = true
	        re += ")"
	        plType = patternListStack.pop().type
	        // negation is (?:(?!js)[^/]*)
	        // The others are (?:<pattern>)<type>
	        switch (plType) {
	          case "!":
	            re += "[^/]*?)"
	            break
	          case "?":
	          case "+":
	          case "*": re += plType
	          case "@": break // the default anyway
	        }
	        continue

	      case "|":
	        if (inClass || !patternListStack.length || escaping) {
	          re += "\\|"
	          escaping = false
	          continue
	        }

	        clearStateChar()
	        re += "|"
	        continue

	      // these are mostly the same in regexp and glob
	      case "[":
	        // swallow any state-tracking char before the [
	        clearStateChar()

	        if (inClass) {
	          re += "\\" + c
	          continue
	        }

	        inClass = true
	        classStart = i
	        reClassStart = re.length
	        re += c
	        continue

	      case "]":
	        //  a right bracket shall lose its special
	        //  meaning and represent itself in
	        //  a bracket expression if it occurs
	        //  first in the list.  -- POSIX.2 2.8.3.2
	        if (i === classStart + 1 || !inClass) {
	          re += "\\" + c
	          escaping = false
	          continue
	        }

	        // finish up the class.
	        hasMagic = true
	        inClass = false
	        re += c
	        continue

	      default:
	        // swallow any state char that wasn't consumed
	        clearStateChar()

	        if (escaping) {
	          // no need
	          escaping = false
	        } else if (reSpecials[c]
	                   && !(c === "^" && inClass)) {
	          re += "\\"
	        }

	        re += c

	    } // switch
	  } // for


	  // handle the case where we left a class open.
	  // "[abc" is valid, equivalent to "\[abc"
	  if (inClass) {
	    // split where the last [ was, and escape it
	    // this is a huge pita.  We now have to re-walk
	    // the contents of the would-be class to re-translate
	    // any characters that were passed through as-is
	    var cs = pattern.substr(classStart + 1)
	      , sp = this.parse(cs, SUBPARSE)
	    re = re.substr(0, reClassStart) + "\\[" + sp[0]
	    hasMagic = hasMagic || sp[1]
	  }

	  // handle the case where we had a +( thing at the *end*
	  // of the pattern.
	  // each pattern list stack adds 3 chars, and we need to go through
	  // and escape any | chars that were passed through as-is for the regexp.
	  // Go through and escape them, taking care not to double-escape any
	  // | chars that were already escaped.
	  var pl
	  while (pl = patternListStack.pop()) {
	    var tail = re.slice(pl.reStart + 3)
	    // maybe some even number of \, then maybe 1 \, followed by a |
	    tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function (_, $1, $2) {
	      if (!$2) {
	        // the | isn't already escaped, so escape it.
	        $2 = "\\"
	      }

	      // need to escape all those slashes *again*, without escaping the
	      // one that we need for escaping the | character.  As it works out,
	      // escaping an even number of slashes can be done by simply repeating
	      // it exactly after itself.  That's why this trick works.
	      //
	      // I am sorry that you have to see this.
	      return $1 + $1 + $2 + "|"
	    })

	    this.debug("tail=%j\n   %s", tail, tail)
	    var t = pl.type === "*" ? star
	          : pl.type === "?" ? qmark
	          : "\\" + pl.type

	    hasMagic = true
	    re = re.slice(0, pl.reStart)
	       + t + "\\("
	       + tail
	  }

	  // handle trailing things that only matter at the very end.
	  clearStateChar()
	  if (escaping) {
	    // trailing \\
	    re += "\\\\"
	  }

	  // only need to apply the nodot start if the re starts with
	  // something that could conceivably capture a dot
	  var addPatternStart = false
	  switch (re.charAt(0)) {
	    case ".":
	    case "[":
	    case "(": addPatternStart = true
	  }

	  // if the re is not "" at this point, then we need to make sure
	  // it doesn't match against an empty path part.
	  // Otherwise a/* will match a/, which it should not.
	  if (re !== "" && hasMagic) re = "(?=.)" + re

	  if (addPatternStart) re = patternStart + re

	  // parsing just a piece of a larger pattern.
	  if (isSub === SUBPARSE) {
	    return [ re, hasMagic ]
	  }

	  // skip the regexp for non-magical patterns
	  // unescape anything in it, though, so that it'll be
	  // an exact match against a file etc.
	  if (!hasMagic) {
	    return globUnescape(pattern)
	  }

	  var flags = options.nocase ? "i" : ""
	    , regExp = new RegExp("^" + re + "$", flags)

	  regExp._glob = pattern
	  regExp._src = re

	  return regExp
	}

	minimatch.makeRe = function (pattern, options) {
	  return new Minimatch(pattern, options || {}).makeRe()
	}

	Minimatch.prototype.makeRe = makeRe
	function makeRe () {
	  if (this.regexp || this.regexp === false) return this.regexp

	  // at this point, this.set is a 2d array of partial
	  // pattern strings, or "**".
	  //
	  // It's better to use .match().  This function shouldn't
	  // be used, really, but it's pretty convenient sometimes,
	  // when you just want to work with a regex.
	  var set = this.set

	  if (!set.length) return this.regexp = false
	  var options = this.options

	  var twoStar = options.noglobstar ? star
	      : options.dot ? twoStarDot
	      : twoStarNoDot
	    , flags = options.nocase ? "i" : ""

	  var re = set.map(function (pattern) {
	    return pattern.map(function (p) {
	      return (p === GLOBSTAR) ? twoStar
	           : (typeof p === "string") ? regExpEscape(p)
	           : p._src
	    }).join("\\\/")
	  }).join("|")

	  // must match entire pattern
	  // ending in a * or ** will make it less strict.
	  re = "^(?:" + re + ")$"

	  // can match anything, as long as it's not this.
	  if (this.negate) re = "^(?!" + re + ").*$"

	  try {
	    return this.regexp = new RegExp(re, flags)
	  } catch (ex) {
	    return this.regexp = false
	  }
	}

	minimatch.match = function (list, pattern, options) {
	  var mm = new Minimatch(pattern, options)
	  list = list.filter(function (f) {
	    return mm.match(f)
	  })
	  if (options.nonull && !list.length) {
	    list.push(pattern)
	  }
	  return list
	}

	Minimatch.prototype.match = match
	function match (f, partial) {
	  this.debug("match", f, this.pattern)
	  // short-circuit in the case of busted things.
	  // comments, etc.
	  if (this.comment) return false
	  if (this.empty) return f === ""

	  if (f === "/" && partial) return true

	  var options = this.options

	  // windows: need to use /, not \
	  // On other platforms, \ is a valid (albeit bad) filename char.
	  if (platform === "win32") {
	    f = f.split("\\").join("/")
	  }

	  // treat the test path as a set of pathparts.
	  f = f.split(slashSplit)
	  this.debug(this.pattern, "split", f)

	  // just ONE of the pattern sets in this.set needs to match
	  // in order for it to be valid.  If negating, then just one
	  // match means that we have failed.
	  // Either way, return on the first hit.

	  var set = this.set
	  this.debug(this.pattern, "set", set)

	  var splitFile = path.basename(f.join("/")).split("/")

	  for (var i = 0, l = set.length; i < l; i ++) {
	    var pattern = set[i], file = f
	    if (options.matchBase && pattern.length === 1) {
	      file = splitFile
	    }
	    var hit = this.matchOne(file, pattern, partial)
	    if (hit) {
	      if (options.flipNegate) return true
	      return !this.negate
	    }
	  }

	  // didn't get any hits.  this is success if it's a negative
	  // pattern, failure otherwise.
	  if (options.flipNegate) return false
	  return this.negate
	}

	// set partial to true to test if, for example,
	// "/a/b" matches the start of "/*/b/*/d"
	// Partial means, if you run out of file before you run
	// out of pattern, then that's fine, as long as all
	// the parts match.
	Minimatch.prototype.matchOne = function (file, pattern, partial) {
	  var options = this.options

	  this.debug("matchOne",
	              { "this": this
	              , file: file
	              , pattern: pattern })

	  this.debug("matchOne", file.length, pattern.length)

	  for ( var fi = 0
	          , pi = 0
	          , fl = file.length
	          , pl = pattern.length
	      ; (fi < fl) && (pi < pl)
	      ; fi ++, pi ++ ) {

	    this.debug("matchOne loop")
	    var p = pattern[pi]
	      , f = file[fi]

	    this.debug(pattern, p, f)

	    // should be impossible.
	    // some invalid regexp stuff in the set.
	    if (p === false) return false

	    if (p === GLOBSTAR) {
	      this.debug('GLOBSTAR', [pattern, p, f])

	      // "**"
	      // a/**/b/**/c would match the following:
	      // a/b/x/y/z/c
	      // a/x/y/z/b/c
	      // a/b/x/b/x/c
	      // a/b/c
	      // To do this, take the rest of the pattern after
	      // the **, and see if it would match the file remainder.
	      // If so, return success.
	      // If not, the ** "swallows" a segment, and try again.
	      // This is recursively awful.
	      //
	      // a/**/b/**/c matching a/b/x/y/z/c
	      // - a matches a
	      // - doublestar
	      //   - matchOne(b/x/y/z/c, b/**/c)
	      //     - b matches b
	      //     - doublestar
	      //       - matchOne(x/y/z/c, c) -> no
	      //       - matchOne(y/z/c, c) -> no
	      //       - matchOne(z/c, c) -> no
	      //       - matchOne(c, c) yes, hit
	      var fr = fi
	        , pr = pi + 1
	      if (pr === pl) {
	        this.debug('** at the end')
	        // a ** at the end will just swallow the rest.
	        // We have found a match.
	        // however, it will not swallow /.x, unless
	        // options.dot is set.
	        // . and .. are *never* matched by **, for explosively
	        // exponential reasons.
	        for ( ; fi < fl; fi ++) {
	          if (file[fi] === "." || file[fi] === ".." ||
	              (!options.dot && file[fi].charAt(0) === ".")) return false
	        }
	        return true
	      }

	      // ok, let's see if we can swallow whatever we can.
	      WHILE: while (fr < fl) {
	        var swallowee = file[fr]

	        this.debug('\nglobstar while',
	                    file, fr, pattern, pr, swallowee)

	        // XXX remove this slice.  Just pass the start index.
	        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
	          this.debug('globstar found match!', fr, fl, swallowee)
	          // found a match.
	          return true
	        } else {
	          // can't swallow "." or ".." ever.
	          // can only swallow ".foo" when explicitly asked.
	          if (swallowee === "." || swallowee === ".." ||
	              (!options.dot && swallowee.charAt(0) === ".")) {
	            this.debug("dot detected!", file, fr, pattern, pr)
	            break WHILE
	          }

	          // ** swallows a segment, and continue.
	          this.debug('globstar swallow a segment, and continue')
	          fr ++
	        }
	      }
	      // no match was found.
	      // However, in partial mode, we can't say this is necessarily over.
	      // If there's more *pattern* left, then 
	      if (partial) {
	        // ran out of file
	        this.debug("\n>>> no match, partial?", file, fr, pattern, pr)
	        if (fr === fl) return true
	      }
	      return false
	    }

	    // something other than **
	    // non-magic patterns just have to match exactly
	    // patterns with magic have been turned into regexps.
	    var hit
	    if (typeof p === "string") {
	      if (options.nocase) {
	        hit = f.toLowerCase() === p.toLowerCase()
	      } else {
	        hit = f === p
	      }
	      this.debug("string match", p, f, hit)
	    } else {
	      hit = f.match(p)
	      this.debug("pattern match", p, f, hit)
	    }

	    if (!hit) return false
	  }

	  // Note: ending in / means that we'll get a final ""
	  // at the end of the pattern.  This can only match a
	  // corresponding "" at the end of the file.
	  // If the file ends in /, then it can only match a
	  // a pattern that ends in /, unless the pattern just
	  // doesn't have any more for it. But, a/b/ should *not*
	  // match "a/b/*", even though "" matches against the
	  // [^/]*? pattern, except in partial mode, where it might
	  // simply not be reached yet.
	  // However, a/b/ should still satisfy a/*

	  // now either we fell off the end of the pattern, or we're done.
	  if (fi === fl && pi === pl) {
	    // ran out of pattern and filename at the same time.
	    // an exact hit!
	    return true
	  } else if (fi === fl) {
	    // ran out of file, but still had pattern left.
	    // this is ok if we're doing the match as part of
	    // a glob fs traversal.
	    return partial
	  } else if (pi === pl) {
	    // ran out of pattern, still have file left.
	    // this is only acceptable if we're on the very last
	    // empty segment of a file with a trailing slash.
	    // a/* should match a/b/
	    var emptyFileEnd = (fi === fl - 1) && (file[fi] === "")
	    return emptyFileEnd
	  }

	  // should be unreachable.
	  throw new Error("wtf?")
	}


	// replace stuff like \* with *
	function globUnescape (s) {
	  return s.replace(/\\(.)/g, "$1")
	}


	function regExpEscape (s) {
	  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
	}

	})( typeof require === "function" ? require : null,
	    this,
	     true ? module : null,
	    typeof process === "object" ? process.platform : "win32"
	  )

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)(module), __webpack_require__(1)))

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./minimatch": 25,
		"./minimatch.js": 25,
		"./test/basic": 30,
		"./test/basic.js": 30,
		"./test/brace-expand": 31,
		"./test/brace-expand.js": 31,
		"./test/caching": 32,
		"./test/caching.js": 32,
		"./test/defaults": 33,
		"./test/defaults.js": 33,
		"./test/extglob-ending-with-state-char": 34,
		"./test/extglob-ending-with-state-char.js": 34
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 26;


/***/ },
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// http://www.bashcookbook.com/bashinfo/source/bash-1.14.7/tests/glob-test
	//
	// TODO: Some of these tests do very bad things with backslashes, and will
	// most likely fail badly on windows.  They should probably be skipped.

	var tap = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"tap\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	  , globalBefore = Object.keys(global)
	  , mm = __webpack_require__(25)
	  , files = [ "a", "b", "c", "d", "abc"
	            , "abd", "abe", "bb", "bcd"
	            , "ca", "cb", "dd", "de"
	            , "bdir/", "bdir/cfile"]
	  , next = files.concat([ "a-b", "aXb"
	                        , ".x", ".y" ])


	var patterns =
	  [ "http://www.bashcookbook.com/bashinfo/source/bash-1.14.7/tests/glob-test"
	  , ["a*", ["a", "abc", "abd", "abe"]]
	  , ["X*", ["X*"], {nonull: true}]

	  // allow null glob expansion
	  , ["X*", []]

	  // isaacs: Slightly different than bash/sh/ksh
	  // \\* is not un-escaped to literal "*" in a failed match,
	  // but it does make it get treated as a literal star
	  , ["\\*", ["\\*"], {nonull: true}]
	  , ["\\**", ["\\**"], {nonull: true}]
	  , ["\\*\\*", ["\\*\\*"], {nonull: true}]

	  , ["b*/", ["bdir/"]]
	  , ["c*", ["c", "ca", "cb"]]
	  , ["**", files]

	  , ["\\.\\./*/", ["\\.\\./*/"], {nonull: true}]
	  , ["s/\\..*//", ["s/\\..*//"], {nonull: true}]

	  , "legendary larry crashes bashes"
	  , ["/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\\1/"
	    , ["/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\\1/"], {nonull: true}]
	  , ["/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\1/"
	    , ["/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\1/"], {nonull: true}]

	  , "character classes"
	  , ["[a-c]b*", ["abc", "abd", "abe", "bb", "cb"]]
	  , ["[a-y]*[^c]", ["abd", "abe", "bb", "bcd",
	     "bdir/", "ca", "cb", "dd", "de"]]
	  , ["a*[^c]", ["abd", "abe"]]
	  , function () { files.push("a-b", "aXb") }
	  , ["a[X-]b", ["a-b", "aXb"]]
	  , function () { files.push(".x", ".y") }
	  , ["[^a-c]*", ["d", "dd", "de"]]
	  , function () { files.push("a*b/", "a*b/ooo") }
	  , ["a\\*b/*", ["a*b/ooo"]]
	  , ["a\\*?/*", ["a*b/ooo"]]
	  , ["*\\\\!*", [], {null: true}, ["echo !7"]]
	  , ["*\\!*", ["echo !7"], null, ["echo !7"]]
	  , ["*.\\*", ["r.*"], null, ["r.*"]]
	  , ["a[b]c", ["abc"]]
	  , ["a[\\b]c", ["abc"]]
	  , ["a?c", ["abc"]]
	  , ["a\\*c", [], {null: true}, ["abc"]]
	  , ["", [""], { null: true }, [""]]

	  , "http://www.opensource.apple.com/source/bash/bash-23/" +
	    "bash/tests/glob-test"
	  , function () { files.push("man/", "man/man1/", "man/man1/bash.1") }
	  , ["*/man*/bash.*", ["man/man1/bash.1"]]
	  , ["man/man1/bash.1", ["man/man1/bash.1"]]
	  , ["a***c", ["abc"], null, ["abc"]]
	  , ["a*****?c", ["abc"], null, ["abc"]]
	  , ["?*****??", ["abc"], null, ["abc"]]
	  , ["*****??", ["abc"], null, ["abc"]]
	  , ["?*****?c", ["abc"], null, ["abc"]]
	  , ["?***?****c", ["abc"], null, ["abc"]]
	  , ["?***?****?", ["abc"], null, ["abc"]]
	  , ["?***?****", ["abc"], null, ["abc"]]
	  , ["*******c", ["abc"], null, ["abc"]]
	  , ["*******?", ["abc"], null, ["abc"]]
	  , ["a*cd**?**??k", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	  , ["a**?**cd**?**??k", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	  , ["a**?**cd**?**??k***", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	  , ["a**?**cd**?**??***k", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	  , ["a**?**cd**?**??***k**", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	  , ["a****c**?**??*****", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	  , ["[-abc]", ["-"], null, ["-"]]
	  , ["[abc-]", ["-"], null, ["-"]]
	  , ["\\", ["\\"], null, ["\\"]]
	  , ["[\\\\]", ["\\"], null, ["\\"]]
	  , ["[[]", ["["], null, ["["]]
	  , ["[", ["["], null, ["["]]
	  , ["[*", ["[abc"], null, ["[abc"]]
	  , "a right bracket shall lose its special meaning and\n" +
	    "represent itself in a bracket expression if it occurs\n" +
	    "first in the list.  -- POSIX.2 2.8.3.2"
	  , ["[]]", ["]"], null, ["]"]]
	  , ["[]-]", ["]"], null, ["]"]]
	  , ["[a-\z]", ["p"], null, ["p"]]
	  , ["??**********?****?", [], { null: true }, ["abc"]]
	  , ["??**********?****c", [], { null: true }, ["abc"]]
	  , ["?************c****?****", [], { null: true }, ["abc"]]
	  , ["*c*?**", [], { null: true }, ["abc"]]
	  , ["a*****c*?**", [], { null: true }, ["abc"]]
	  , ["a********???*******", [], { null: true }, ["abc"]]
	  , ["[]", [], { null: true }, ["a"]]
	  , ["[abc", [], { null: true }, ["["]]

	  , "nocase tests"
	  , ["XYZ", ["xYz"], { nocase: true, null: true }
	    , ["xYz", "ABC", "IjK"]]
	  , ["ab*", ["ABC"], { nocase: true, null: true }
	    , ["xYz", "ABC", "IjK"]]
	  , ["[ia]?[ck]", ["ABC", "IjK"], { nocase: true, null: true }
	    , ["xYz", "ABC", "IjK"]]

	  // [ pattern, [matches], MM opts, files, TAP opts]
	  , "onestar/twostar"
	  , ["{/*,*}", [], {null: true}, ["/asdf/asdf/asdf"]]
	  , ["{/?,*}", ["/a", "bb"], {null: true}
	    , ["/a", "/b/b", "/a/b/c", "bb"]]

	  , "dots should not match unless requested"
	  , ["**", ["a/b"], {}, ["a/b", "a/.d", ".a/.d"]]

	  // .. and . can only match patterns starting with .,
	  // even when options.dot is set.
	  , function () {
	      files = ["a/./b", "a/../b", "a/c/b", "a/.d/b"]
	    }
	  , ["a/*/b", ["a/c/b", "a/.d/b"], {dot: true}]
	  , ["a/.*/b", ["a/./b", "a/../b", "a/.d/b"], {dot: true}]
	  , ["a/*/b", ["a/c/b"], {dot:false}]
	  , ["a/.*/b", ["a/./b", "a/../b", "a/.d/b"], {dot: false}]


	  // this also tests that changing the options needs
	  // to change the cache key, even if the pattern is
	  // the same!
	  , ["**", ["a/b","a/.d",".a/.d"], { dot: true }
	    , [ ".a/.d", "a/.d", "a/b"]]

	  , "paren sets cannot contain slashes"
	  , ["*(a/b)", ["*(a/b)"], {nonull: true}, ["a/b"]]

	  // brace sets trump all else.
	  //
	  // invalid glob pattern.  fails on bash4 and bsdglob.
	  // however, in this implementation, it's easier just
	  // to do the intuitive thing, and let brace-expansion
	  // actually come before parsing any extglob patterns,
	  // like the documentation seems to say.
	  //
	  // XXX: if anyone complains about this, either fix it
	  // or tell them to grow up and stop complaining.
	  //
	  // bash/bsdglob says this:
	  // , ["*(a|{b),c)}", ["*(a|{b),c)}"], {}, ["a", "ab", "ac", "ad"]]
	  // but we do this instead:
	  , ["*(a|{b),c)}", ["a", "ab", "ac"], {}, ["a", "ab", "ac", "ad"]]

	  // test partial parsing in the presence of comment/negation chars
	  , ["[!a*", ["[!ab"], {}, ["[!ab", "[ab"]]
	  , ["[#a*", ["[#ab"], {}, ["[#ab", "[ab"]]

	  // like: {a,b|c\\,d\\\|e} except it's unclosed, so it has to be escaped.
	  , ["+(a|*\\|c\\\\|d\\\\\\|e\\\\\\\\|f\\\\\\\\\\|g"
	    , ["+(a|b\\|c\\\\|d\\\\|e\\\\\\\\|f\\\\\\\\|g"]
	    , {}
	    , ["+(a|b\\|c\\\\|d\\\\|e\\\\\\\\|f\\\\\\\\|g", "a", "b\\c"]]


	  // crazy nested {,,} and *(||) tests.
	  , function () {
	      files = [ "a", "b", "c", "d"
	              , "ab", "ac", "ad"
	              , "bc", "cb"
	              , "bc,d", "c,db", "c,d"
	              , "d)", "(b|c", "*(b|c"
	              , "b|c", "b|cc", "cb|c"
	              , "x(a|b|c)", "x(a|c)"
	              , "(a|b|c)", "(a|c)"]
	    }
	  , ["*(a|{b,c})", ["a", "b", "c", "ab", "ac"]]
	  , ["{a,*(b|c,d)}", ["a","(b|c", "*(b|c", "d)"]]
	  // a
	  // *(b|c)
	  // *(b|d)
	  , ["{a,*(b|{c,d})}", ["a","b", "bc", "cb", "c", "d"]]
	  , ["*(a|{b|c,c})", ["a", "b", "c", "ab", "ac", "bc", "cb"]]


	  // test various flag settings.
	  , [ "*(a|{b|c,c})", ["x(a|b|c)", "x(a|c)", "(a|b|c)", "(a|c)"]
	    , { noext: true } ]
	  , ["a?b", ["x/y/acb", "acb/"], {matchBase: true}
	    , ["x/y/acb", "acb/", "acb/d/e", "x/y/acb/d"] ]
	  , ["#*", ["#a", "#b"], {nocomment: true}, ["#a", "#b", "c#d"]]


	  // begin channelling Boole and deMorgan...
	  , "negation tests"
	  , function () {
	      files = ["d", "e", "!ab", "!abc", "a!b", "\\!a"]
	    }

	  // anything that is NOT a* matches.
	  , ["!a*", ["\\!a", "d", "e", "!ab", "!abc"]]

	  // anything that IS !a* matches.
	  , ["!a*", ["!ab", "!abc"], {nonegate: true}]

	  // anything that IS a* matches
	  , ["!!a*", ["a!b"]]

	  // anything that is NOT !a* matches
	  , ["!\\!a*", ["a!b", "d", "e", "\\!a"]]

	  // negation nestled within a pattern
	  , function () {
	      files = [ "foo.js"
	              , "foo.bar"
	              // can't match this one without negative lookbehind.
	              , "foo.js.js"
	              , "blar.js"
	              , "foo."
	              , "boo.js.boo" ]
	    }
	  , ["*.!(js)", ["foo.bar", "foo.", "boo.js.boo"] ]

	  // https://github.com/isaacs/minimatch/issues/5
	  , function () {
	      files = [ 'a/b/.x/c'
	              , 'a/b/.x/c/d'
	              , 'a/b/.x/c/d/e'
	              , 'a/b/.x'
	              , 'a/b/.x/'
	              , 'a/.x/b'
	              , '.x'
	              , '.x/'
	              , '.x/a'
	              , '.x/a/b'
	              , 'a/.x/b/.x/c'
	              , '.x/.x' ]
	  }
	  , ["**/.x/**", [ '.x/'
	                 , '.x/a'
	                 , '.x/a/b'
	                 , 'a/.x/b'
	                 , 'a/b/.x/'
	                 , 'a/b/.x/c'
	                 , 'a/b/.x/c/d'
	                 , 'a/b/.x/c/d/e' ] ]

	  ]

	var regexps =
	  [ '/^(?:(?=.)a[^/]*?)$/',
	    '/^(?:(?=.)X[^/]*?)$/',
	    '/^(?:(?=.)X[^/]*?)$/',
	    '/^(?:\\*)$/',
	    '/^(?:(?=.)\\*[^/]*?)$/',
	    '/^(?:\\*\\*)$/',
	    '/^(?:(?=.)b[^/]*?\\/)$/',
	    '/^(?:(?=.)c[^/]*?)$/',
	    '/^(?:(?:(?!(?:\\/|^)\\.).)*?)$/',
	    '/^(?:\\.\\.\\/(?!\\.)(?=.)[^/]*?\\/)$/',
	    '/^(?:s\\/(?=.)\\.\\.[^/]*?\\/)$/',
	    '/^(?:\\/\\^root:\\/\\{s\\/(?=.)\\^[^:][^/]*?:[^:][^/]*?:\\([^:]\\)[^/]*?\\.[^/]*?\\$\\/1\\/)$/',
	    '/^(?:\\/\\^root:\\/\\{s\\/(?=.)\\^[^:][^/]*?:[^:][^/]*?:\\([^:]\\)[^/]*?\\.[^/]*?\\$\\/\u0001\\/)$/',
	    '/^(?:(?!\\.)(?=.)[a-c]b[^/]*?)$/',
	    '/^(?:(?!\\.)(?=.)[a-y][^/]*?[^c])$/',
	    '/^(?:(?=.)a[^/]*?[^c])$/',
	    '/^(?:(?=.)a[X-]b)$/',
	    '/^(?:(?!\\.)(?=.)[^a-c][^/]*?)$/',
	    '/^(?:a\\*b\\/(?!\\.)(?=.)[^/]*?)$/',
	    '/^(?:(?=.)a\\*[^/]\\/(?!\\.)(?=.)[^/]*?)$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?\\\\\\![^/]*?)$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?\\![^/]*?)$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?\\.\\*)$/',
	    '/^(?:(?=.)a[b]c)$/',
	    '/^(?:(?=.)a[b]c)$/',
	    '/^(?:(?=.)a[^/]c)$/',
	    '/^(?:a\\*c)$/',
	    'false',
	    '/^(?:(?!\\.)(?=.)[^/]*?\\/(?=.)man[^/]*?\\/(?=.)bash\\.[^/]*?)$/',
	    '/^(?:man\\/man1\\/bash\\.1)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/]*?c)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]c)$/',
	    '/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/])$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/])$/',
	    '/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]c)$/',
	    '/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?c)$/',
	    '/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/])$/',
	    '/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?)$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c)$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/])$/',
	    '/^(?:(?=.)a[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/]k[^/]*?[^/]*?[^/]*?)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?k)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/][^/]*?[^/]*?cd[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?k[^/]*?[^/]*?)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?)$/',
	    '/^(?:(?!\\.)(?=.)[-abc])$/',
	    '/^(?:(?!\\.)(?=.)[abc-])$/',
	    '/^(?:\\\\)$/',
	    '/^(?:(?!\\.)(?=.)[\\\\])$/',
	    '/^(?:(?!\\.)(?=.)[\\[])$/',
	    '/^(?:\\[)$/',
	    '/^(?:(?=.)\\[(?!\\.)(?=.)[^/]*?)$/',
	    '/^(?:(?!\\.)(?=.)[\\]])$/',
	    '/^(?:(?!\\.)(?=.)[\\]-])$/',
	    '/^(?:(?!\\.)(?=.)[a-z])$/',
	    '/^(?:(?!\\.)(?=.)[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/])$/',
	    '/^(?:(?!\\.)(?=.)[^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?c)$/',
	    '/^(?:(?!\\.)(?=.)[^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/]*?[^/]*?[^/]*?[^/]*?)$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?c[^/]*?[^/][^/]*?[^/]*?)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?c[^/]*?[^/][^/]*?[^/]*?)$/',
	    '/^(?:(?=.)a[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/][^/][^/][^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?[^/]*?)$/',
	    '/^(?:\\[\\])$/',
	    '/^(?:\\[abc)$/',
	    '/^(?:(?=.)XYZ)$/i',
	    '/^(?:(?=.)ab[^/]*?)$/i',
	    '/^(?:(?!\\.)(?=.)[ia][^/][ck])$/i',
	    '/^(?:\\/(?!\\.)(?=.)[^/]*?|(?!\\.)(?=.)[^/]*?)$/',
	    '/^(?:\\/(?!\\.)(?=.)[^/]|(?!\\.)(?=.)[^/]*?)$/',
	    '/^(?:(?:(?!(?:\\/|^)\\.).)*?)$/',
	    '/^(?:a\\/(?!(?:^|\\/)\\.{1,2}(?:$|\\/))(?=.)[^/]*?\\/b)$/',
	    '/^(?:a\\/(?=.)\\.[^/]*?\\/b)$/',
	    '/^(?:a\\/(?!\\.)(?=.)[^/]*?\\/b)$/',
	    '/^(?:a\\/(?=.)\\.[^/]*?\\/b)$/',
	    '/^(?:(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?)$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?\\(a\\/b\\))$/',
	    '/^(?:(?!\\.)(?=.)(?:a|b)*|(?!\\.)(?=.)(?:a|c)*)$/',
	    '/^(?:(?=.)\\[(?=.)\\!a[^/]*?)$/',
	    '/^(?:(?=.)\\[(?=.)#a[^/]*?)$/',
	    '/^(?:(?=.)\\+\\(a\\|[^/]*?\\|c\\\\\\\\\\|d\\\\\\\\\\|e\\\\\\\\\\\\\\\\\\|f\\\\\\\\\\\\\\\\\\|g)$/',
	    '/^(?:(?!\\.)(?=.)(?:a|b)*|(?!\\.)(?=.)(?:a|c)*)$/',
	    '/^(?:a|(?!\\.)(?=.)[^/]*?\\(b\\|c|d\\))$/',
	    '/^(?:a|(?!\\.)(?=.)(?:b|c)*|(?!\\.)(?=.)(?:b|d)*)$/',
	    '/^(?:(?!\\.)(?=.)(?:a|b|c)*|(?!\\.)(?=.)(?:a|c)*)$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?\\(a\\|b\\|c\\)|(?!\\.)(?=.)[^/]*?\\(a\\|c\\))$/',
	    '/^(?:(?=.)a[^/]b)$/',
	    '/^(?:(?=.)#[^/]*?)$/',
	    '/^(?!^(?:(?=.)a[^/]*?)$).*$/',
	    '/^(?:(?=.)\\!a[^/]*?)$/',
	    '/^(?:(?=.)a[^/]*?)$/',
	    '/^(?!^(?:(?=.)\\!a[^/]*?)$).*$/',
	    '/^(?:(?!\\.)(?=.)[^/]*?\\.(?:(?!js)[^/]*?))$/',
	    '/^(?:(?:(?!(?:\\/|^)\\.).)*?\\/\\.x\\/(?:(?!(?:\\/|^)\\.).)*?)$/' ]
	var re = 0;

	tap.test("basic tests", function (t) {
	  var start = Date.now()

	  // [ pattern, [matches], MM opts, files, TAP opts]
	  patterns.forEach(function (c) {
	    if (typeof c === "function") return c()
	    if (typeof c === "string") return t.comment(c)

	    var pattern = c[0]
	      , expect = c[1].sort(alpha)
	      , options = c[2] || {}
	      , f = c[3] || files
	      , tapOpts = c[4] || {}

	    // options.debug = true
	    var m = new mm.Minimatch(pattern, options)
	    var r = m.makeRe()
	    var expectRe = regexps[re++]
	    tapOpts.re = String(r) || JSON.stringify(r)
	    tapOpts.files = JSON.stringify(f)
	    tapOpts.pattern = pattern
	    tapOpts.set = m.set
	    tapOpts.negated = m.negate

	    var actual = mm.match(f, pattern, options)
	    actual.sort(alpha)

	    t.equivalent( actual, expect
	                , JSON.stringify(pattern) + " " + JSON.stringify(expect)
	                , tapOpts )

	    t.equal(tapOpts.re, expectRe, tapOpts)
	  })

	  t.comment("time=" + (Date.now() - start) + "ms")
	  t.end()
	})

	tap.test("global leak test", function (t) {
	  var globalAfter = Object.keys(global)
	  t.equivalent(globalAfter, globalBefore, "no new globals, please")
	  t.end()
	})

	function alpha (a, b) {
	  return a > b ? 1 : -1
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var tap = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"tap\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	  , minimatch = __webpack_require__(25)

	tap.test("brace expansion", function (t) {
	  // [ pattern, [expanded] ]
	  ; [ [ "a{b,c{d,e},{f,g}h}x{y,z}"
	      , [ "abxy"
	        , "abxz"
	        , "acdxy"
	        , "acdxz"
	        , "acexy"
	        , "acexz"
	        , "afhxy"
	        , "afhxz"
	        , "aghxy"
	        , "aghxz" ] ]
	    , [ "a{1..5}b"
	      , [ "a1b"
	        , "a2b"
	        , "a3b"
	        , "a4b"
	        , "a5b" ] ]
	    , [ "a{b}c", ["a{b}c"] ]
	  ].forEach(function (tc) {
	    var p = tc[0]
	      , expect = tc[1]
	    t.equivalent(minimatch.braceExpand(p), expect, p)
	  })
	  console.error("ending")
	  t.end()
	})




/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var Minimatch = __webpack_require__(25).Minimatch
	var tap = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"tap\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	tap.test("cache test", function (t) {
	  var mm1 = new Minimatch("a?b")
	  var mm2 = new Minimatch("a?b")
	  t.equal(mm1, mm2, "should get the same object")
	  // the lru should drop it after 100 entries
	  for (var i = 0; i < 100; i ++) {
	    new Minimatch("a"+i)
	  }
	  mm2 = new Minimatch("a?b")
	  t.notEqual(mm1, mm2, "cache should have dropped")
	  t.end()
	})


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {// http://www.bashcookbook.com/bashinfo/source/bash-1.14.7/tests/glob-test
	//
	// TODO: Some of these tests do very bad things with backslashes, and will
	// most likely fail badly on windows.  They should probably be skipped.

	var tap = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"tap\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	  , globalBefore = Object.keys(global)
	  , mm = __webpack_require__(25)
	  , files = [ "a", "b", "c", "d", "abc"
	            , "abd", "abe", "bb", "bcd"
	            , "ca", "cb", "dd", "de"
	            , "bdir/", "bdir/cfile"]
	  , next = files.concat([ "a-b", "aXb"
	                        , ".x", ".y" ])

	tap.test("basic tests", function (t) {
	  var start = Date.now()

	  // [ pattern, [matches], MM opts, files, TAP opts]
	  ; [ "http://www.bashcookbook.com/bashinfo" +
	      "/source/bash-1.14.7/tests/glob-test"
	    , ["a*", ["a", "abc", "abd", "abe"]]
	    , ["X*", ["X*"], {nonull: true}]

	    // allow null glob expansion
	    , ["X*", []]

	    // isaacs: Slightly different than bash/sh/ksh
	    // \\* is not un-escaped to literal "*" in a failed match,
	    // but it does make it get treated as a literal star
	    , ["\\*", ["\\*"], {nonull: true}]
	    , ["\\**", ["\\**"], {nonull: true}]
	    , ["\\*\\*", ["\\*\\*"], {nonull: true}]

	    , ["b*/", ["bdir/"]]
	    , ["c*", ["c", "ca", "cb"]]
	    , ["**", files]

	    , ["\\.\\./*/", ["\\.\\./*/"], {nonull: true}]
	    , ["s/\\..*//", ["s/\\..*//"], {nonull: true}]

	    , "legendary larry crashes bashes"
	    , ["/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\\1/"
	      , ["/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\\1/"], {nonull: true}]
	    , ["/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\1/"
	      , ["/^root:/{s/^[^:]*:[^:]*:\([^:]*\).*$/\1/"], {nonull: true}]

	    , "character classes"
	    , ["[a-c]b*", ["abc", "abd", "abe", "bb", "cb"]]
	    , ["[a-y]*[^c]", ["abd", "abe", "bb", "bcd",
	       "bdir/", "ca", "cb", "dd", "de"]]
	    , ["a*[^c]", ["abd", "abe"]]
	    , function () { files.push("a-b", "aXb") }
	    , ["a[X-]b", ["a-b", "aXb"]]
	    , function () { files.push(".x", ".y") }
	    , ["[^a-c]*", ["d", "dd", "de"]]
	    , function () { files.push("a*b/", "a*b/ooo") }
	    , ["a\\*b/*", ["a*b/ooo"]]
	    , ["a\\*?/*", ["a*b/ooo"]]
	    , ["*\\\\!*", [], {null: true}, ["echo !7"]]
	    , ["*\\!*", ["echo !7"], null, ["echo !7"]]
	    , ["*.\\*", ["r.*"], null, ["r.*"]]
	    , ["a[b]c", ["abc"]]
	    , ["a[\\b]c", ["abc"]]
	    , ["a?c", ["abc"]]
	    , ["a\\*c", [], {null: true}, ["abc"]]
	    , ["", [""], { null: true }, [""]]

	    , "http://www.opensource.apple.com/source/bash/bash-23/" +
	      "bash/tests/glob-test"
	    , function () { files.push("man/", "man/man1/", "man/man1/bash.1") }
	    , ["*/man*/bash.*", ["man/man1/bash.1"]]
	    , ["man/man1/bash.1", ["man/man1/bash.1"]]
	    , ["a***c", ["abc"], null, ["abc"]]
	    , ["a*****?c", ["abc"], null, ["abc"]]
	    , ["?*****??", ["abc"], null, ["abc"]]
	    , ["*****??", ["abc"], null, ["abc"]]
	    , ["?*****?c", ["abc"], null, ["abc"]]
	    , ["?***?****c", ["abc"], null, ["abc"]]
	    , ["?***?****?", ["abc"], null, ["abc"]]
	    , ["?***?****", ["abc"], null, ["abc"]]
	    , ["*******c", ["abc"], null, ["abc"]]
	    , ["*******?", ["abc"], null, ["abc"]]
	    , ["a*cd**?**??k", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	    , ["a**?**cd**?**??k", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	    , ["a**?**cd**?**??k***", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	    , ["a**?**cd**?**??***k", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	    , ["a**?**cd**?**??***k**", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	    , ["a****c**?**??*****", ["abcdecdhjk"], null, ["abcdecdhjk"]]
	    , ["[-abc]", ["-"], null, ["-"]]
	    , ["[abc-]", ["-"], null, ["-"]]
	    , ["\\", ["\\"], null, ["\\"]]
	    , ["[\\\\]", ["\\"], null, ["\\"]]
	    , ["[[]", ["["], null, ["["]]
	    , ["[", ["["], null, ["["]]
	    , ["[*", ["[abc"], null, ["[abc"]]
	    , "a right bracket shall lose its special meaning and\n" +
	      "represent itself in a bracket expression if it occurs\n" +
	      "first in the list.  -- POSIX.2 2.8.3.2"
	    , ["[]]", ["]"], null, ["]"]]
	    , ["[]-]", ["]"], null, ["]"]]
	    , ["[a-\z]", ["p"], null, ["p"]]
	    , ["??**********?****?", [], { null: true }, ["abc"]]
	    , ["??**********?****c", [], { null: true }, ["abc"]]
	    , ["?************c****?****", [], { null: true }, ["abc"]]
	    , ["*c*?**", [], { null: true }, ["abc"]]
	    , ["a*****c*?**", [], { null: true }, ["abc"]]
	    , ["a********???*******", [], { null: true }, ["abc"]]
	    , ["[]", [], { null: true }, ["a"]]
	    , ["[abc", [], { null: true }, ["["]]

	    , "nocase tests"
	    , ["XYZ", ["xYz"], { nocase: true, null: true }
	      , ["xYz", "ABC", "IjK"]]
	    , ["ab*", ["ABC"], { nocase: true, null: true }
	      , ["xYz", "ABC", "IjK"]]
	    , ["[ia]?[ck]", ["ABC", "IjK"], { nocase: true, null: true }
	      , ["xYz", "ABC", "IjK"]]

	    // [ pattern, [matches], MM opts, files, TAP opts]
	    , "onestar/twostar"
	    , ["{/*,*}", [], {null: true}, ["/asdf/asdf/asdf"]]
	    , ["{/?,*}", ["/a", "bb"], {null: true}
	      , ["/a", "/b/b", "/a/b/c", "bb"]]

	    , "dots should not match unless requested"
	    , ["**", ["a/b"], {}, ["a/b", "a/.d", ".a/.d"]]

	    // .. and . can only match patterns starting with .,
	    // even when options.dot is set.
	    , function () {
	        files = ["a/./b", "a/../b", "a/c/b", "a/.d/b"]
	      }
	    , ["a/*/b", ["a/c/b", "a/.d/b"], {dot: true}]
	    , ["a/.*/b", ["a/./b", "a/../b", "a/.d/b"], {dot: true}]
	    , ["a/*/b", ["a/c/b"], {dot:false}]
	    , ["a/.*/b", ["a/./b", "a/../b", "a/.d/b"], {dot: false}]


	    // this also tests that changing the options needs
	    // to change the cache key, even if the pattern is
	    // the same!
	    , ["**", ["a/b","a/.d",".a/.d"], { dot: true }
	      , [ ".a/.d", "a/.d", "a/b"]]

	    , "paren sets cannot contain slashes"
	    , ["*(a/b)", ["*(a/b)"], {nonull: true}, ["a/b"]]

	    // brace sets trump all else.
	    //
	    // invalid glob pattern.  fails on bash4 and bsdglob.
	    // however, in this implementation, it's easier just
	    // to do the intuitive thing, and let brace-expansion
	    // actually come before parsing any extglob patterns,
	    // like the documentation seems to say.
	    //
	    // XXX: if anyone complains about this, either fix it
	    // or tell them to grow up and stop complaining.
	    //
	    // bash/bsdglob says this:
	    // , ["*(a|{b),c)}", ["*(a|{b),c)}"], {}, ["a", "ab", "ac", "ad"]]
	    // but we do this instead:
	    , ["*(a|{b),c)}", ["a", "ab", "ac"], {}, ["a", "ab", "ac", "ad"]]

	    // test partial parsing in the presence of comment/negation chars
	    , ["[!a*", ["[!ab"], {}, ["[!ab", "[ab"]]
	    , ["[#a*", ["[#ab"], {}, ["[#ab", "[ab"]]

	    // like: {a,b|c\\,d\\\|e} except it's unclosed, so it has to be escaped.
	    , ["+(a|*\\|c\\\\|d\\\\\\|e\\\\\\\\|f\\\\\\\\\\|g"
	      , ["+(a|b\\|c\\\\|d\\\\|e\\\\\\\\|f\\\\\\\\|g"]
	      , {}
	      , ["+(a|b\\|c\\\\|d\\\\|e\\\\\\\\|f\\\\\\\\|g", "a", "b\\c"]]


	    // crazy nested {,,} and *(||) tests.
	    , function () {
	        files = [ "a", "b", "c", "d"
	                , "ab", "ac", "ad"
	                , "bc", "cb"
	                , "bc,d", "c,db", "c,d"
	                , "d)", "(b|c", "*(b|c"
	                , "b|c", "b|cc", "cb|c"
	                , "x(a|b|c)", "x(a|c)"
	                , "(a|b|c)", "(a|c)"]
	      }
	    , ["*(a|{b,c})", ["a", "b", "c", "ab", "ac"]]
	    , ["{a,*(b|c,d)}", ["a","(b|c", "*(b|c", "d)"]]
	    // a
	    // *(b|c)
	    // *(b|d)
	    , ["{a,*(b|{c,d})}", ["a","b", "bc", "cb", "c", "d"]]
	    , ["*(a|{b|c,c})", ["a", "b", "c", "ab", "ac", "bc", "cb"]]


	    // test various flag settings.
	    , [ "*(a|{b|c,c})", ["x(a|b|c)", "x(a|c)", "(a|b|c)", "(a|c)"]
	      , { noext: true } ]
	    , ["a?b", ["x/y/acb", "acb/"], {matchBase: true}
	      , ["x/y/acb", "acb/", "acb/d/e", "x/y/acb/d"] ]
	    , ["#*", ["#a", "#b"], {nocomment: true}, ["#a", "#b", "c#d"]]


	    // begin channelling Boole and deMorgan...
	    , "negation tests"
	    , function () {
	        files = ["d", "e", "!ab", "!abc", "a!b", "\\!a"]
	      }

	    // anything that is NOT a* matches.
	    , ["!a*", ["\\!a", "d", "e", "!ab", "!abc"]]

	    // anything that IS !a* matches.
	    , ["!a*", ["!ab", "!abc"], {nonegate: true}]

	    // anything that IS a* matches
	    , ["!!a*", ["a!b"]]

	    // anything that is NOT !a* matches
	    , ["!\\!a*", ["a!b", "d", "e", "\\!a"]]

	    // negation nestled within a pattern
	    , function () {
	        files = [ "foo.js"
	                , "foo.bar"
	                // can't match this one without negative lookbehind.
	                , "foo.js.js"
	                , "blar.js"
	                , "foo."
	                , "boo.js.boo" ]
	      }
	    , ["*.!(js)", ["foo.bar", "foo.", "boo.js.boo"] ]

	    ].forEach(function (c) {
	      if (typeof c === "function") return c()
	      if (typeof c === "string") return t.comment(c)

	      var pattern = c[0]
	        , expect = c[1].sort(alpha)
	        , options = c[2] || {}
	        , f = c[3] || files
	        , tapOpts = c[4] || {}

	      // options.debug = true
	      var Class = mm.defaults(options).Minimatch
	      var m = new Class(pattern, {})
	      var r = m.makeRe()
	      tapOpts.re = String(r) || JSON.stringify(r)
	      tapOpts.files = JSON.stringify(f)
	      tapOpts.pattern = pattern
	      tapOpts.set = m.set
	      tapOpts.negated = m.negate

	      var actual = mm.match(f, pattern, options)
	      actual.sort(alpha)

	      t.equivalent( actual, expect
	                  , JSON.stringify(pattern) + " " + JSON.stringify(expect)
	                  , tapOpts )
	    })

	  t.comment("time=" + (Date.now() - start) + "ms")
	  t.end()
	})

	tap.test("global leak test", function (t) {
	  var globalAfter = Object.keys(global)
	  t.equivalent(globalAfter, globalBefore, "no new globals, please")
	  t.end()
	})

	function alpha (a, b) {
	  return a > b ? 1 : -1
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var test = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"tap\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).test
	var minimatch = __webpack_require__(25)

	test('extglob ending with statechar', function(t) {
	  t.notOk(minimatch('ax', 'a?(b*)'))
	  t.ok(minimatch('ax', '?(a*|b)'))
	  t.end()
	})


/***/ },
/* 35 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 36 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var argv = process.argv;

	module.exports = (function () {
		if (argv.indexOf('--no-color') !== -1 ||
			argv.indexOf('--no-colors') !== -1 ||
			argv.indexOf('--color=false') !== -1) {
			return false;
		}

		if (argv.indexOf('--color') !== -1 ||
			argv.indexOf('--colors') !== -1 ||
			argv.indexOf('--color=true') !== -1 ||
			argv.indexOf('--color=always') !== -1) {
			return true;
		}

		if (process.stdout && !process.stdout.isTTY) {
			return false;
		}

		if (process.platform === 'win32') {
			return true;
		}

		if ('COLORTERM' in process.env) {
			return true;
		}

		if (process.env.TERM === 'dumb') {
			return false;
		}

		if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
			return true;
		}

		return false;
	})();

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var inherits = __webpack_require__(11).inherits;
	var color = Base.color;

	/**
	 * Expose `Dot`.
	 */

	exports = module.exports = Dot;

	/**
	 * Initialize a new `Dot` matrix test reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function Dot(runner) {
	  Base.call(this, runner);

	  var self = this;
	  var width = Base.window.width * .75 | 0;
	  var n = -1;

	  runner.on('start', function() {
	    process.stdout.write('\n');
	  });

	  runner.on('pending', function() {
	    if (++n % width === 0) {
	      process.stdout.write('\n  ');
	    }
	    process.stdout.write(color('pending', Base.symbols.dot));
	  });

	  runner.on('pass', function(test) {
	    if (++n % width === 0) {
	      process.stdout.write('\n  ');
	    }
	    if (test.speed === 'slow') {
	      process.stdout.write(color('bright yellow', Base.symbols.dot));
	    } else {
	      process.stdout.write(color(test.speed, Base.symbols.dot));
	    }
	  });

	  runner.on('fail', function() {
	    if (++n % width === 0) {
	      process.stdout.write('\n  ');
	    }
	    process.stdout.write(color('fail', Base.symbols.dot));
	  });

	  runner.on('end', function() {
	    console.log();
	    self.epilogue();
	  });
	}

	/**
	 * Inherit from `Base.prototype`.
	 */
	inherits(Dot, Base);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var utils = __webpack_require__(11);

	/**
	 * Expose `Doc`.
	 */

	exports = module.exports = Doc;

	/**
	 * Initialize a new `Doc` reporter.
	 *
	 * @param {Runner} runner
	 * @api public
	 */
	function Doc(runner) {
	  Base.call(this, runner);

	  var indents = 2;

	  function indent() {
	    return Array(indents).join('  ');
	  }

	  runner.on('suite', function(suite) {
	    if (suite.root) {
	      return;
	    }
	    ++indents;
	    console.log('%s<section class="suite">', indent());
	    ++indents;
	    console.log('%s<h1>%s</h1>', indent(), utils.escape(suite.title));
	    console.log('%s<dl>', indent());
	  });

	  runner.on('suite end', function(suite) {
	    if (suite.root) {
	      return;
	    }
	    console.log('%s</dl>', indent());
	    --indents;
	    console.log('%s</section>', indent());
	    --indents;
	  });

	  runner.on('pass', function(test) {
	    console.log('%s  <dt>%s</dt>', indent(), utils.escape(test.title));
	    var code = utils.escape(utils.clean(test.body));
	    console.log('%s  <dd><pre><code>%s</code></pre></dd>', indent(), code);
	  });

	  runner.on('fail', function(test, err) {
	    console.log('%s  <dt class="error">%s</dt>', indent(), utils.escape(test.title));
	    var code = utils.escape(utils.clean(test.fn.body));
	    console.log('%s  <dd class="error"><pre><code>%s</code></pre></dd>', indent(), code);
	    console.log('%s  <dd class="error">%s</dd>', indent(), utils.escape(err));
	  });
	}


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);

	/**
	 * Expose `TAP`.
	 */

	exports = module.exports = TAP;

	/**
	 * Initialize a new `TAP` reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function TAP(runner) {
	  Base.call(this, runner);

	  var n = 1;
	  var passes = 0;
	  var failures = 0;

	  runner.on('start', function() {
	    var total = runner.grepTotal(runner.suite);
	    console.log('%d..%d', 1, total);
	  });

	  runner.on('test end', function() {
	    ++n;
	  });

	  runner.on('pending', function(test) {
	    console.log('ok %d %s # SKIP -', n, title(test));
	  });

	  runner.on('pass', function(test) {
	    passes++;
	    console.log('ok %d %s', n, title(test));
	  });

	  runner.on('fail', function(test, err) {
	    failures++;
	    console.log('not ok %d %s', n, title(test));
	    if (err.stack) {
	      console.log(err.stack.replace(/^/gm, '  '));
	    }
	  });

	  runner.on('end', function() {
	    console.log('# tests ' + (passes + failures));
	    console.log('# pass ' + passes);
	    console.log('# fail ' + failures);
	  });
	}

	/**
	 * Return a TAP-safe title of `test`
	 *
	 * @api private
	 * @param {Object} test
	 * @return {String}
	 */
	function title(test) {
	  return test.fullTitle().replace(/#/g, '');
	}


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);

	/**
	 * Expose `JSON`.
	 */

	exports = module.exports = JSONReporter;

	/**
	 * Initialize a new `JSON` reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function JSONReporter(runner) {
	  Base.call(this, runner);

	  var self = this;
	  var tests = [];
	  var pending = [];
	  var failures = [];
	  var passes = [];

	  runner.on('test end', function(test) {
	    tests.push(test);
	  });

	  runner.on('pass', function(test) {
	    passes.push(test);
	  });

	  runner.on('fail', function(test) {
	    failures.push(test);
	  });

	  runner.on('pending', function(test) {
	    pending.push(test);
	  });

	  runner.on('end', function() {
	    var obj = {
	      stats: self.stats,
	      tests: tests.map(clean),
	      pending: pending.map(clean),
	      failures: failures.map(clean),
	      passes: passes.map(clean)
	    };

	    runner.testResults = obj;

	    process.stdout.write(JSON.stringify(obj, null, 2));
	  });
	}

	/**
	 * Return a plain-object representation of `test`
	 * free of cyclic properties etc.
	 *
	 * @api private
	 * @param {Object} test
	 * @return {Object}
	 */
	function clean(test) {
	  return {
	    title: test.title,
	    fullTitle: test.fullTitle(),
	    duration: test.duration,
	    currentRetry: test.currentRetry(),
	    err: errorJSON(test.err || {})
	  };
	}

	/**
	 * Transform `error` into a JSON object.
	 *
	 * @api private
	 * @param {Error} err
	 * @return {Object}
	 */
	function errorJSON(err) {
	  var res = {};
	  Object.getOwnPropertyNames(err).forEach(function(key) {
	    res[key] = err[key];
	  }, err);
	  return res;
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* eslint-env browser */

	/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var utils = __webpack_require__(11);
	var Progress = __webpack_require__(43);
	var escapeRe = __webpack_require__(4);
	var escape = utils.escape;

	/**
	 * Save timer references to avoid Sinon interfering (see GH-237).
	 */

	/* eslint-disable no-unused-vars, no-native-reassign */
	var Date = global.Date;
	var setTimeout = global.setTimeout;
	var setInterval = global.setInterval;
	var clearTimeout = global.clearTimeout;
	var clearInterval = global.clearInterval;
	/* eslint-enable no-unused-vars, no-native-reassign */

	/**
	 * Expose `HTML`.
	 */

	exports = module.exports = HTML;

	/**
	 * Stats template.
	 */

	var statsTemplate = '<ul id="mocha-stats">'
	  + '<li class="progress"><canvas width="40" height="40"></canvas></li>'
	  + '<li class="passes"><a href="javascript:void(0);">passes:</a> <em>0</em></li>'
	  + '<li class="failures"><a href="javascript:void(0);">failures:</a> <em>0</em></li>'
	  + '<li class="duration">duration: <em>0</em>s</li>'
	  + '</ul>';

	/**
	 * Initialize a new `HTML` reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function HTML(runner) {
	  Base.call(this, runner);

	  var self = this;
	  var stats = this.stats;
	  var stat = fragment(statsTemplate);
	  var items = stat.getElementsByTagName('li');
	  var passes = items[1].getElementsByTagName('em')[0];
	  var passesLink = items[1].getElementsByTagName('a')[0];
	  var failures = items[2].getElementsByTagName('em')[0];
	  var failuresLink = items[2].getElementsByTagName('a')[0];
	  var duration = items[3].getElementsByTagName('em')[0];
	  var canvas = stat.getElementsByTagName('canvas')[0];
	  var report = fragment('<ul id="mocha-report"></ul>');
	  var stack = [report];
	  var progress;
	  var ctx;
	  var root = document.getElementById('mocha');

	  if (canvas.getContext) {
	    var ratio = window.devicePixelRatio || 1;
	    canvas.style.width = canvas.width;
	    canvas.style.height = canvas.height;
	    canvas.width *= ratio;
	    canvas.height *= ratio;
	    ctx = canvas.getContext('2d');
	    ctx.scale(ratio, ratio);
	    progress = new Progress();
	  }

	  if (!root) {
	    return error('#mocha div missing, add it to your document');
	  }

	  // pass toggle
	  on(passesLink, 'click', function() {
	    unhide();
	    var name = (/pass/).test(report.className) ? '' : ' pass';
	    report.className = report.className.replace(/fail|pass/g, '') + name;
	    if (report.className.trim()) {
	      hideSuitesWithout('test pass');
	    }
	  });

	  // failure toggle
	  on(failuresLink, 'click', function() {
	    unhide();
	    var name = (/fail/).test(report.className) ? '' : ' fail';
	    report.className = report.className.replace(/fail|pass/g, '') + name;
	    if (report.className.trim()) {
	      hideSuitesWithout('test fail');
	    }
	  });

	  root.appendChild(stat);
	  root.appendChild(report);

	  if (progress) {
	    progress.size(40);
	  }

	  runner.on('suite', function(suite) {
	    if (suite.root) {
	      return;
	    }

	    // suite
	    var url = self.suiteURL(suite);
	    var el = fragment('<li class="suite"><h1><a href="%s">%s</a></h1></li>', url, escape(suite.title));

	    // container
	    stack[0].appendChild(el);
	    stack.unshift(document.createElement('ul'));
	    el.appendChild(stack[0]);
	  });

	  runner.on('suite end', function(suite) {
	    if (suite.root) {
	      return;
	    }
	    stack.shift();
	  });

	  runner.on('fail', function(test) {
	    // For type = 'test' its possible that the test failed due to multiple
	    // done() calls. So report the issue here.
	    if (test.type === 'hook'
	      || test.type === 'test') {
	      runner.emit('test end', test);
	    }
	  });

	  runner.on('test end', function(test) {
	    // TODO: add to stats
	    var percent = stats.tests / this.total * 100 | 0;
	    if (progress) {
	      progress.update(percent).draw(ctx);
	    }

	    // update stats
	    var ms = new Date() - stats.start;
	    text(passes, stats.passes);
	    text(failures, stats.failures);
	    text(duration, (ms / 1000).toFixed(2));

	    // test
	    var el;
	    if (test.state === 'passed') {
	      var url = self.testURL(test);
	      el = fragment('<li class="test pass %e"><h2>%e<span class="duration">%ems</span> <a href="%s" class="replay">‣</a></h2></li>', test.speed, test.title, test.duration, url);
	    } else if (test.pending) {
	      el = fragment('<li class="test pass pending"><h2>%e</h2></li>', test.title);
	    } else {
	      el = fragment('<li class="test fail"><h2>%e <a href="%e" class="replay">‣</a></h2></li>', test.title, self.testURL(test));
	      var stackString; // Note: Includes leading newline
	      var message = test.err.toString();

	      // <=IE7 stringifies to [Object Error]. Since it can be overloaded, we
	      // check for the result of the stringifying.
	      if (message === '[object Error]') {
	        message = test.err.message;
	      }

	      if (test.err.stack) {
	        var indexOfMessage = test.err.stack.indexOf(test.err.message);
	        if (indexOfMessage === -1) {
	          stackString = test.err.stack;
	        } else {
	          stackString = test.err.stack.substr(test.err.message.length + indexOfMessage);
	        }
	      } else if (test.err.sourceURL && test.err.line !== undefined) {
	        // Safari doesn't give you a stack. Let's at least provide a source line.
	        stackString = '\n(' + test.err.sourceURL + ':' + test.err.line + ')';
	      }

	      stackString = stackString || '';

	      if (test.err.htmlMessage && stackString) {
	        el.appendChild(fragment('<div class="html-error">%s\n<pre class="error">%e</pre></div>', test.err.htmlMessage, stackString));
	      } else if (test.err.htmlMessage) {
	        el.appendChild(fragment('<div class="html-error">%s</div>', test.err.htmlMessage));
	      } else {
	        el.appendChild(fragment('<pre class="error">%e%e</pre>', message, stackString));
	      }
	    }

	    // toggle code
	    // TODO: defer
	    if (!test.pending) {
	      var h2 = el.getElementsByTagName('h2')[0];

	      on(h2, 'click', function() {
	        pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
	      });

	      var pre = fragment('<pre><code>%e</code></pre>', utils.clean(test.body));
	      el.appendChild(pre);
	      pre.style.display = 'none';
	    }

	    // Don't call .appendChild if #mocha-report was already .shift()'ed off the stack.
	    if (stack[0]) {
	      stack[0].appendChild(el);
	    }
	  });
	}

	/**
	 * Makes a URL, preserving querystring ("search") parameters.
	 *
	 * @param {string} s
	 * @return {string} A new URL.
	 */
	function makeUrl(s) {
	  var search = window.location.search;

	  // Remove previous grep query parameter if present
	  if (search) {
	    search = search.replace(/[?&]grep=[^&\s]*/g, '').replace(/^&/, '?');
	  }

	  return window.location.pathname + (search ? search + '&' : '?') + 'grep=' + encodeURIComponent(escapeRe(s));
	}

	/**
	 * Provide suite URL.
	 *
	 * @param {Object} [suite]
	 */
	HTML.prototype.suiteURL = function(suite) {
	  return makeUrl(suite.fullTitle());
	};

	/**
	 * Provide test URL.
	 *
	 * @param {Object} [test]
	 */
	HTML.prototype.testURL = function(test) {
	  return makeUrl(test.fullTitle());
	};

	/**
	 * Display error `msg`.
	 *
	 * @param {string} msg
	 */
	function error(msg) {
	  document.body.appendChild(fragment('<div id="mocha-error">%s</div>', msg));
	}

	/**
	 * Return a DOM fragment from `html`.
	 *
	 * @param {string} html
	 */
	function fragment(html) {
	  var args = arguments;
	  var div = document.createElement('div');
	  var i = 1;

	  div.innerHTML = html.replace(/%([se])/g, function(_, type) {
	    switch (type) {
	      case 's': return String(args[i++]);
	      case 'e': return escape(args[i++]);
	      // no default
	    }
	  });

	  return div.firstChild;
	}

	/**
	 * Check for suites that do not have elements
	 * with `classname`, and hide them.
	 *
	 * @param {text} classname
	 */
	function hideSuitesWithout(classname) {
	  var suites = document.getElementsByClassName('suite');
	  for (var i = 0; i < suites.length; i++) {
	    var els = suites[i].getElementsByClassName(classname);
	    if (!els.length) {
	      suites[i].className += ' hidden';
	    }
	  }
	}

	/**
	 * Unhide .hidden suites.
	 */
	function unhide() {
	  var els = document.getElementsByClassName('suite hidden');
	  for (var i = 0; i < els.length; ++i) {
	    els[i].className = els[i].className.replace('suite hidden', 'suite');
	  }
	}

	/**
	 * Set an element's text contents.
	 *
	 * @param {HTMLElement} el
	 * @param {string} contents
	 */
	function text(el, contents) {
	  if (el.textContent) {
	    el.textContent = contents;
	  } else {
	    el.innerText = contents;
	  }
	}

	/**
	 * Listen on `event` with callback `fn`.
	 */
	function on(el, event, fn) {
	  if (el.addEventListener) {
	    el.addEventListener(event, fn, false);
	  } else {
	    el.attachEvent('on' + event, fn);
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 43 */
/***/ function(module, exports) {

	/**
	 * Expose `Progress`.
	 */

	module.exports = Progress;

	/**
	 * Initialize a new `Progress` indicator.
	 */
	function Progress() {
	  this.percent = 0;
	  this.size(0);
	  this.fontSize(11);
	  this.font('helvetica, arial, sans-serif');
	}

	/**
	 * Set progress size to `size`.
	 *
	 * @api public
	 * @param {number} size
	 * @return {Progress} Progress instance.
	 */
	Progress.prototype.size = function(size) {
	  this._size = size;
	  return this;
	};

	/**
	 * Set text to `text`.
	 *
	 * @api public
	 * @param {string} text
	 * @return {Progress} Progress instance.
	 */
	Progress.prototype.text = function(text) {
	  this._text = text;
	  return this;
	};

	/**
	 * Set font size to `size`.
	 *
	 * @api public
	 * @param {number} size
	 * @return {Progress} Progress instance.
	 */
	Progress.prototype.fontSize = function(size) {
	  this._fontSize = size;
	  return this;
	};

	/**
	 * Set font to `family`.
	 *
	 * @param {string} family
	 * @return {Progress} Progress instance.
	 */
	Progress.prototype.font = function(family) {
	  this._font = family;
	  return this;
	};

	/**
	 * Update percentage to `n`.
	 *
	 * @param {number} n
	 * @return {Progress} Progress instance.
	 */
	Progress.prototype.update = function(n) {
	  this.percent = n;
	  return this;
	};

	/**
	 * Draw on `ctx`.
	 *
	 * @param {CanvasRenderingContext2d} ctx
	 * @return {Progress} Progress instance.
	 */
	Progress.prototype.draw = function(ctx) {
	  try {
	    var percent = Math.min(this.percent, 100);
	    var size = this._size;
	    var half = size / 2;
	    var x = half;
	    var y = half;
	    var rad = half - 1;
	    var fontSize = this._fontSize;

	    ctx.font = fontSize + 'px ' + this._font;

	    var angle = Math.PI * 2 * (percent / 100);
	    ctx.clearRect(0, 0, size, size);

	    // outer circle
	    ctx.strokeStyle = '#9f9f9f';
	    ctx.beginPath();
	    ctx.arc(x, y, rad, 0, angle, false);
	    ctx.stroke();

	    // inner circle
	    ctx.strokeStyle = '#eee';
	    ctx.beginPath();
	    ctx.arc(x, y, rad - 1, 0, angle, true);
	    ctx.stroke();

	    // text
	    var text = this._text || (percent | 0) + '%';
	    var w = ctx.measureText(text).width;

	    ctx.fillText(text, x - w / 2 + 1, y + fontSize / 2 - 1);
	  } catch (err) {
	    // don't fail if we can't render progress
	  }
	  return this;
	};


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var inherits = __webpack_require__(11).inherits;
	var color = Base.color;
	var cursor = Base.cursor;

	/**
	 * Expose `List`.
	 */

	exports = module.exports = List;

	/**
	 * Initialize a new `List` test reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function List(runner) {
	  Base.call(this, runner);

	  var self = this;
	  var n = 0;

	  runner.on('start', function() {
	    console.log();
	  });

	  runner.on('test', function(test) {
	    process.stdout.write(color('pass', '    ' + test.fullTitle() + ': '));
	  });

	  runner.on('pending', function(test) {
	    var fmt = color('checkmark', '  -')
	      + color('pending', ' %s');
	    console.log(fmt, test.fullTitle());
	  });

	  runner.on('pass', function(test) {
	    var fmt = color('checkmark', '  ' + Base.symbols.dot)
	      + color('pass', ' %s: ')
	      + color(test.speed, '%dms');
	    cursor.CR();
	    console.log(fmt, test.fullTitle(), test.duration);
	  });

	  runner.on('fail', function(test) {
	    cursor.CR();
	    console.log(color('fail', '  %d) %s'), ++n, test.fullTitle());
	  });

	  runner.on('end', self.epilogue.bind(self));
	}

	/**
	 * Inherit from `Base.prototype`.
	 */
	inherits(List, Base);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var inherits = __webpack_require__(11).inherits;

	/**
	 * Expose `Min`.
	 */

	exports = module.exports = Min;

	/**
	 * Initialize a new `Min` minimal test reporter (best used with --watch).
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function Min(runner) {
	  Base.call(this, runner);

	  runner.on('start', function() {
	    // clear screen
	    process.stdout.write('\u001b[2J');
	    // set cursor position
	    process.stdout.write('\u001b[1;3H');
	  });

	  runner.on('end', this.epilogue.bind(this));
	}

	/**
	 * Inherit from `Base.prototype`.
	 */
	inherits(Min, Base);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var inherits = __webpack_require__(11).inherits;
	var color = Base.color;
	var cursor = Base.cursor;

	/**
	 * Expose `Spec`.
	 */

	exports = module.exports = Spec;

	/**
	 * Initialize a new `Spec` test reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function Spec(runner) {
	  Base.call(this, runner);

	  var self = this;
	  var indents = 0;
	  var n = 0;

	  function indent() {
	    return Array(indents).join('  ');
	  }

	  runner.on('start', function() {
	    console.log();
	  });

	  runner.on('suite', function(suite) {
	    ++indents;
	    console.log(color('suite', '%s%s'), indent(), suite.title);
	  });

	  runner.on('suite end', function() {
	    --indents;
	    if (indents === 1) {
	      console.log();
	    }
	  });

	  runner.on('pending', function(test) {
	    var fmt = indent() + color('pending', '  - %s');
	    console.log(fmt, test.title);
	  });

	  runner.on('pass', function(test) {
	    var fmt;
	    if (test.speed === 'fast') {
	      fmt = indent()
	        + color('checkmark', '  ' + Base.symbols.ok)
	        + color('pass', ' %s');
	      cursor.CR();
	      console.log(fmt, test.title);
	    } else {
	      fmt = indent()
	        + color('checkmark', '  ' + Base.symbols.ok)
	        + color('pass', ' %s')
	        + color(test.speed, ' (%dms)');
	      cursor.CR();
	      console.log(fmt, test.title, test.duration);
	    }
	  });

	  runner.on('fail', function(test) {
	    cursor.CR();
	    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
	  });

	  runner.on('end', self.epilogue.bind(self));
	}

	/**
	 * Inherit from `Base.prototype`.
	 */
	inherits(Spec, Base);


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var inherits = __webpack_require__(11).inherits;

	/**
	 * Expose `Dot`.
	 */

	exports = module.exports = NyanCat;

	/**
	 * Initialize a new `Dot` matrix test reporter.
	 *
	 * @param {Runner} runner
	 * @api public
	 */

	function NyanCat(runner) {
	  Base.call(this, runner);

	  var self = this;
	  var width = Base.window.width * .75 | 0;
	  var nyanCatWidth = this.nyanCatWidth = 11;

	  this.colorIndex = 0;
	  this.numberOfLines = 4;
	  this.rainbowColors = self.generateColors();
	  this.scoreboardWidth = 5;
	  this.tick = 0;
	  this.trajectories = [[], [], [], []];
	  this.trajectoryWidthMax = (width - nyanCatWidth);

	  runner.on('start', function() {
	    Base.cursor.hide();
	    self.draw();
	  });

	  runner.on('pending', function() {
	    self.draw();
	  });

	  runner.on('pass', function() {
	    self.draw();
	  });

	  runner.on('fail', function() {
	    self.draw();
	  });

	  runner.on('end', function() {
	    Base.cursor.show();
	    for (var i = 0; i < self.numberOfLines; i++) {
	      write('\n');
	    }
	    self.epilogue();
	  });
	}

	/**
	 * Inherit from `Base.prototype`.
	 */
	inherits(NyanCat, Base);

	/**
	 * Draw the nyan cat
	 *
	 * @api private
	 */

	NyanCat.prototype.draw = function() {
	  this.appendRainbow();
	  this.drawScoreboard();
	  this.drawRainbow();
	  this.drawNyanCat();
	  this.tick = !this.tick;
	};

	/**
	 * Draw the "scoreboard" showing the number
	 * of passes, failures and pending tests.
	 *
	 * @api private
	 */

	NyanCat.prototype.drawScoreboard = function() {
	  var stats = this.stats;

	  function draw(type, n) {
	    write(' ');
	    write(Base.color(type, n));
	    write('\n');
	  }

	  draw('green', stats.passes);
	  draw('fail', stats.failures);
	  draw('pending', stats.pending);
	  write('\n');

	  this.cursorUp(this.numberOfLines);
	};

	/**
	 * Append the rainbow.
	 *
	 * @api private
	 */

	NyanCat.prototype.appendRainbow = function() {
	  var segment = this.tick ? '_' : '-';
	  var rainbowified = this.rainbowify(segment);

	  for (var index = 0; index < this.numberOfLines; index++) {
	    var trajectory = this.trajectories[index];
	    if (trajectory.length >= this.trajectoryWidthMax) {
	      trajectory.shift();
	    }
	    trajectory.push(rainbowified);
	  }
	};

	/**
	 * Draw the rainbow.
	 *
	 * @api private
	 */

	NyanCat.prototype.drawRainbow = function() {
	  var self = this;

	  this.trajectories.forEach(function(line) {
	    write('\u001b[' + self.scoreboardWidth + 'C');
	    write(line.join(''));
	    write('\n');
	  });

	  this.cursorUp(this.numberOfLines);
	};

	/**
	 * Draw the nyan cat
	 *
	 * @api private
	 */
	NyanCat.prototype.drawNyanCat = function() {
	  var self = this;
	  var startWidth = this.scoreboardWidth + this.trajectories[0].length;
	  var dist = '\u001b[' + startWidth + 'C';
	  var padding = '';

	  write(dist);
	  write('_,------,');
	  write('\n');

	  write(dist);
	  padding = self.tick ? '  ' : '   ';
	  write('_|' + padding + '/\\_/\\ ');
	  write('\n');

	  write(dist);
	  padding = self.tick ? '_' : '__';
	  var tail = self.tick ? '~' : '^';
	  write(tail + '|' + padding + this.face() + ' ');
	  write('\n');

	  write(dist);
	  padding = self.tick ? ' ' : '  ';
	  write(padding + '""  "" ');
	  write('\n');

	  this.cursorUp(this.numberOfLines);
	};

	/**
	 * Draw nyan cat face.
	 *
	 * @api private
	 * @return {string}
	 */

	NyanCat.prototype.face = function() {
	  var stats = this.stats;
	  if (stats.failures) {
	    return '( x .x)';
	  } else if (stats.pending) {
	    return '( o .o)';
	  } else if (stats.passes) {
	    return '( ^ .^)';
	  }
	  return '( - .-)';
	};

	/**
	 * Move cursor up `n`.
	 *
	 * @api private
	 * @param {number} n
	 */

	NyanCat.prototype.cursorUp = function(n) {
	  write('\u001b[' + n + 'A');
	};

	/**
	 * Move cursor down `n`.
	 *
	 * @api private
	 * @param {number} n
	 */

	NyanCat.prototype.cursorDown = function(n) {
	  write('\u001b[' + n + 'B');
	};

	/**
	 * Generate rainbow colors.
	 *
	 * @api private
	 * @return {Array}
	 */
	NyanCat.prototype.generateColors = function() {
	  var colors = [];

	  for (var i = 0; i < (6 * 7); i++) {
	    var pi3 = Math.floor(Math.PI / 3);
	    var n = (i * (1.0 / 6));
	    var r = Math.floor(3 * Math.sin(n) + 3);
	    var g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3);
	    var b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3);
	    colors.push(36 * r + 6 * g + b + 16);
	  }

	  return colors;
	};

	/**
	 * Apply rainbow to the given `str`.
	 *
	 * @api private
	 * @param {string} str
	 * @return {string}
	 */
	NyanCat.prototype.rainbowify = function(str) {
	  if (!Base.useColors) {
	    return str;
	  }
	  var color = this.rainbowColors[this.colorIndex % this.rainbowColors.length];
	  this.colorIndex += 1;
	  return '\u001b[38;5;' + color + 'm' + str + '\u001b[0m';
	};

	/**
	 * Stdout helper.
	 *
	 * @param {string} string A message to write to stdout.
	 */
	function write(string) {
	  process.stdout.write(string);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var utils = __webpack_require__(11);
	var inherits = utils.inherits;
	var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var escape = utils.escape;
	var mkdirp = __webpack_require__(49);
	var path = __webpack_require__(5);

	/**
	 * Save timer references to avoid Sinon interfering (see GH-237).
	 */

	/* eslint-disable no-unused-vars, no-native-reassign */
	var Date = global.Date;
	var setTimeout = global.setTimeout;
	var setInterval = global.setInterval;
	var clearTimeout = global.clearTimeout;
	var clearInterval = global.clearInterval;
	/* eslint-enable no-unused-vars, no-native-reassign */

	/**
	 * Expose `XUnit`.
	 */

	exports = module.exports = XUnit;

	/**
	 * Initialize a new `XUnit` reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function XUnit(runner, options) {
	  Base.call(this, runner);

	  var stats = this.stats;
	  var tests = [];
	  var self = this;

	  if (options.reporterOptions && options.reporterOptions.output) {
	    if (!fs.createWriteStream) {
	      throw new Error('file output not supported in browser');
	    }
	    mkdirp.sync(path.dirname(options.reporterOptions.output));
	    self.fileStream = fs.createWriteStream(options.reporterOptions.output);
	  }

	  runner.on('pending', function(test) {
	    tests.push(test);
	  });

	  runner.on('pass', function(test) {
	    tests.push(test);
	  });

	  runner.on('fail', function(test) {
	    tests.push(test);
	  });

	  runner.on('end', function() {
	    self.write(tag('testsuite', {
	      name: 'Mocha Tests',
	      tests: stats.tests,
	      failures: stats.failures,
	      errors: stats.failures,
	      skipped: stats.tests - stats.failures - stats.passes,
	      timestamp: (new Date()).toUTCString(),
	      time: (stats.duration / 1000) || 0
	    }, false));

	    tests.forEach(function(t) {
	      self.test(t);
	    });

	    self.write('</testsuite>');
	  });
	}

	/**
	 * Inherit from `Base.prototype`.
	 */
	inherits(XUnit, Base);

	/**
	 * Override done to close the stream (if it's a file).
	 *
	 * @param failures
	 * @param {Function} fn
	 */
	XUnit.prototype.done = function(failures, fn) {
	  if (this.fileStream) {
	    this.fileStream.end(function() {
	      fn(failures);
	    });
	  } else {
	    fn(failures);
	  }
	};

	/**
	 * Write out the given line.
	 *
	 * @param {string} line
	 */
	XUnit.prototype.write = function(line) {
	  if (this.fileStream) {
	    this.fileStream.write(line + '\n');
	  } else if (typeof process === 'object' && process.stdout) {
	    process.stdout.write(line + '\n');
	  } else {
	    console.log(line);
	  }
	};

	/**
	 * Output tag for the given `test.`
	 *
	 * @param {Test} test
	 */
	XUnit.prototype.test = function(test) {
	  var attrs = {
	    classname: test.parent.fullTitle(),
	    name: test.title,
	    time: (test.duration / 1000) || 0
	  };

	  if (test.state === 'failed') {
	    var err = test.err;
	    this.write(tag('testcase', attrs, false, tag('failure', {}, false, cdata(escape(err.message) + '\n' + err.stack))));
	  } else if (test.pending) {
	    this.write(tag('testcase', attrs, false, tag('skipped', {}, true)));
	  } else {
	    this.write(tag('testcase', attrs, true));
	  }
	};

	/**
	 * HTML tag helper.
	 *
	 * @param name
	 * @param attrs
	 * @param close
	 * @param content
	 * @return {string}
	 */
	function tag(name, attrs, close, content) {
	  var end = close ? '/>' : '>';
	  var pairs = [];
	  var tag;

	  for (var key in attrs) {
	    if (Object.prototype.hasOwnProperty.call(attrs, key)) {
	      pairs.push(key + '="' + escape(attrs[key]) + '"');
	    }
	  }

	  tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
	  if (content) {
	    tag += content + '</' + name + end;
	  }
	  return tag;
	}

	/**
	 * Return cdata escaped CDATA `str`.
	 */

	function cdata(str) {
	  return '<![CDATA[' + escape(str) + ']]>';
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(1)))

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {var path = __webpack_require__(5);
	var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var _0777 = parseInt('0777', 8);

	module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

	function mkdirP (p, opts, f, made) {
	    if (typeof opts === 'function') {
	        f = opts;
	        opts = {};
	    }
	    else if (!opts || typeof opts !== 'object') {
	        opts = { mode: opts };
	    }
	    
	    var mode = opts.mode;
	    var xfs = opts.fs || fs;
	    
	    if (mode === undefined) {
	        mode = _0777 & (~process.umask());
	    }
	    if (!made) made = null;
	    
	    var cb = f || function () {};
	    p = path.resolve(p);
	    
	    xfs.mkdir(p, mode, function (er) {
	        if (!er) {
	            made = made || p;
	            return cb(null, made);
	        }
	        switch (er.code) {
	            case 'ENOENT':
	                mkdirP(path.dirname(p), opts, function (er, made) {
	                    if (er) cb(er, made);
	                    else mkdirP(p, opts, cb, made);
	                });
	                break;

	            // In the case of any other error, just see if there's a dir
	            // there already.  If so, then hooray!  If not, then something
	            // is borked.
	            default:
	                xfs.stat(p, function (er2, stat) {
	                    // if the stat fails, then that's super weird.
	                    // let the original error be the failure reason.
	                    if (er2 || !stat.isDirectory()) cb(er, made)
	                    else cb(null, made);
	                });
	                break;
	        }
	    });
	}

	mkdirP.sync = function sync (p, opts, made) {
	    if (!opts || typeof opts !== 'object') {
	        opts = { mode: opts };
	    }
	    
	    var mode = opts.mode;
	    var xfs = opts.fs || fs;
	    
	    if (mode === undefined) {
	        mode = _0777 & (~process.umask());
	    }
	    if (!made) made = null;

	    p = path.resolve(p);

	    try {
	        xfs.mkdirSync(p, mode);
	        made = made || p;
	    }
	    catch (err0) {
	        switch (err0.code) {
	            case 'ENOENT' :
	                made = sync(path.dirname(p), opts, made);
	                sync(p, opts, made);
	                break;

	            // In the case of any other error, just see if there's a dir
	            // there already.  If so, then hooray!  If not, then something
	            // is borked.
	            default:
	                var stat;
	                try {
	                    stat = xfs.statSync(p);
	                }
	                catch (err1) {
	                    throw err0;
	                }
	                if (!stat.isDirectory()) throw err0;
	                break;
	        }
	    }

	    return made;
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var utils = __webpack_require__(11);

	/**
	 * Constants
	 */

	var SUITE_PREFIX = '$';

	/**
	 * Expose `Markdown`.
	 */

	exports = module.exports = Markdown;

	/**
	 * Initialize a new `Markdown` reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function Markdown(runner) {
	  Base.call(this, runner);

	  var level = 0;
	  var buf = '';

	  function title(str) {
	    return Array(level).join('#') + ' ' + str;
	  }

	  function mapTOC(suite, obj) {
	    var ret = obj;
	    var key = SUITE_PREFIX + suite.title;

	    obj = obj[key] = obj[key] || { suite: suite };
	    suite.suites.forEach(function(suite) {
	      mapTOC(suite, obj);
	    });

	    return ret;
	  }

	  function stringifyTOC(obj, level) {
	    ++level;
	    var buf = '';
	    var link;
	    for (var key in obj) {
	      if (key === 'suite') {
	        continue;
	      }
	      if (key !== SUITE_PREFIX) {
	        link = ' - [' + key.substring(1) + ']';
	        link += '(#' + utils.slug(obj[key].suite.fullTitle()) + ')\n';
	        buf += Array(level).join('  ') + link;
	      }
	      buf += stringifyTOC(obj[key], level);
	    }
	    return buf;
	  }

	  function generateTOC(suite) {
	    var obj = mapTOC(suite, {});
	    return stringifyTOC(obj, 0);
	  }

	  generateTOC(runner.suite);

	  runner.on('suite', function(suite) {
	    ++level;
	    var slug = utils.slug(suite.fullTitle());
	    buf += '<a name="' + slug + '"></a>' + '\n';
	    buf += title(suite.title) + '\n';
	  });

	  runner.on('suite end', function() {
	    --level;
	  });

	  runner.on('pass', function(test) {
	    var code = utils.clean(test.body);
	    buf += test.title + '.\n';
	    buf += '\n```js\n';
	    buf += code + '\n';
	    buf += '```\n\n';
	  });

	  runner.on('end', function() {
	    process.stdout.write('# TOC\n');
	    process.stdout.write(generateTOC(runner.suite));
	    process.stdout.write(buf);
	  });
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var inherits = __webpack_require__(11).inherits;
	var color = Base.color;
	var cursor = Base.cursor;

	/**
	 * Expose `Progress`.
	 */

	exports = module.exports = Progress;

	/**
	 * General progress bar color.
	 */

	Base.colors.progress = 90;

	/**
	 * Initialize a new `Progress` bar test reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 * @param {Object} options
	 */
	function Progress(runner, options) {
	  Base.call(this, runner);

	  var self = this;
	  var width = Base.window.width * .50 | 0;
	  var total = runner.total;
	  var complete = 0;
	  var lastN = -1;

	  // default chars
	  options = options || {};
	  options.open = options.open || '[';
	  options.complete = options.complete || '▬';
	  options.incomplete = options.incomplete || Base.symbols.dot;
	  options.close = options.close || ']';
	  options.verbose = false;

	  // tests started
	  runner.on('start', function() {
	    console.log();
	    cursor.hide();
	  });

	  // tests complete
	  runner.on('test end', function() {
	    complete++;

	    var percent = complete / total;
	    var n = width * percent | 0;
	    var i = width - n;

	    if (n === lastN && !options.verbose) {
	      // Don't re-render the line if it hasn't changed
	      return;
	    }
	    lastN = n;

	    cursor.CR();
	    process.stdout.write('\u001b[J');
	    process.stdout.write(color('progress', '  ' + options.open));
	    process.stdout.write(Array(n).join(options.complete));
	    process.stdout.write(Array(i).join(options.incomplete));
	    process.stdout.write(color('progress', options.close));
	    if (options.verbose) {
	      process.stdout.write(color('progress', ' ' + complete + ' of ' + total));
	    }
	  });

	  // tests are complete, output some stats
	  // and the failures if any
	  runner.on('end', function() {
	    cursor.show();
	    console.log();
	    self.epilogue();
	  });
	}

	/**
	 * Inherit from `Base.prototype`.
	 */
	inherits(Progress, Base);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);
	var inherits = __webpack_require__(11).inherits;
	var cursor = Base.cursor;
	var color = Base.color;

	/**
	 * Expose `Landing`.
	 */

	exports = module.exports = Landing;

	/**
	 * Airplane color.
	 */

	Base.colors.plane = 0;

	/**
	 * Airplane crash color.
	 */

	Base.colors['plane crash'] = 31;

	/**
	 * Runway color.
	 */

	Base.colors.runway = 90;

	/**
	 * Initialize a new `Landing` reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function Landing(runner) {
	  Base.call(this, runner);

	  var self = this;
	  var width = Base.window.width * .75 | 0;
	  var total = runner.total;
	  var stream = process.stdout;
	  var plane = color('plane', '✈');
	  var crashed = -1;
	  var n = 0;

	  function runway() {
	    var buf = Array(width).join('-');
	    return '  ' + color('runway', buf);
	  }

	  runner.on('start', function() {
	    stream.write('\n\n\n  ');
	    cursor.hide();
	  });

	  runner.on('test end', function(test) {
	    // check if the plane crashed
	    var col = crashed === -1 ? width * ++n / total | 0 : crashed;

	    // show the crash
	    if (test.state === 'failed') {
	      plane = color('plane crash', '✈');
	      crashed = col;
	    }

	    // render landing strip
	    stream.write('\u001b[' + (width + 1) + 'D\u001b[2A');
	    stream.write(runway());
	    stream.write('\n  ');
	    stream.write(color('runway', Array(col).join('⋅')));
	    stream.write(plane);
	    stream.write(color('runway', Array(width - col).join('⋅') + '\n'));
	    stream.write(runway());
	    stream.write('\u001b[0m');
	  });

	  runner.on('end', function() {
	    cursor.show();
	    console.log();
	    self.epilogue();
	  });
	}

	/**
	 * Inherit from `Base.prototype`.
	 */
	inherits(Landing, Base);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);

	/**
	 * Expose `JSONCov`.
	 */

	exports = module.exports = JSONCov;

	/**
	 * Initialize a new `JsCoverage` reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 * @param {boolean} output
	 */
	function JSONCov(runner, output) {
	  Base.call(this, runner);

	  output = arguments.length === 1 || output;
	  var self = this;
	  var tests = [];
	  var failures = [];
	  var passes = [];

	  runner.on('test end', function(test) {
	    tests.push(test);
	  });

	  runner.on('pass', function(test) {
	    passes.push(test);
	  });

	  runner.on('fail', function(test) {
	    failures.push(test);
	  });

	  runner.on('end', function() {
	    var cov = global._$jscoverage || {};
	    var result = self.cov = map(cov);
	    result.stats = self.stats;
	    result.tests = tests.map(clean);
	    result.failures = failures.map(clean);
	    result.passes = passes.map(clean);
	    if (!output) {
	      return;
	    }
	    process.stdout.write(JSON.stringify(result, null, 2));
	  });
	}

	/**
	 * Map jscoverage data to a JSON structure
	 * suitable for reporting.
	 *
	 * @api private
	 * @param {Object} cov
	 * @return {Object}
	 */

	function map(cov) {
	  var ret = {
	    instrumentation: 'node-jscoverage',
	    sloc: 0,
	    hits: 0,
	    misses: 0,
	    coverage: 0,
	    files: []
	  };

	  for (var filename in cov) {
	    if (Object.prototype.hasOwnProperty.call(cov, filename)) {
	      var data = coverage(filename, cov[filename]);
	      ret.files.push(data);
	      ret.hits += data.hits;
	      ret.misses += data.misses;
	      ret.sloc += data.sloc;
	    }
	  }

	  ret.files.sort(function(a, b) {
	    return a.filename.localeCompare(b.filename);
	  });

	  if (ret.sloc > 0) {
	    ret.coverage = (ret.hits / ret.sloc) * 100;
	  }

	  return ret;
	}

	/**
	 * Map jscoverage data for a single source file
	 * to a JSON structure suitable for reporting.
	 *
	 * @api private
	 * @param {string} filename name of the source file
	 * @param {Object} data jscoverage coverage data
	 * @return {Object}
	 */
	function coverage(filename, data) {
	  var ret = {
	    filename: filename,
	    coverage: 0,
	    hits: 0,
	    misses: 0,
	    sloc: 0,
	    source: {}
	  };

	  data.source.forEach(function(line, num) {
	    num++;

	    if (data[num] === 0) {
	      ret.misses++;
	      ret.sloc++;
	    } else if (data[num] !== undefined) {
	      ret.hits++;
	      ret.sloc++;
	    }

	    ret.source[num] = {
	      source: line,
	      coverage: data[num] === undefined ? '' : data[num]
	    };
	  });

	  ret.coverage = ret.hits / ret.sloc * 100;

	  return ret;
	}

	/**
	 * Return a plain-object representation of `test`
	 * free of cyclic properties etc.
	 *
	 * @api private
	 * @param {Object} test
	 * @return {Object}
	 */
	function clean(test) {
	  return {
	    duration: test.duration,
	    currentRetry: test.currentRetry(),
	    fullTitle: test.fullTitle(),
	    title: test.title
	  };
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(1)))

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname, process) {/**
	 * Module dependencies.
	 */

	var JSONCov = __webpack_require__(53);
	var readFileSync = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync;
	var join = __webpack_require__(5).join;

	/**
	 * Expose `HTMLCov`.
	 */

	exports = module.exports = HTMLCov;

	/**
	 * Initialize a new `JsCoverage` reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function HTMLCov(runner) {
	  var jade = __webpack_require__(55);
	  var file = join(__dirname, '/templates/coverage.jade');
	  var str = readFileSync(file, 'utf8');
	  var fn = jade.compile(str, { filename: file });
	  var self = this;

	  JSONCov.call(this, runner, false);

	  runner.on('end', function() {
	    process.stdout.write(fn({
	      cov: self.cov,
	      coverageClass: coverageClass
	    }));
	  });
	}

	/**
	 * Return coverage class for a given coverage percentage.
	 *
	 * @api private
	 * @param {number} coveragePctg
	 * @return {string}
	 */
	function coverageClass(coveragePctg) {
	  if (coveragePctg >= 75) {
	    return 'high';
	  }
	  if (coveragePctg >= 50) {
	    return 'medium';
	  }
	  if (coveragePctg >= 25) {
	    return 'low';
	  }
	  return 'terrible';
	}

	/* WEBPACK VAR INJECTION */}.call(exports, "/", __webpack_require__(1)))

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {
	module.exports = process.env.JADE_COV
	  ? __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib-cov/jade\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	  : __webpack_require__(56);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * Jade
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Parser = __webpack_require__(57)
	  , Lexer = __webpack_require__(58)
	  , Compiler = __webpack_require__(75)
	  , runtime = __webpack_require__(99)
	// if node
	  , fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	// end

	/**
	 * Library version.
	 */

	exports.version = '0.26.3';

	/**
	 * Expose self closing tags.
	 */

	exports.selfClosing = __webpack_require__(98);

	/**
	 * Default supported doctypes.
	 */

	exports.doctypes = __webpack_require__(97);

	/**
	 * Text filters.
	 */

	exports.filters = __webpack_require__(76);

	/**
	 * Utilities.
	 */

	exports.utils = __webpack_require__(100);

	/**
	 * Expose `Compiler`.
	 */

	exports.Compiler = Compiler;

	/**
	 * Expose `Parser`.
	 */

	exports.Parser = Parser;

	/**
	 * Expose `Lexer`.
	 */

	exports.Lexer = Lexer;

	/**
	 * Nodes.
	 */

	exports.nodes = __webpack_require__(59);

	/**
	 * Jade runtime helpers.
	 */

	exports.runtime = runtime;

	/**
	 * Template function cache.
	 */

	exports.cache = {};

	/**
	 * Parse the given `str` of jade and return a function body.
	 *
	 * @param {String} str
	 * @param {Object} options
	 * @return {String}
	 * @api private
	 */

	function parse(str, options){
	  try {
	    // Parse
	    var parser = new Parser(str, options.filename, options);

	    // Compile
	    var compiler = new (options.compiler || Compiler)(parser.parse(), options)
	      , js = compiler.compile();

	    // Debug compiler
	    if (options.debug) {
	      console.error('\nCompiled Function:\n\n\033[90m%s\033[0m', js.replace(/^/gm, '  '));
	    }

	    return ''
	      + 'var buf = [];\n'
	      + (options.self
	        ? 'var self = locals || {};\n' + js
	        : 'with (locals || {}) {\n' + js + '\n}\n')
	      + 'return buf.join("");';
	  } catch (err) {
	    parser = parser.context();
	    runtime.rethrow(err, parser.filename, parser.lexer.lineno);
	  }
	}

	/**
	 * Compile a `Function` representation of the given jade `str`.
	 *
	 * Options:
	 *
	 *   - `compileDebug` when `false` debugging code is stripped from the compiled template
	 *   - `client` when `true` the helper functions `escape()` etc will reference `jade.escape()`
	 *      for use with the Jade client-side runtime.js
	 *
	 * @param {String} str
	 * @param {Options} options
	 * @return {Function}
	 * @api public
	 */

	exports.compile = function(str, options){
	  var options = options || {}
	    , client = options.client
	    , filename = options.filename
	      ? JSON.stringify(options.filename)
	      : 'undefined'
	    , fn;

	  if (options.compileDebug !== false) {
	    fn = [
	        'var __jade = [{ lineno: 1, filename: ' + filename + ' }];'
	      , 'try {'
	      , parse(String(str), options)
	      , '} catch (err) {'
	      , '  rethrow(err, __jade[0].filename, __jade[0].lineno);'
	      , '}'
	    ].join('\n');
	  } else {
	    fn = parse(String(str), options);
	  }

	  if (client) {
	    fn = 'attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;\n' + fn;
	  }

	  fn = new Function('locals, attrs, escape, rethrow, merge', fn);

	  if (client) return fn;

	  return function(locals){
	    return fn(locals, runtime.attrs, runtime.escape, runtime.rethrow, runtime.merge);
	  };
	};

	/**
	 * Render the given `str` of jade and invoke
	 * the callback `fn(err, str)`.
	 *
	 * Options:
	 *
	 *   - `cache` enable template caching
	 *   - `filename` filename required for `include` / `extends` and caching
	 *
	 * @param {String} str
	 * @param {Object|Function} options or fn
	 * @param {Function} fn
	 * @api public
	 */

	exports.render = function(str, options, fn){
	  // swap args
	  if ('function' == typeof options) {
	    fn = options, options = {};
	  }

	  // cache requires .filename
	  if (options.cache && !options.filename) {
	    return fn(new Error('the "filename" option is required for caching'));
	  }

	  try {
	    var path = options.filename;
	    var tmpl = options.cache
	      ? exports.cache[path] || (exports.cache[path] = exports.compile(str, options))
	      : exports.compile(str, options);
	    fn(null, tmpl(options));
	  } catch (err) {
	    fn(err);
	  }
	};

	/**
	 * Render a Jade file at the given `path` and callback `fn(err, str)`.
	 *
	 * @param {String} path
	 * @param {Object|Function} options or callback
	 * @param {Function} fn
	 * @api public
	 */

	exports.renderFile = function(path, options, fn){
	  var key = path + ':string';

	  if ('function' == typeof options) {
	    fn = options, options = {};
	  }

	  try {
	    options.filename = path;
	    var str = options.cache
	      ? exports.cache[key] || (exports.cache[key] = fs.readFileSync(path, 'utf8'))
	      : fs.readFileSync(path, 'utf8');
	    exports.render(str, options, fn);
	  } catch (err) {
	    fn(err);
	  }
	};

	/**
	 * Express support.
	 */

	exports.__express = exports.renderFile;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - Parser
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Lexer = __webpack_require__(58)
	  , nodes = __webpack_require__(59);

	/**
	 * Initialize `Parser` with the given input `str` and `filename`.
	 *
	 * @param {String} str
	 * @param {String} filename
	 * @param {Object} options
	 * @api public
	 */

	var Parser = exports = module.exports = function Parser(str, filename, options){
	  this.input = str;
	  this.lexer = new Lexer(str, options);
	  this.filename = filename;
	  this.blocks = {};
	  this.mixins = {};
	  this.options = options;
	  this.contexts = [this];
	};

	/**
	 * Tags that may not contain tags.
	 */

	var textOnly = exports.textOnly = ['script', 'style'];

	/**
	 * Parser prototype.
	 */

	Parser.prototype = {

	  /**
	   * Push `parser` onto the context stack,
	   * or pop and return a `Parser`.
	   */

	  context: function(parser){
	    if (parser) {
	      this.contexts.push(parser);
	    } else {
	      return this.contexts.pop();
	    }
	  },

	  /**
	   * Return the next token object.
	   *
	   * @return {Object}
	   * @api private
	   */

	  advance: function(){
	    return this.lexer.advance();
	  },

	  /**
	   * Skip `n` tokens.
	   *
	   * @param {Number} n
	   * @api private
	   */

	  skip: function(n){
	    while (n--) this.advance();
	  },
	  
	  /**
	   * Single token lookahead.
	   *
	   * @return {Object}
	   * @api private
	   */
	  
	  peek: function() {
	    return this.lookahead(1);
	  },
	  
	  /**
	   * Return lexer lineno.
	   *
	   * @return {Number}
	   * @api private
	   */
	  
	  line: function() {
	    return this.lexer.lineno;
	  },
	  
	  /**
	   * `n` token lookahead.
	   *
	   * @param {Number} n
	   * @return {Object}
	   * @api private
	   */
	  
	  lookahead: function(n){
	    return this.lexer.lookahead(n);
	  },
	  
	  /**
	   * Parse input returning a string of js for evaluation.
	   *
	   * @return {String}
	   * @api public
	   */
	  
	  parse: function(){
	    var block = new nodes.Block, parser;
	    block.line = this.line();

	    while ('eos' != this.peek().type) {
	      if ('newline' == this.peek().type) {
	        this.advance();
	      } else {
	        block.push(this.parseExpr());
	      }
	    }

	    if (parser = this.extending) {
	      this.context(parser);
	      var ast = parser.parse();
	      this.context();
	      // hoist mixins
	      for (var name in this.mixins)
	        ast.unshift(this.mixins[name]);
	      return ast;
	    }

	    return block;
	  },
	  
	  /**
	   * Expect the given type, or throw an exception.
	   *
	   * @param {String} type
	   * @api private
	   */
	  
	  expect: function(type){
	    if (this.peek().type === type) {
	      return this.advance();
	    } else {
	      throw new Error('expected "' + type + '", but got "' + this.peek().type + '"');
	    }
	  },
	  
	  /**
	   * Accept the given `type`.
	   *
	   * @param {String} type
	   * @api private
	   */
	  
	  accept: function(type){
	    if (this.peek().type === type) {
	      return this.advance();
	    }
	  },
	  
	  /**
	   *   tag
	   * | doctype
	   * | mixin
	   * | include
	   * | filter
	   * | comment
	   * | text
	   * | each
	   * | code
	   * | yield
	   * | id
	   * | class
	   * | interpolation
	   */
	  
	  parseExpr: function(){
	    switch (this.peek().type) {
	      case 'tag':
	        return this.parseTag();
	      case 'mixin':
	        return this.parseMixin();
	      case 'block':
	        return this.parseBlock();
	      case 'case':
	        return this.parseCase();
	      case 'when':
	        return this.parseWhen();
	      case 'default':
	        return this.parseDefault();
	      case 'extends':
	        return this.parseExtends();
	      case 'include':
	        return this.parseInclude();
	      case 'doctype':
	        return this.parseDoctype();
	      case 'filter':
	        return this.parseFilter();
	      case 'comment':
	        return this.parseComment();
	      case 'text':
	        return this.parseText();
	      case 'each':
	        return this.parseEach();
	      case 'code':
	        return this.parseCode();
	      case 'call':
	        return this.parseCall();
	      case 'interpolation':
	        return this.parseInterpolation();
	      case 'yield':
	        this.advance();
	        var block = new nodes.Block;
	        block.yield = true;
	        return block;
	      case 'id':
	      case 'class':
	        var tok = this.advance();
	        this.lexer.defer(this.lexer.tok('tag', 'div'));
	        this.lexer.defer(tok);
	        return this.parseExpr();
	      default:
	        throw new Error('unexpected token "' + this.peek().type + '"');
	    }
	  },
	  
	  /**
	   * Text
	   */
	  
	  parseText: function(){
	    var tok = this.expect('text')
	      , node = new nodes.Text(tok.val);
	    node.line = this.line();
	    return node;
	  },

	  /**
	   *   ':' expr
	   * | block
	   */

	  parseBlockExpansion: function(){
	    if (':' == this.peek().type) {
	      this.advance();
	      return new nodes.Block(this.parseExpr());
	    } else {
	      return this.block();
	    }
	  },

	  /**
	   * case
	   */

	  parseCase: function(){
	    var val = this.expect('case').val
	      , node = new nodes.Case(val);
	    node.line = this.line();
	    node.block = this.block();
	    return node;
	  },

	  /**
	   * when
	   */

	  parseWhen: function(){
	    var val = this.expect('when').val
	    return new nodes.Case.When(val, this.parseBlockExpansion());
	  },
	  
	  /**
	   * default
	   */

	  parseDefault: function(){
	    this.expect('default');
	    return new nodes.Case.When('default', this.parseBlockExpansion());
	  },

	  /**
	   * code
	   */
	  
	  parseCode: function(){
	    var tok = this.expect('code')
	      , node = new nodes.Code(tok.val, tok.buffer, tok.escape)
	      , block
	      , i = 1;
	    node.line = this.line();
	    while (this.lookahead(i) && 'newline' == this.lookahead(i).type) ++i;
	    block = 'indent' == this.lookahead(i).type;
	    if (block) {
	      this.skip(i-1);
	      node.block = this.block();
	    }
	    return node;
	  },
	  
	  /**
	   * comment
	   */
	  
	  parseComment: function(){
	    var tok = this.expect('comment')
	      , node;

	    if ('indent' == this.peek().type) {
	      node = new nodes.BlockComment(tok.val, this.block(), tok.buffer);
	    } else {
	      node = new nodes.Comment(tok.val, tok.buffer);
	    }

	    node.line = this.line();
	    return node;
	  },
	  
	  /**
	   * doctype
	   */
	  
	  parseDoctype: function(){
	    var tok = this.expect('doctype')
	      , node = new nodes.Doctype(tok.val);
	    node.line = this.line();
	    return node;
	  },
	  
	  /**
	   * filter attrs? text-block
	   */
	  
	  parseFilter: function(){
	    var block
	      , tok = this.expect('filter')
	      , attrs = this.accept('attrs');

	    this.lexer.pipeless = true;
	    block = this.parseTextBlock();
	    this.lexer.pipeless = false;

	    var node = new nodes.Filter(tok.val, block, attrs && attrs.attrs);
	    node.line = this.line();
	    return node;
	  },
	  
	  /**
	   * tag ':' attrs? block
	   */
	  
	  parseASTFilter: function(){
	    var block
	      , tok = this.expect('tag')
	      , attrs = this.accept('attrs');

	    this.expect(':');
	    block = this.block();

	    var node = new nodes.Filter(tok.val, block, attrs && attrs.attrs);
	    node.line = this.line();
	    return node;
	  },
	  
	  /**
	   * each block
	   */
	  
	  parseEach: function(){
	    var tok = this.expect('each')
	      , node = new nodes.Each(tok.code, tok.val, tok.key);
	    node.line = this.line();
	    node.block = this.block();
	    return node;
	  },

	  /**
	   * 'extends' name
	   */

	  parseExtends: function(){
	    var path = __webpack_require__(5)
	      , fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	      , dirname = path.dirname
	      , basename = path.basename
	      , join = path.join;

	    if (!this.filename)
	      throw new Error('the "filename" option is required to extend templates');

	    var path = this.expect('extends').val.trim()
	      , dir = dirname(this.filename);

	    var path = join(dir, path + '.jade')
	      , str = fs.readFileSync(path, 'utf8')
	      , parser = new Parser(str, path, this.options);

	    parser.blocks = this.blocks;
	    parser.contexts = this.contexts;
	    this.extending = parser;

	    // TODO: null node
	    return new nodes.Literal('');
	  },

	  /**
	   * 'block' name block
	   */

	  parseBlock: function(){
	    var block = this.expect('block')
	      , mode = block.mode
	      , name = block.val.trim();

	    block = 'indent' == this.peek().type
	      ? this.block()
	      : new nodes.Block(new nodes.Literal(''));

	    var prev = this.blocks[name];

	    if (prev) {
	      switch (prev.mode) {
	        case 'append':
	          block.nodes = block.nodes.concat(prev.nodes);
	          prev = block;
	          break;
	        case 'prepend':
	          block.nodes = prev.nodes.concat(block.nodes);
	          prev = block;
	          break;
	      }
	    }

	    block.mode = mode;
	    return this.blocks[name] = prev || block;
	  },

	  /**
	   * include block?
	   */

	  parseInclude: function(){
	    var path = __webpack_require__(5)
	      , fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	      , dirname = path.dirname
	      , basename = path.basename
	      , join = path.join;

	    var path = this.expect('include').val.trim()
	      , dir = dirname(this.filename);

	    if (!this.filename)
	      throw new Error('the "filename" option is required to use includes');

	    // no extension
	    if (!~basename(path).indexOf('.')) {
	      path += '.jade';
	    }

	    // non-jade
	    if ('.jade' != path.substr(-5)) {
	      var path = join(dir, path)
	        , str = fs.readFileSync(path, 'utf8');
	      return new nodes.Literal(str);
	    }

	    var path = join(dir, path)
	      , str = fs.readFileSync(path, 'utf8')
	     , parser = new Parser(str, path, this.options);
	    parser.blocks = this.blocks;
	    parser.mixins = this.mixins;

	    this.context(parser);
	    var ast = parser.parse();
	    this.context();
	    ast.filename = path;

	    if ('indent' == this.peek().type) {
	      ast.includeBlock().push(this.block());
	    }

	    return ast;
	  },

	  /**
	   * call ident block
	   */

	  parseCall: function(){
	    var tok = this.expect('call')
	      , name = tok.val
	      , args = tok.args
	      , mixin = new nodes.Mixin(name, args, new nodes.Block, true);

	    this.tag(mixin);
	    if (mixin.block.isEmpty()) mixin.block = null;
	    return mixin;
	  },

	  /**
	   * mixin block
	   */

	  parseMixin: function(){
	    var tok = this.expect('mixin')
	      , name = tok.val
	      , args = tok.args
	      , mixin;

	    // definition
	    if ('indent' == this.peek().type) {
	      mixin = new nodes.Mixin(name, args, this.block(), false);
	      this.mixins[name] = mixin;
	      return mixin;
	    // call
	    } else {
	      return new nodes.Mixin(name, args, null, true);
	    }
	  },

	  /**
	   * indent (text | newline)* outdent
	   */

	  parseTextBlock: function(){
	    var block = new nodes.Block;
	    block.line = this.line();
	    var spaces = this.expect('indent').val;
	    if (null == this._spaces) this._spaces = spaces;
	    var indent = Array(spaces - this._spaces + 1).join(' ');
	    while ('outdent' != this.peek().type) {
	      switch (this.peek().type) {
	        case 'newline':
	          this.advance();
	          break;
	        case 'indent':
	          this.parseTextBlock().nodes.forEach(function(node){
	            block.push(node);
	          });
	          break;
	        default:
	          var text = new nodes.Text(indent + this.advance().val);
	          text.line = this.line();
	          block.push(text);
	      }
	    }

	    if (spaces == this._spaces) this._spaces = null;
	    this.expect('outdent');
	    return block;
	  },

	  /**
	   * indent expr* outdent
	   */
	  
	  block: function(){
	    var block = new nodes.Block;
	    block.line = this.line();
	    this.expect('indent');
	    while ('outdent' != this.peek().type) {
	      if ('newline' == this.peek().type) {
	        this.advance();
	      } else {
	        block.push(this.parseExpr());
	      }
	    }
	    this.expect('outdent');
	    return block;
	  },

	  /**
	   * interpolation (attrs | class | id)* (text | code | ':')? newline* block?
	   */
	  
	  parseInterpolation: function(){
	    var tok = this.advance();
	    var tag = new nodes.Tag(tok.val);
	    tag.buffer = true;
	    return this.tag(tag);
	  },

	  /**
	   * tag (attrs | class | id)* (text | code | ':')? newline* block?
	   */
	  
	  parseTag: function(){
	    // ast-filter look-ahead
	    var i = 2;
	    if ('attrs' == this.lookahead(i).type) ++i;
	    if (':' == this.lookahead(i).type) {
	      if ('indent' == this.lookahead(++i).type) {
	        return this.parseASTFilter();
	      }
	    }

	    var tok = this.advance()
	      , tag = new nodes.Tag(tok.val);

	    tag.selfClosing = tok.selfClosing;

	    return this.tag(tag);
	  },

	  /**
	   * Parse tag.
	   */

	  tag: function(tag){
	    var dot;

	    tag.line = this.line();

	    // (attrs | class | id)*
	    out:
	      while (true) {
	        switch (this.peek().type) {
	          case 'id':
	          case 'class':
	            var tok = this.advance();
	            tag.setAttribute(tok.type, "'" + tok.val + "'");
	            continue;
	          case 'attrs':
	            var tok = this.advance()
	              , obj = tok.attrs
	              , escaped = tok.escaped
	              , names = Object.keys(obj);

	            if (tok.selfClosing) tag.selfClosing = true;

	            for (var i = 0, len = names.length; i < len; ++i) {
	              var name = names[i]
	                , val = obj[name];
	              tag.setAttribute(name, val, escaped[name]);
	            }
	            continue;
	          default:
	            break out;
	        }
	      }

	    // check immediate '.'
	    if ('.' == this.peek().val) {
	      dot = tag.textOnly = true;
	      this.advance();
	    }

	    // (text | code | ':')?
	    switch (this.peek().type) {
	      case 'text':
	        tag.block.push(this.parseText());
	        break;
	      case 'code':
	        tag.code = this.parseCode();
	        break;
	      case ':':
	        this.advance();
	        tag.block = new nodes.Block;
	        tag.block.push(this.parseExpr());
	        break;
	    }

	    // newline*
	    while ('newline' == this.peek().type) this.advance();

	    tag.textOnly = tag.textOnly || ~textOnly.indexOf(tag.name);

	    // script special-case
	    if ('script' == tag.name) {
	      var type = tag.getAttribute('type');
	      if (!dot && type && 'text/javascript' != type.replace(/^['"]|['"]$/g, '')) {
	        tag.textOnly = false;
	      }
	    }

	    // block?
	    if ('indent' == this.peek().type) {
	      if (tag.textOnly) {
	        this.lexer.pipeless = true;
	        tag.block = this.parseTextBlock();
	        this.lexer.pipeless = false;
	      } else {
	        var block = this.block();
	        if (tag.block) {
	          for (var i = 0, len = block.nodes.length; i < len; ++i) {
	            tag.block.push(block.nodes[i]);
	          }
	        } else {
	          tag.block = block;
	        }
	      }
	    }
	    
	    return tag;
	  }
	};


/***/ },
/* 58 */
/***/ function(module, exports) {

	
	/*!
	 * Jade - Lexer
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Initialize `Lexer` with the given `str`.
	 *
	 * Options:
	 *
	 *   - `colons` allow colons for attr delimiters
	 *
	 * @param {String} str
	 * @param {Object} options
	 * @api private
	 */

	var Lexer = module.exports = function Lexer(str, options) {
	  options = options || {};
	  this.input = str.replace(/\r\n|\r/g, '\n');
	  this.colons = options.colons;
	  this.deferredTokens = [];
	  this.lastIndents = 0;
	  this.lineno = 1;
	  this.stash = [];
	  this.indentStack = [];
	  this.indentRe = null;
	  this.pipeless = false;
	};

	/**
	 * Lexer prototype.
	 */

	Lexer.prototype = {
	  
	  /**
	   * Construct a token with the given `type` and `val`.
	   *
	   * @param {String} type
	   * @param {String} val
	   * @return {Object}
	   * @api private
	   */
	  
	  tok: function(type, val){
	    return {
	        type: type
	      , line: this.lineno
	      , val: val
	    }
	  },
	  
	  /**
	   * Consume the given `len` of input.
	   *
	   * @param {Number} len
	   * @api private
	   */
	  
	  consume: function(len){
	    this.input = this.input.substr(len);
	  },
	  
	  /**
	   * Scan for `type` with the given `regexp`.
	   *
	   * @param {String} type
	   * @param {RegExp} regexp
	   * @return {Object}
	   * @api private
	   */
	  
	  scan: function(regexp, type){
	    var captures;
	    if (captures = regexp.exec(this.input)) {
	      this.consume(captures[0].length);
	      return this.tok(type, captures[1]);
	    }
	  },
	  
	  /**
	   * Defer the given `tok`.
	   *
	   * @param {Object} tok
	   * @api private
	   */
	  
	  defer: function(tok){
	    this.deferredTokens.push(tok);
	  },
	  
	  /**
	   * Lookahead `n` tokens.
	   *
	   * @param {Number} n
	   * @return {Object}
	   * @api private
	   */
	  
	  lookahead: function(n){
	    var fetch = n - this.stash.length;
	    while (fetch-- > 0) this.stash.push(this.next());
	    return this.stash[--n];
	  },
	  
	  /**
	   * Return the indexOf `start` / `end` delimiters.
	   *
	   * @param {String} start
	   * @param {String} end
	   * @return {Number}
	   * @api private
	   */
	  
	  indexOfDelimiters: function(start, end){
	    var str = this.input
	      , nstart = 0
	      , nend = 0
	      , pos = 0;
	    for (var i = 0, len = str.length; i < len; ++i) {
	      if (start == str.charAt(i)) {
	        ++nstart;
	      } else if (end == str.charAt(i)) {
	        if (++nend == nstart) {
	          pos = i;
	          break;
	        }
	      }
	    }
	    return pos;
	  },
	  
	  /**
	   * Stashed token.
	   */
	  
	  stashed: function() {
	    return this.stash.length
	      && this.stash.shift();
	  },
	  
	  /**
	   * Deferred token.
	   */
	  
	  deferred: function() {
	    return this.deferredTokens.length 
	      && this.deferredTokens.shift();
	  },
	  
	  /**
	   * end-of-source.
	   */
	  
	  eos: function() {
	    if (this.input.length) return;
	    if (this.indentStack.length) {
	      this.indentStack.shift();
	      return this.tok('outdent');
	    } else {
	      return this.tok('eos');
	    }
	  },

	  /**
	   * Blank line.
	   */
	  
	  blank: function() {
	    var captures;
	    if (captures = /^\n *\n/.exec(this.input)) {
	      this.consume(captures[0].length - 1);
	      if (this.pipeless) return this.tok('text', '');
	      return this.next();
	    }
	  },

	  /**
	   * Comment.
	   */
	  
	  comment: function() {
	    var captures;
	    if (captures = /^ *\/\/(-)?([^\n]*)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var tok = this.tok('comment', captures[2]);
	      tok.buffer = '-' != captures[1];
	      return tok;
	    }
	  },

	  /**
	   * Interpolated tag.
	   */

	  interpolation: function() {
	    var captures;
	    if (captures = /^#\{(.*?)\}/.exec(this.input)) {
	      this.consume(captures[0].length);
	      return this.tok('interpolation', captures[1]);
	    }
	  },

	  /**
	   * Tag.
	   */
	  
	  tag: function() {
	    var captures;
	    if (captures = /^(\w[-:\w]*)(\/?)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var tok, name = captures[1];
	      if (':' == name[name.length - 1]) {
	        name = name.slice(0, -1);
	        tok = this.tok('tag', name);
	        this.defer(this.tok(':'));
	        while (' ' == this.input[0]) this.input = this.input.substr(1);
	      } else {
	        tok = this.tok('tag', name);
	      }
	      tok.selfClosing = !! captures[2];
	      return tok;
	    }
	  },
	  
	  /**
	   * Filter.
	   */
	  
	  filter: function() {
	    return this.scan(/^:(\w+)/, 'filter');
	  },
	  
	  /**
	   * Doctype.
	   */
	  
	  doctype: function() {
	    return this.scan(/^(?:!!!|doctype) *([^\n]+)?/, 'doctype');
	  },

	  /**
	   * Id.
	   */
	  
	  id: function() {
	    return this.scan(/^#([\w-]+)/, 'id');
	  },
	  
	  /**
	   * Class.
	   */
	  
	  className: function() {
	    return this.scan(/^\.([\w-]+)/, 'class');
	  },
	  
	  /**
	   * Text.
	   */
	  
	  text: function() {
	    return this.scan(/^(?:\| ?| ?)?([^\n]+)/, 'text');
	  },

	  /**
	   * Extends.
	   */
	  
	  "extends": function() {
	    return this.scan(/^extends? +([^\n]+)/, 'extends');
	  },

	  /**
	   * Block prepend.
	   */
	  
	  prepend: function() {
	    var captures;
	    if (captures = /^prepend +([^\n]+)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var mode = 'prepend'
	        , name = captures[1]
	        , tok = this.tok('block', name);
	      tok.mode = mode;
	      return tok;
	    }
	  },
	  
	  /**
	   * Block append.
	   */
	  
	  append: function() {
	    var captures;
	    if (captures = /^append +([^\n]+)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var mode = 'append'
	        , name = captures[1]
	        , tok = this.tok('block', name);
	      tok.mode = mode;
	      return tok;
	    }
	  },

	  /**
	   * Block.
	   */
	  
	  block: function() {
	    var captures;
	    if (captures = /^block\b *(?:(prepend|append) +)?([^\n]*)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var mode = captures[1] || 'replace'
	        , name = captures[2]
	        , tok = this.tok('block', name);

	      tok.mode = mode;
	      return tok;
	    }
	  },

	  /**
	   * Yield.
	   */
	  
	  yield: function() {
	    return this.scan(/^yield */, 'yield');
	  },

	  /**
	   * Include.
	   */
	  
	  include: function() {
	    return this.scan(/^include +([^\n]+)/, 'include');
	  },

	  /**
	   * Case.
	   */
	  
	  "case": function() {
	    return this.scan(/^case +([^\n]+)/, 'case');
	  },

	  /**
	   * When.
	   */
	  
	  when: function() {
	    return this.scan(/^when +([^:\n]+)/, 'when');
	  },

	  /**
	   * Default.
	   */
	  
	  "default": function() {
	    return this.scan(/^default */, 'default');
	  },

	  /**
	   * Assignment.
	   */
	  
	  assignment: function() {
	    var captures;
	    if (captures = /^(\w+) += *([^;\n]+)( *;? *)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var name = captures[1]
	        , val = captures[2];
	      return this.tok('code', 'var ' + name + ' = (' + val + ');');
	    }
	  },

	  /**
	   * Call mixin.
	   */
	  
	  call: function(){
	    var captures;
	    if (captures = /^\+([-\w]+)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var tok = this.tok('call', captures[1]);
	      
	      // Check for args (not attributes)
	      if (captures = /^ *\((.*?)\)/.exec(this.input)) {
	        if (!/^ *[-\w]+ *=/.test(captures[1])) {
	          this.consume(captures[0].length);
	          tok.args = captures[1];
	        }
	      }
	      
	      return tok;
	    }
	  },

	  /**
	   * Mixin.
	   */

	  mixin: function(){
	    var captures;
	    if (captures = /^mixin +([-\w]+)(?: *\((.*)\))?/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var tok = this.tok('mixin', captures[1]);
	      tok.args = captures[2];
	      return tok;
	    }
	  },

	  /**
	   * Conditional.
	   */
	  
	  conditional: function() {
	    var captures;
	    if (captures = /^(if|unless|else if|else)\b([^\n]*)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var type = captures[1]
	        , js = captures[2];

	      switch (type) {
	        case 'if': js = 'if (' + js + ')'; break;
	        case 'unless': js = 'if (!(' + js + '))'; break;
	        case 'else if': js = 'else if (' + js + ')'; break;
	        case 'else': js = 'else'; break;
	      }

	      return this.tok('code', js);
	    }
	  },

	  /**
	   * While.
	   */
	  
	  "while": function() {
	    var captures;
	    if (captures = /^while +([^\n]+)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      return this.tok('code', 'while (' + captures[1] + ')');
	    }
	  },

	  /**
	   * Each.
	   */
	  
	  each: function() {
	    var captures;
	    if (captures = /^(?:- *)?(?:each|for) +(\w+)(?: *, *(\w+))? * in *([^\n]+)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var tok = this.tok('each', captures[1]);
	      tok.key = captures[2] || '$index';
	      tok.code = captures[3];
	      return tok;
	    }
	  },
	  
	  /**
	   * Code.
	   */
	  
	  code: function() {
	    var captures;
	    if (captures = /^(!?=|-)([^\n]+)/.exec(this.input)) {
	      this.consume(captures[0].length);
	      var flags = captures[1];
	      captures[1] = captures[2];
	      var tok = this.tok('code', captures[1]);
	      tok.escape = flags[0] === '=';
	      tok.buffer = flags[0] === '=' || flags[1] === '=';
	      return tok;
	    }
	  },
	  
	  /**
	   * Attributes.
	   */
	  
	  attrs: function() {
	    if ('(' == this.input.charAt(0)) {
	      var index = this.indexOfDelimiters('(', ')')
	        , str = this.input.substr(1, index-1)
	        , tok = this.tok('attrs')
	        , len = str.length
	        , colons = this.colons
	        , states = ['key']
	        , escapedAttr
	        , key = ''
	        , val = ''
	        , quote
	        , c
	        , p;

	      function state(){
	        return states[states.length - 1];
	      }

	      function interpolate(attr) {
	        return attr.replace(/#\{([^}]+)\}/g, function(_, expr){
	          return quote + " + (" + expr + ") + " + quote;
	        });
	      }

	      this.consume(index + 1);
	      tok.attrs = {};
	      tok.escaped = {};

	      function parse(c) {
	        var real = c;
	        // TODO: remove when people fix ":"
	        if (colons && ':' == c) c = '=';
	        switch (c) {
	          case ',':
	          case '\n':
	            switch (state()) {
	              case 'expr':
	              case 'array':
	              case 'string':
	              case 'object':
	                val += c;
	                break;
	              default:
	                states.push('key');
	                val = val.trim();
	                key = key.trim();
	                if ('' == key) return;
	                key = key.replace(/^['"]|['"]$/g, '').replace('!', '');
	                tok.escaped[key] = escapedAttr;
	                tok.attrs[key] = '' == val
	                  ? true
	                  : interpolate(val);
	                key = val = '';
	            }
	            break;
	          case '=':
	            switch (state()) {
	              case 'key char':
	                key += real;
	                break;
	              case 'val':
	              case 'expr':
	              case 'array':
	              case 'string':
	              case 'object':
	                val += real;
	                break;
	              default:
	                escapedAttr = '!' != p;
	                states.push('val');
	            }
	            break;
	          case '(':
	            if ('val' == state()
	              || 'expr' == state()) states.push('expr');
	            val += c;
	            break;
	          case ')':
	            if ('expr' == state()
	              || 'val' == state()) states.pop();
	            val += c;
	            break;
	          case '{':
	            if ('val' == state()) states.push('object');
	            val += c;
	            break;
	          case '}':
	            if ('object' == state()) states.pop();
	            val += c;
	            break;
	          case '[':
	            if ('val' == state()) states.push('array');
	            val += c;
	            break;
	          case ']':
	            if ('array' == state()) states.pop();
	            val += c;
	            break;
	          case '"':
	          case "'":
	            switch (state()) {
	              case 'key':
	                states.push('key char');
	                break;
	              case 'key char':
	                states.pop();
	                break;
	              case 'string':
	                if (c == quote) states.pop();
	                val += c;
	                break;
	              default:
	                states.push('string');
	                val += c;
	                quote = c;
	            }
	            break;
	          case '':
	            break;
	          default:
	            switch (state()) {
	              case 'key':
	              case 'key char':
	                key += c;
	                break;
	              default:
	                val += c;
	            }
	        }
	        p = c;
	      }

	      for (var i = 0; i < len; ++i) {
	        parse(str.charAt(i));
	      }

	      parse(',');

	      if ('/' == this.input.charAt(0)) {
	        this.consume(1);
	        tok.selfClosing = true;
	      }

	      return tok;
	    }
	  },
	  
	  /**
	   * Indent | Outdent | Newline.
	   */
	  
	  indent: function() {
	    var captures, re;

	    // established regexp
	    if (this.indentRe) {
	      captures = this.indentRe.exec(this.input);
	    // determine regexp
	    } else {
	      // tabs
	      re = /^\n(\t*) */;
	      captures = re.exec(this.input);

	      // spaces
	      if (captures && !captures[1].length) {
	        re = /^\n( *)/;
	        captures = re.exec(this.input);
	      }

	      // established
	      if (captures && captures[1].length) this.indentRe = re;
	    }

	    if (captures) {
	      var tok
	        , indents = captures[1].length;

	      ++this.lineno;
	      this.consume(indents + 1);

	      if (' ' == this.input[0] || '\t' == this.input[0]) {
	        throw new Error('Invalid indentation, you can use tabs or spaces but not both');
	      }

	      // blank line
	      if ('\n' == this.input[0]) return this.tok('newline');

	      // outdent
	      if (this.indentStack.length && indents < this.indentStack[0]) {
	        while (this.indentStack.length && this.indentStack[0] > indents) {
	          this.stash.push(this.tok('outdent'));
	          this.indentStack.shift();
	        }
	        tok = this.stash.pop();
	      // indent
	      } else if (indents && indents != this.indentStack[0]) {
	        this.indentStack.unshift(indents);
	        tok = this.tok('indent', indents);
	      // newline
	      } else {
	        tok = this.tok('newline');
	      }

	      return tok;
	    }
	  },

	  /**
	   * Pipe-less text consumed only when 
	   * pipeless is true;
	   */

	  pipelessText: function() {
	    if (this.pipeless) {
	      if ('\n' == this.input[0]) return;
	      var i = this.input.indexOf('\n');
	      if (-1 == i) i = this.input.length;
	      var str = this.input.substr(0, i);
	      this.consume(str.length);
	      return this.tok('text', str);
	    }
	  },

	  /**
	   * ':'
	   */

	  colon: function() {
	    return this.scan(/^: */, ':');
	  },

	  /**
	   * Return the next token object, or those
	   * previously stashed by lookahead.
	   *
	   * @return {Object}
	   * @api private
	   */
	  
	  advance: function(){
	    return this.stashed()
	      || this.next();
	  },
	  
	  /**
	   * Return the next token object.
	   *
	   * @return {Object}
	   * @api private
	   */
	  
	  next: function() {
	    return this.deferred()
	      || this.blank()
	      || this.eos()
	      || this.pipelessText()
	      || this.yield()
	      || this.doctype()
	      || this.interpolation()
	      || this["case"]()
	      || this.when()
	      || this["default"]()
	      || this["extends"]()
	      || this.append()
	      || this.prepend()
	      || this.block()
	      || this.include()
	      || this.mixin()
	      || this.call()
	      || this.conditional()
	      || this.each()
	      || this["while"]()
	      || this.assignment()
	      || this.tag()
	      || this.filter()
	      || this.code()
	      || this.id()
	      || this.className()
	      || this.attrs()
	      || this.indent()
	      || this.comment()
	      || this.colon()
	      || this.text();
	  }
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	exports.Node = __webpack_require__(60);
	exports.Tag = __webpack_require__(61);
	exports.Code = __webpack_require__(65);
	exports.Each = __webpack_require__(66);
	exports.Case = __webpack_require__(67);
	exports.Text = __webpack_require__(68);
	exports.Block = __webpack_require__(63);
	exports.Mixin = __webpack_require__(69);
	exports.Filter = __webpack_require__(70);
	exports.Comment = __webpack_require__(71);
	exports.Literal = __webpack_require__(72);
	exports.BlockComment = __webpack_require__(73);
	exports.Doctype = __webpack_require__(74);


/***/ },
/* 60 */
/***/ function(module, exports) {

	
	/*!
	 * Jade - nodes - Node
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Initialize a `Node`.
	 *
	 * @api public
	 */

	var Node = module.exports = function Node(){};

	/**
	 * Clone this node (return itself)
	 *
	 * @return {Node}
	 * @api private
	 */

	Node.prototype.clone = function(){
	  return this;
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Tag
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Attrs = __webpack_require__(62),
	    Block = __webpack_require__(63),
	    inlineTags = __webpack_require__(64);

	/**
	 * Initialize a `Tag` node with the given tag `name` and optional `block`.
	 *
	 * @param {String} name
	 * @param {Block} block
	 * @api public
	 */

	var Tag = module.exports = function Tag(name, block) {
	  this.name = name;
	  this.attrs = [];
	  this.block = block || new Block;
	};

	/**
	 * Inherit from `Attrs`.
	 */

	Tag.prototype.__proto__ = Attrs.prototype;

	/**
	 * Clone this tag.
	 *
	 * @return {Tag}
	 * @api private
	 */

	Tag.prototype.clone = function(){
	  var clone = new Tag(this.name, this.block.clone());
	  clone.line = this.line;
	  clone.attrs = this.attrs;
	  clone.textOnly = this.textOnly;
	  return clone;
	};

	/**
	 * Check if this tag is an inline tag.
	 *
	 * @return {Boolean}
	 * @api private
	 */

	Tag.prototype.isInline = function(){
	  return ~inlineTags.indexOf(this.name);
	};

	/**
	 * Check if this tag's contents can be inlined.  Used for pretty printing.
	 *
	 * @return {Boolean}
	 * @api private
	 */

	Tag.prototype.canInline = function(){
	  var nodes = this.block.nodes;

	  function isInline(node){
	    // Recurse if the node is a block
	    if (node.isBlock) return node.nodes.every(isInline);
	    return node.isText || (node.isInline && node.isInline());
	  }
	  
	  // Empty tag
	  if (!nodes.length) return true;
	  
	  // Text-only or inline-only tag
	  if (1 == nodes.length) return isInline(nodes[0]);
	  
	  // Multi-line inline-only tag
	  if (this.block.nodes.every(isInline)) {
	    for (var i = 1, len = nodes.length; i < len; ++i) {
	      if (nodes[i-1].isText && nodes[i].isText)
	        return false;
	    }
	    return true;
	  }
	  
	  // Mixed tag
	  return false;
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Attrs
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60),
	    Block = __webpack_require__(63);

	/**
	 * Initialize a `Attrs` node.
	 *
	 * @api public
	 */

	var Attrs = module.exports = function Attrs() {
	  this.attrs = [];
	};

	/**
	 * Inherit from `Node`.
	 */

	Attrs.prototype.__proto__ = Node.prototype;

	/**
	 * Set attribute `name` to `val`, keep in mind these become
	 * part of a raw js object literal, so to quote a value you must
	 * '"quote me"', otherwise or example 'user.name' is literal JavaScript.
	 *
	 * @param {String} name
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @return {Tag} for chaining
	 * @api public
	 */

	Attrs.prototype.setAttribute = function(name, val, escaped){
	  this.attrs.push({ name: name, val: val, escaped: escaped });
	  return this;
	};

	/**
	 * Remove attribute `name` when present.
	 *
	 * @param {String} name
	 * @api public
	 */

	Attrs.prototype.removeAttribute = function(name){
	  for (var i = 0, len = this.attrs.length; i < len; ++i) {
	    if (this.attrs[i] && this.attrs[i].name == name) {
	      delete this.attrs[i];
	    }
	  }
	};

	/**
	 * Get attribute value by `name`.
	 *
	 * @param {String} name
	 * @return {String}
	 * @api public
	 */

	Attrs.prototype.getAttribute = function(name){
	  for (var i = 0, len = this.attrs.length; i < len; ++i) {
	    if (this.attrs[i] && this.attrs[i].name == name) {
	      return this.attrs[i].val;
	    }
	  }
	};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Block
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize a new `Block` with an optional `node`.
	 *
	 * @param {Node} node
	 * @api public
	 */

	var Block = module.exports = function Block(node){
	  this.nodes = [];
	  if (node) this.push(node);
	};

	/**
	 * Inherit from `Node`.
	 */

	Block.prototype.__proto__ = Node.prototype;

	/**
	 * Block flag.
	 */

	Block.prototype.isBlock = true;

	/**
	 * Replace the nodes in `other` with the nodes
	 * in `this` block.
	 *
	 * @param {Block} other
	 * @api private
	 */

	Block.prototype.replace = function(other){
	  other.nodes = this.nodes;
	};

	/**
	 * Pust the given `node`.
	 *
	 * @param {Node} node
	 * @return {Number}
	 * @api public
	 */

	Block.prototype.push = function(node){
	  return this.nodes.push(node);
	};

	/**
	 * Check if this block is empty.
	 *
	 * @return {Boolean}
	 * @api public
	 */

	Block.prototype.isEmpty = function(){
	  return 0 == this.nodes.length;
	};

	/**
	 * Unshift the given `node`.
	 *
	 * @param {Node} node
	 * @return {Number}
	 * @api public
	 */

	Block.prototype.unshift = function(node){
	  return this.nodes.unshift(node);
	};

	/**
	 * Return the "last" block, or the first `yield` node.
	 *
	 * @return {Block}
	 * @api private
	 */

	Block.prototype.includeBlock = function(){
	  var ret = this
	    , node;

	  for (var i = 0, len = this.nodes.length; i < len; ++i) {
	    node = this.nodes[i];
	    if (node.yield) return node;
	    else if (node.textOnly) continue;
	    else if (node.includeBlock) ret = node.includeBlock();
	    else if (node.block && !node.block.isEmpty()) ret = node.block.includeBlock();
	  }

	  return ret;
	};

	/**
	 * Return a clone of this block.
	 *
	 * @return {Block}
	 * @api private
	 */

	Block.prototype.clone = function(){
	  var clone = new Block;
	  for (var i = 0, len = this.nodes.length; i < len; ++i) {
	    clone.push(this.nodes[i].clone());
	  }
	  return clone;
	};



/***/ },
/* 64 */
/***/ function(module, exports) {

	
	/*!
	 * Jade - inline tags
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	module.exports = [
	    'a'
	  , 'abbr'
	  , 'acronym'
	  , 'b'
	  , 'br'
	  , 'code'
	  , 'em'
	  , 'font'
	  , 'i'
	  , 'img'
	  , 'ins'
	  , 'kbd'
	  , 'map'
	  , 'samp'
	  , 'small'
	  , 'span'
	  , 'strong'
	  , 'sub'
	  , 'sup'
	];

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Code
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize a `Code` node with the given code `val`.
	 * Code may also be optionally buffered and escaped.
	 *
	 * @param {String} val
	 * @param {Boolean} buffer
	 * @param {Boolean} escape
	 * @api public
	 */

	var Code = module.exports = function Code(val, buffer, escape) {
	  this.val = val;
	  this.buffer = buffer;
	  this.escape = escape;
	  if (val.match(/^ *else/)) this.debug = false;
	};

	/**
	 * Inherit from `Node`.
	 */

	Code.prototype.__proto__ = Node.prototype;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Each
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize an `Each` node, representing iteration
	 *
	 * @param {String} obj
	 * @param {String} val
	 * @param {String} key
	 * @param {Block} block
	 * @api public
	 */

	var Each = module.exports = function Each(obj, val, key, block) {
	  this.obj = obj;
	  this.val = val;
	  this.key = key;
	  this.block = block;
	};

	/**
	 * Inherit from `Node`.
	 */

	Each.prototype.__proto__ = Node.prototype;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Case
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize a new `Case` with `expr`.
	 *
	 * @param {String} expr
	 * @api public
	 */

	var Case = exports = module.exports = function Case(expr, block){
	  this.expr = expr;
	  this.block = block;
	};

	/**
	 * Inherit from `Node`.
	 */

	Case.prototype.__proto__ = Node.prototype;

	var When = exports.When = function When(expr, block){
	  this.expr = expr;
	  this.block = block;
	  this.debug = false;
	};

	/**
	 * Inherit from `Node`.
	 */

	When.prototype.__proto__ = Node.prototype;



/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Text
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize a `Text` node with optional `line`.
	 *
	 * @param {String} line
	 * @api public
	 */

	var Text = module.exports = function Text(line) {
	  this.val = '';
	  if ('string' == typeof line) this.val = line;
	};

	/**
	 * Inherit from `Node`.
	 */

	Text.prototype.__proto__ = Node.prototype;

	/**
	 * Flag as text.
	 */

	Text.prototype.isText = true;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Mixin
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Attrs = __webpack_require__(62);

	/**
	 * Initialize a new `Mixin` with `name` and `block`.
	 *
	 * @param {String} name
	 * @param {String} args
	 * @param {Block} block
	 * @api public
	 */

	var Mixin = module.exports = function Mixin(name, args, block, call){
	  this.name = name;
	  this.args = args;
	  this.block = block;
	  this.attrs = [];
	  this.call = call;
	};

	/**
	 * Inherit from `Attrs`.
	 */

	Mixin.prototype.__proto__ = Attrs.prototype;



/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Filter
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60)
	  , Block = __webpack_require__(63);

	/**
	 * Initialize a `Filter` node with the given 
	 * filter `name` and `block`.
	 *
	 * @param {String} name
	 * @param {Block|Node} block
	 * @api public
	 */

	var Filter = module.exports = function Filter(name, block, attrs) {
	  this.name = name;
	  this.block = block;
	  this.attrs = attrs;
	  this.isASTFilter = !block.nodes.every(function(node){ return node.isText });
	};

	/**
	 * Inherit from `Node`.
	 */

	Filter.prototype.__proto__ = Node.prototype;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Comment
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize a `Comment` with the given `val`, optionally `buffer`,
	 * otherwise the comment may render in the output.
	 *
	 * @param {String} val
	 * @param {Boolean} buffer
	 * @api public
	 */

	var Comment = module.exports = function Comment(val, buffer) {
	  this.val = val;
	  this.buffer = buffer;
	};

	/**
	 * Inherit from `Node`.
	 */

	Comment.prototype.__proto__ = Node.prototype;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Literal
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize a `Literal` node with the given `str.
	 *
	 * @param {String} str
	 * @api public
	 */

	var Literal = module.exports = function Literal(str) {
	  this.str = str
	    .replace(/\\/g, "\\\\")
	    .replace(/\n|\r\n/g, "\\n")
	    .replace(/'/g, "\\'");
	};

	/**
	 * Inherit from `Node`.
	 */

	Literal.prototype.__proto__ = Node.prototype;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - BlockComment
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize a `BlockComment` with the given `block`.
	 *
	 * @param {String} val
	 * @param {Block} block
	 * @param {Boolean} buffer
	 * @api public
	 */

	var BlockComment = module.exports = function BlockComment(val, block, buffer) {
	  this.block = block;
	  this.val = val;
	  this.buffer = buffer;
	};

	/**
	 * Inherit from `Node`.
	 */

	BlockComment.prototype.__proto__ = Node.prototype;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - nodes - Doctype
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var Node = __webpack_require__(60);

	/**
	 * Initialize a `Doctype` with the given `val`. 
	 *
	 * @param {String} val
	 * @api public
	 */

	var Doctype = module.exports = function Doctype(val) {
	  this.val = val;
	};

	/**
	 * Inherit from `Node`.
	 */

	Doctype.prototype.__proto__ = Node.prototype;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - Compiler
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var nodes = __webpack_require__(59)
	  , filters = __webpack_require__(76)
	  , doctypes = __webpack_require__(97)
	  , selfClosing = __webpack_require__(98)
	  , runtime = __webpack_require__(99)
	  , utils = __webpack_require__(100);

	// if browser
	//
	// if (!Object.keys) {
	//   Object.keys = function(obj){
	//     var arr = [];
	//     for (var key in obj) {
	//       if (obj.hasOwnProperty(key)) {
	//         arr.push(key);
	//       }
	//     }
	//     return arr;
	//   }
	// }
	//
	// if (!String.prototype.trimLeft) {
	//   String.prototype.trimLeft = function(){
	//     return this.replace(/^\s+/, '');
	//   }
	// }
	//
	// end


	/**
	 * Initialize `Compiler` with the given `node`.
	 *
	 * @param {Node} node
	 * @param {Object} options
	 * @api public
	 */

	var Compiler = module.exports = function Compiler(node, options) {
	  this.options = options = options || {};
	  this.node = node;
	  this.hasCompiledDoctype = false;
	  this.hasCompiledTag = false;
	  this.pp = options.pretty || false;
	  this.debug = false !== options.compileDebug;
	  this.indents = 0;
	  this.parentIndents = 0;
	  if (options.doctype) this.setDoctype(options.doctype);
	};

	/**
	 * Compiler prototype.
	 */

	Compiler.prototype = {

	  /**
	   * Compile parse tree to JavaScript.
	   *
	   * @api public
	   */

	  compile: function(){
	    this.buf = ['var interp;'];
	    if (this.pp) this.buf.push("var __indent = [];");
	    this.lastBufferedIdx = -1;
	    this.visit(this.node);
	    return this.buf.join('\n');
	  },

	  /**
	   * Sets the default doctype `name`. Sets terse mode to `true` when
	   * html 5 is used, causing self-closing tags to end with ">" vs "/>",
	   * and boolean attributes are not mirrored.
	   *
	   * @param {string} name
	   * @api public
	   */

	  setDoctype: function(name){
	    var doctype = doctypes[(name || 'default').toLowerCase()];
	    doctype = doctype || '<!DOCTYPE ' + name + '>';
	    this.doctype = doctype;
	    this.terse = '5' == name || 'html' == name;
	    this.xml = 0 == this.doctype.indexOf('<?xml');
	  },

	  /**
	   * Buffer the given `str` optionally escaped.
	   *
	   * @param {String} str
	   * @param {Boolean} esc
	   * @api public
	   */

	  buffer: function(str, esc){
	    if (esc) str = utils.escape(str);

	    if (this.lastBufferedIdx == this.buf.length) {
	      this.lastBuffered += str;
	      this.buf[this.lastBufferedIdx - 1] = "buf.push('" + this.lastBuffered + "');"
	    } else {
	      this.buf.push("buf.push('" + str + "');");
	      this.lastBuffered = str;
	      this.lastBufferedIdx = this.buf.length;
	    }
	  },

	  /**
	   * Buffer an indent based on the current `indent`
	   * property and an additional `offset`.
	   *
	   * @param {Number} offset
	   * @param {Boolean} newline
	   * @api public
	   */
	  
	  prettyIndent: function(offset, newline){
	    offset = offset || 0;
	    newline = newline ? '\\n' : '';
	    this.buffer(newline + Array(this.indents + offset).join('  '));
	    if (this.parentIndents)
	      this.buf.push("buf.push.apply(buf, __indent);");
	  },

	  /**
	   * Visit `node`.
	   *
	   * @param {Node} node
	   * @api public
	   */

	  visit: function(node){
	    var debug = this.debug;

	    if (debug) {
	      this.buf.push('__jade.unshift({ lineno: ' + node.line
	        + ', filename: ' + (node.filename
	          ? JSON.stringify(node.filename)
	          : '__jade[0].filename')
	        + ' });');
	    }

	    // Massive hack to fix our context
	    // stack for - else[ if] etc
	    if (false === node.debug && this.debug) {
	      this.buf.pop();
	      this.buf.pop();
	    }

	    this.visitNode(node);

	    if (debug) this.buf.push('__jade.shift();');
	  },

	  /**
	   * Visit `node`.
	   *
	   * @param {Node} node
	   * @api public
	   */

	  visitNode: function(node){
	    var name = node.constructor.name
	      || node.constructor.toString().match(/function ([^(\s]+)()/)[1];
	    return this['visit' + name](node);
	  },

	  /**
	   * Visit case `node`.
	   *
	   * @param {Literal} node
	   * @api public
	   */

	  visitCase: function(node){
	    var _ = this.withinCase;
	    this.withinCase = true;
	    this.buf.push('switch (' + node.expr + '){');
	    this.visit(node.block);
	    this.buf.push('}');
	    this.withinCase = _;
	  },

	  /**
	   * Visit when `node`.
	   *
	   * @param {Literal} node
	   * @api public
	   */

	  visitWhen: function(node){
	    if ('default' == node.expr) {
	      this.buf.push('default:');
	    } else {
	      this.buf.push('case ' + node.expr + ':');
	    }
	    this.visit(node.block);
	    this.buf.push('  break;');
	  },

	  /**
	   * Visit literal `node`.
	   *
	   * @param {Literal} node
	   * @api public
	   */

	  visitLiteral: function(node){
	    var str = node.str.replace(/\n/g, '\\\\n');
	    this.buffer(str);
	  },

	  /**
	   * Visit all nodes in `block`.
	   *
	   * @param {Block} block
	   * @api public
	   */

	  visitBlock: function(block){
	    var len = block.nodes.length
	      , escape = this.escape
	      , pp = this.pp
	    
	    // Block keyword has a special meaning in mixins
	    if (this.parentIndents && block.mode) {
	      if (pp) this.buf.push("__indent.push('" + Array(this.indents + 1).join('  ') + "');")
	      this.buf.push('block && block();');
	      if (pp) this.buf.push("__indent.pop();")
	      return;
	    }
	    
	    // Pretty print multi-line text
	    if (pp && len > 1 && !escape && block.nodes[0].isText && block.nodes[1].isText)
	      this.prettyIndent(1, true);
	    
	    for (var i = 0; i < len; ++i) {
	      // Pretty print text
	      if (pp && i > 0 && !escape && block.nodes[i].isText && block.nodes[i-1].isText)
	        this.prettyIndent(1, false);
	      
	      this.visit(block.nodes[i]);
	      // Multiple text nodes are separated by newlines
	      if (block.nodes[i+1] && block.nodes[i].isText && block.nodes[i+1].isText)
	        this.buffer('\\n');
	    }
	  },

	  /**
	   * Visit `doctype`. Sets terse mode to `true` when html 5
	   * is used, causing self-closing tags to end with ">" vs "/>",
	   * and boolean attributes are not mirrored.
	   *
	   * @param {Doctype} doctype
	   * @api public
	   */

	  visitDoctype: function(doctype){
	    if (doctype && (doctype.val || !this.doctype)) {
	      this.setDoctype(doctype.val || 'default');
	    }

	    if (this.doctype) this.buffer(this.doctype);
	    this.hasCompiledDoctype = true;
	  },

	  /**
	   * Visit `mixin`, generating a function that
	   * may be called within the template.
	   *
	   * @param {Mixin} mixin
	   * @api public
	   */

	  visitMixin: function(mixin){
	    var name = mixin.name.replace(/-/g, '_') + '_mixin'
	      , args = mixin.args || ''
	      , block = mixin.block
	      , attrs = mixin.attrs
	      , pp = this.pp;

	    if (mixin.call) {
	      if (pp) this.buf.push("__indent.push('" + Array(this.indents + 1).join('  ') + "');")
	      if (block || attrs.length) {
	        
	        this.buf.push(name + '.call({');
	        
	        if (block) {
	          this.buf.push('block: function(){');
	          
	          // Render block with no indents, dynamically added when rendered
	          this.parentIndents++;
	          var _indents = this.indents;
	          this.indents = 0;
	          this.visit(mixin.block);
	          this.indents = _indents;
	          this.parentIndents--;
	          
	          if (attrs.length) {
	            this.buf.push('},');
	          } else {
	            this.buf.push('}');
	          }
	        }
	        
	        if (attrs.length) {
	          var val = this.attrs(attrs);
	          if (val.inherits) {
	            this.buf.push('attributes: merge({' + val.buf
	                + '}, attributes), escaped: merge(' + val.escaped + ', escaped, true)');
	          } else {
	            this.buf.push('attributes: {' + val.buf + '}, escaped: ' + val.escaped);
	          }
	        }
	        
	        if (args) {
	          this.buf.push('}, ' + args + ');');
	        } else {
	          this.buf.push('});');
	        }
	        
	      } else {
	        this.buf.push(name + '(' + args + ');');
	      }
	      if (pp) this.buf.push("__indent.pop();")
	    } else {
	      this.buf.push('var ' + name + ' = function(' + args + '){');
	      this.buf.push('var block = this.block, attributes = this.attributes || {}, escaped = this.escaped || {};');
	      this.parentIndents++;
	      this.visit(block);
	      this.parentIndents--;
	      this.buf.push('};');
	    }
	  },

	  /**
	   * Visit `tag` buffering tag markup, generating
	   * attributes, visiting the `tag`'s code and block.
	   *
	   * @param {Tag} tag
	   * @api public
	   */

	  visitTag: function(tag){
	    this.indents++;
	    var name = tag.name
	      , pp = this.pp;

	    if (tag.buffer) name = "' + (" + name + ") + '";

	    if (!this.hasCompiledTag) {
	      if (!this.hasCompiledDoctype && 'html' == name) {
	        this.visitDoctype();
	      }
	      this.hasCompiledTag = true;
	    }

	    // pretty print
	    if (pp && !tag.isInline())
	      this.prettyIndent(0, true);

	    if ((~selfClosing.indexOf(name) || tag.selfClosing) && !this.xml) {
	      this.buffer('<' + name);
	      this.visitAttributes(tag.attrs);
	      this.terse
	        ? this.buffer('>')
	        : this.buffer('/>');
	    } else {
	      // Optimize attributes buffering
	      if (tag.attrs.length) {
	        this.buffer('<' + name);
	        if (tag.attrs.length) this.visitAttributes(tag.attrs);
	        this.buffer('>');
	      } else {
	        this.buffer('<' + name + '>');
	      }
	      if (tag.code) this.visitCode(tag.code);
	      this.escape = 'pre' == tag.name;
	      this.visit(tag.block);

	      // pretty print
	      if (pp && !tag.isInline() && 'pre' != tag.name && !tag.canInline())
	        this.prettyIndent(0, true);

	      this.buffer('</' + name + '>');
	    }
	    this.indents--;
	  },

	  /**
	   * Visit `filter`, throwing when the filter does not exist.
	   *
	   * @param {Filter} filter
	   * @api public
	   */

	  visitFilter: function(filter){
	    var fn = filters[filter.name];

	    // unknown filter
	    if (!fn) {
	      if (filter.isASTFilter) {
	        throw new Error('unknown ast filter "' + filter.name + ':"');
	      } else {
	        throw new Error('unknown filter ":' + filter.name + '"');
	      }
	    }

	    if (filter.isASTFilter) {
	      this.buf.push(fn(filter.block, this, filter.attrs));
	    } else {
	      var text = filter.block.nodes.map(function(node){ return node.val }).join('\n');
	      filter.attrs = filter.attrs || {};
	      filter.attrs.filename = this.options.filename;
	      this.buffer(utils.text(fn(text, filter.attrs)));
	    }
	  },

	  /**
	   * Visit `text` node.
	   *
	   * @param {Text} text
	   * @api public
	   */

	  visitText: function(text){
	    text = utils.text(text.val.replace(/\\/g, '\\\\'));
	    if (this.escape) text = escape(text);
	    this.buffer(text);
	  },

	  /**
	   * Visit a `comment`, only buffering when the buffer flag is set.
	   *
	   * @param {Comment} comment
	   * @api public
	   */

	  visitComment: function(comment){
	    if (!comment.buffer) return;
	    if (this.pp) this.prettyIndent(1, true);
	    this.buffer('<!--' + utils.escape(comment.val) + '-->');
	  },

	  /**
	   * Visit a `BlockComment`.
	   *
	   * @param {Comment} comment
	   * @api public
	   */

	  visitBlockComment: function(comment){
	    if (!comment.buffer) return;
	    if (0 == comment.val.trim().indexOf('if')) {
	      this.buffer('<!--[' + comment.val.trim() + ']>');
	      this.visit(comment.block);
	      this.buffer('<![endif]-->');
	    } else {
	      this.buffer('<!--' + comment.val);
	      this.visit(comment.block);
	      this.buffer('-->');
	    }
	  },

	  /**
	   * Visit `code`, respecting buffer / escape flags.
	   * If the code is followed by a block, wrap it in
	   * a self-calling function.
	   *
	   * @param {Code} code
	   * @api public
	   */

	  visitCode: function(code){
	    // Wrap code blocks with {}.
	    // we only wrap unbuffered code blocks ATM
	    // since they are usually flow control

	    // Buffer code
	    if (code.buffer) {
	      var val = code.val.trimLeft();
	      this.buf.push('var __val__ = ' + val);
	      val = 'null == __val__ ? "" : __val__';
	      if (code.escape) val = 'escape(' + val + ')';
	      this.buf.push("buf.push(" + val + ");");
	    } else {
	      this.buf.push(code.val);
	    }

	    // Block support
	    if (code.block) {
	      if (!code.buffer) this.buf.push('{');
	      this.visit(code.block);
	      if (!code.buffer) this.buf.push('}');
	    }
	  },

	  /**
	   * Visit `each` block.
	   *
	   * @param {Each} each
	   * @api public
	   */

	  visitEach: function(each){
	    this.buf.push(''
	      + '// iterate ' + each.obj + '\n'
	      + ';(function(){\n'
	      + '  if (\'number\' == typeof ' + each.obj + '.length) {\n'
	      + '    for (var ' + each.key + ' = 0, $$l = ' + each.obj + '.length; ' + each.key + ' < $$l; ' + each.key + '++) {\n'
	      + '      var ' + each.val + ' = ' + each.obj + '[' + each.key + '];\n');

	    this.visit(each.block);

	    this.buf.push(''
	      + '    }\n'
	      + '  } else {\n'
	      + '    for (var ' + each.key + ' in ' + each.obj + ') {\n'
	      // if browser
	      // + '      if (' + each.obj + '.hasOwnProperty(' + each.key + ')){'
	      // end
	      + '      var ' + each.val + ' = ' + each.obj + '[' + each.key + '];\n');

	    this.visit(each.block);

	    // if browser
	    // this.buf.push('      }\n');
	    // end

	    this.buf.push('   }\n  }\n}).call(this);\n');
	  },

	  /**
	   * Visit `attrs`.
	   *
	   * @param {Array} attrs
	   * @api public
	   */

	  visitAttributes: function(attrs){
	    var val = this.attrs(attrs);
	    if (val.inherits) {
	      this.buf.push("buf.push(attrs(merge({ " + val.buf +
	          " }, attributes), merge(" + val.escaped + ", escaped, true)));");
	    } else if (val.constant) {
	      eval('var buf={' + val.buf + '};');
	      this.buffer(runtime.attrs(buf, JSON.parse(val.escaped)), true);
	    } else {
	      this.buf.push("buf.push(attrs({ " + val.buf + " }, " + val.escaped + "));");
	    }
	  },

	  /**
	   * Compile attributes.
	   */

	  attrs: function(attrs){
	    var buf = []
	      , classes = []
	      , escaped = {}
	      , constant = attrs.every(function(attr){ return isConstant(attr.val) })
	      , inherits = false;

	    if (this.terse) buf.push('terse: true');

	    attrs.forEach(function(attr){
	      if (attr.name == 'attributes') return inherits = true;
	      escaped[attr.name] = attr.escaped;
	      if (attr.name == 'class') {
	        classes.push('(' + attr.val + ')');
	      } else {
	        var pair = "'" + attr.name + "':(" + attr.val + ')';
	        buf.push(pair);
	      }
	    });

	    if (classes.length) {
	      classes = classes.join(" + ' ' + ");
	      buf.push("class: " + classes);
	    }

	    return {
	      buf: buf.join(', ').replace('class:', '"class":'),
	      escaped: JSON.stringify(escaped),
	      inherits: inherits,
	      constant: constant
	    };
	  }
	};

	/**
	 * Check if expression can be evaluated to a constant
	 *
	 * @param {String} expression
	 * @return {Boolean}
	 * @api private
	 */

	function isConstant(val){
	  // Check strings/literals
	  if (/^ *("([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'|true|false|null|undefined) *$/i.test(val))
	    return true;
	  
	  // Check numbers
	  if (!isNaN(Number(val)))
	    return true;
	  
	  // Check arrays
	  var matches;
	  if (matches = /^ *\[(.*)\] *$/.exec(val))
	    return matches[1].split(',').every(isConstant);
	  
	  return false;
	}

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	function escape(html){
	  return String(html)
	    .replace(/&(?!\w+;)/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;');
	}

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - filters
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	module.exports = {
	  
	  /**
	   * Wrap text with CDATA block.
	   */
	  
	  cdata: function(str){
	    return '<![CDATA[\\n' + str + '\\n]]>';
	  },
	  
	  /**
	   * Transform sass to css, wrapped in style tags.
	   */
	  
	  sass: function(str){
	    str = str.replace(/\\n/g, '\n');
	    var sass = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"sass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).render(str).replace(/\n/g, '\\n');
	    return '<style type="text/css">' + sass + '</style>'; 
	  },
	  
	  /**
	   * Transform stylus to css, wrapped in style tags.
	   */
	  
	  stylus: function(str, options){
	    var ret;
	    str = str.replace(/\\n/g, '\n');
	    var stylus = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"stylus\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    stylus(str, options).render(function(err, css){
	      if (err) throw err;
	      ret = css.replace(/\n/g, '\\n');
	    });
	    return '<style type="text/css">' + ret + '</style>'; 
	  },
	  
	  /**
	   * Transform less to css, wrapped in style tags.
	   */
	  
	  less: function(str){
	    var ret;
	    str = str.replace(/\\n/g, '\n');
	    __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"less\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).render(str, function(err, css){
	      if (err) throw err;
	      ret = '<style type="text/css">' + css.replace(/\n/g, '\\n') + '</style>';  
	    });
	    return ret;
	  },
	  
	  /**
	   * Transform markdown to html.
	   */
	  
	  markdown: function(str){
	    var md;

	    // support markdown / discount
	    try {
	      md = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"markdown\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    } catch (err){
	      try {
	        md = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"discount\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	      } catch (err) {
	        try {
	          md = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"markdown-js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	        } catch (err) {
	          try {
	            md = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"marked\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	          } catch (err) {
	            throw new
	              Error('Cannot find markdown library, install markdown, discount, or marked.');
	          }
	        }
	      }
	    }

	    str = str.replace(/\\n/g, '\n');
	    return md.parse(str).replace(/\n/g, '\\n').replace(/'/g,'&#39;');
	  },
	  
	  /**
	   * Transform coffeescript to javascript.
	   */

	  coffeescript: function(str){
	    str = str.replace(/\\n/g, '\n');
	    var js = __webpack_require__(77).compile(str).replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
	    return '<script type="text/javascript">\\n' + js + '</script>';
	  }
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global) {// Generated by CoffeeScript 1.10.0
	(function() {
	  var Lexer, SourceMap, base, compile, ext, formatSourcePosition, fs, getSourceMap, helpers, i, len, lexer, parser, path, ref, sourceMaps, vm, withPrettyErrors,
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  vm = __webpack_require__(78);

	  path = __webpack_require__(5);

	  Lexer = __webpack_require__(80).Lexer;

	  parser = __webpack_require__(83).parser;

	  helpers = __webpack_require__(82);

	  SourceMap = __webpack_require__(84);

	  exports.VERSION = '1.10.0';

	  exports.FILE_EXTENSIONS = ['.coffee', '.litcoffee', '.coffee.md'];

	  exports.helpers = helpers;

	  withPrettyErrors = function(fn) {
	    return function(code, options) {
	      var err, error;
	      if (options == null) {
	        options = {};
	      }
	      try {
	        return fn.call(this, code, options);
	      } catch (error) {
	        err = error;
	        if (typeof code !== 'string') {
	          throw err;
	        }
	        throw helpers.updateSyntaxError(err, code, options.filename);
	      }
	    };
	  };

	  exports.compile = compile = withPrettyErrors(function(code, options) {
	    var answer, currentColumn, currentLine, extend, fragment, fragments, header, i, js, len, map, merge, newLines, token, tokens;
	    merge = helpers.merge, extend = helpers.extend;
	    options = extend({}, options);
	    if (options.sourceMap) {
	      map = new SourceMap;
	    }
	    tokens = lexer.tokenize(code, options);
	    options.referencedVars = (function() {
	      var i, len, results;
	      results = [];
	      for (i = 0, len = tokens.length; i < len; i++) {
	        token = tokens[i];
	        if (token.variable) {
	          results.push(token[1]);
	        }
	      }
	      return results;
	    })();
	    fragments = parser.parse(tokens).compileToFragments(options);
	    currentLine = 0;
	    if (options.header) {
	      currentLine += 1;
	    }
	    if (options.shiftLine) {
	      currentLine += 1;
	    }
	    currentColumn = 0;
	    js = "";
	    for (i = 0, len = fragments.length; i < len; i++) {
	      fragment = fragments[i];
	      if (options.sourceMap) {
	        if (fragment.locationData && !/^[;\s]*$/.test(fragment.code)) {
	          map.add([fragment.locationData.first_line, fragment.locationData.first_column], [currentLine, currentColumn], {
	            noReplace: true
	          });
	        }
	        newLines = helpers.count(fragment.code, "\n");
	        currentLine += newLines;
	        if (newLines) {
	          currentColumn = fragment.code.length - (fragment.code.lastIndexOf("\n") + 1);
	        } else {
	          currentColumn += fragment.code.length;
	        }
	      }
	      js += fragment.code;
	    }
	    if (options.header) {
	      header = "Generated by CoffeeScript " + this.VERSION;
	      js = "// " + header + "\n" + js;
	    }
	    if (options.sourceMap) {
	      answer = {
	        js: js
	      };
	      answer.sourceMap = map;
	      answer.v3SourceMap = map.generate(options, code);
	      return answer;
	    } else {
	      return js;
	    }
	  });

	  exports.tokens = withPrettyErrors(function(code, options) {
	    return lexer.tokenize(code, options);
	  });

	  exports.nodes = withPrettyErrors(function(source, options) {
	    if (typeof source === 'string') {
	      return parser.parse(lexer.tokenize(source, options));
	    } else {
	      return parser.parse(source);
	    }
	  });

	  exports.run = function(code, options) {
	    var answer, dir, mainModule, ref;
	    if (options == null) {
	      options = {};
	    }
	    mainModule = __webpack_require__.c[0];
	    mainModule.filename = process.argv[1] = options.filename ? fs.realpathSync(options.filename) : '.';
	    mainModule.moduleCache && (mainModule.moduleCache = {});
	    dir = options.filename ? path.dirname(fs.realpathSync(options.filename)) : fs.realpathSync('.');
	    mainModule.paths = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))._nodeModulePaths(dir);
	    if (!helpers.isCoffee(mainModule.filename) || (void 0)) {
	      answer = compile(code, options);
	      code = (ref = answer.js) != null ? ref : answer;
	    }
	    return mainModule._compile(code, mainModule.filename);
	  };

	  exports["eval"] = function(code, options) {
	    var Module, _module, _require, createContext, i, isContext, js, k, len, o, r, ref, ref1, ref2, ref3, sandbox, v;
	    if (options == null) {
	      options = {};
	    }
	    if (!(code = code.trim())) {
	      return;
	    }
	    createContext = (ref = vm.Script.createContext) != null ? ref : vm.createContext;
	    isContext = (ref1 = vm.isContext) != null ? ref1 : function(ctx) {
	      return options.sandbox instanceof createContext().constructor;
	    };
	    if (createContext) {
	      if (options.sandbox != null) {
	        if (isContext(options.sandbox)) {
	          sandbox = options.sandbox;
	        } else {
	          sandbox = createContext();
	          ref2 = options.sandbox;
	          for (k in ref2) {
	            if (!hasProp.call(ref2, k)) continue;
	            v = ref2[k];
	            sandbox[k] = v;
	          }
	        }
	        sandbox.global = sandbox.root = sandbox.GLOBAL = sandbox;
	      } else {
	        sandbox = global;
	      }
	      sandbox.__filename = options.filename || 'eval';
	      sandbox.__dirname = path.dirname(sandbox.__filename);
	      if (!(sandbox !== global || sandbox.module || sandbox.require)) {
	        Module = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	        sandbox.module = _module = new Module(options.modulename || 'eval');
	        sandbox.require = _require = function(path) {
	          return Module._load(path, _module, true);
	        };
	        _module.filename = sandbox.__filename;
	        ref3 = Object.getOwnPropertyNames(__webpack_require__(85));
	        for (i = 0, len = ref3.length; i < len; i++) {
	          r = ref3[i];
	          if (r !== 'paths' && r !== 'arguments' && r !== 'caller') {
	            _require[r] = __webpack_require__(85)[r];
	          }
	        }
	        _require.paths = _module.paths = Module._nodeModulePaths(process.cwd());
	        _require.resolve = function(request) {
	          return Module._resolveFilename(request, _module);
	        };
	      }
	    }
	    o = {};
	    for (k in options) {
	      if (!hasProp.call(options, k)) continue;
	      v = options[k];
	      o[k] = v;
	    }
	    o.bare = true;
	    js = compile(code, o);
	    if (sandbox === global) {
	      return vm.runInThisContext(js);
	    } else {
	      return vm.runInContext(js, sandbox);
	    }
	  };

	  exports.register = function() {
	    return __webpack_require__(95);
	  };

	  if ((void 0)) {
	    ref = this.FILE_EXTENSIONS;
	    for (i = 0, len = ref.length; i < len; i++) {
	      ext = ref[i];
	      if ((base = (void 0))[ext] == null) {
	        base[ext] = function() {
	          throw new Error("Use CoffeeScript.register() or require the coffee-script/register module to require " + ext + " files.");
	        };
	      }
	    }
	  }

	  exports._compileFile = function(filename, sourceMap) {
	    var answer, err, error, raw, stripped;
	    if (sourceMap == null) {
	      sourceMap = false;
	    }
	    raw = fs.readFileSync(filename, 'utf8');
	    stripped = raw.charCodeAt(0) === 0xFEFF ? raw.substring(1) : raw;
	    try {
	      answer = compile(stripped, {
	        filename: filename,
	        sourceMap: sourceMap,
	        literate: helpers.isLiterate(filename)
	      });
	    } catch (error) {
	      err = error;
	      throw helpers.updateSyntaxError(err, stripped, filename);
	    }
	    return answer;
	  };

	  lexer = new Lexer;

	  parser.lexer = {
	    lex: function() {
	      var tag, token;
	      token = parser.tokens[this.pos++];
	      if (token) {
	        tag = token[0], this.yytext = token[1], this.yylloc = token[2];
	        parser.errorToken = token.origin || token;
	        this.yylineno = this.yylloc.first_line;
	      } else {
	        tag = '';
	      }
	      return tag;
	    },
	    setInput: function(tokens) {
	      parser.tokens = tokens;
	      return this.pos = 0;
	    },
	    upcomingInput: function() {
	      return "";
	    }
	  };

	  parser.yy = __webpack_require__(91);

	  parser.yy.parseError = function(message, arg) {
	    var errorLoc, errorTag, errorText, errorToken, token, tokens;
	    token = arg.token;
	    errorToken = parser.errorToken, tokens = parser.tokens;
	    errorTag = errorToken[0], errorText = errorToken[1], errorLoc = errorToken[2];
	    errorText = (function() {
	      switch (false) {
	        case errorToken !== tokens[tokens.length - 1]:
	          return 'end of input';
	        case errorTag !== 'INDENT' && errorTag !== 'OUTDENT':
	          return 'indentation';
	        case errorTag !== 'IDENTIFIER' && errorTag !== 'NUMBER' && errorTag !== 'STRING' && errorTag !== 'STRING_START' && errorTag !== 'REGEX' && errorTag !== 'REGEX_START':
	          return errorTag.replace(/_START$/, '').toLowerCase();
	        default:
	          return helpers.nameWhitespaceCharacter(errorText);
	      }
	    })();
	    return helpers.throwSyntaxError("unexpected " + errorText, errorLoc);
	  };

	  formatSourcePosition = function(frame, getSourceMapping) {
	    var as, column, fileLocation, fileName, functionName, isConstructor, isMethodCall, line, methodName, source, tp, typeName;
	    fileName = void 0;
	    fileLocation = '';
	    if (frame.isNative()) {
	      fileLocation = "native";
	    } else {
	      if (frame.isEval()) {
	        fileName = frame.getScriptNameOrSourceURL();
	        if (!fileName) {
	          fileLocation = (frame.getEvalOrigin()) + ", ";
	        }
	      } else {
	        fileName = frame.getFileName();
	      }
	      fileName || (fileName = "<anonymous>");
	      line = frame.getLineNumber();
	      column = frame.getColumnNumber();
	      source = getSourceMapping(fileName, line, column);
	      fileLocation = source ? fileName + ":" + source[0] + ":" + source[1] : fileName + ":" + line + ":" + column;
	    }
	    functionName = frame.getFunctionName();
	    isConstructor = frame.isConstructor();
	    isMethodCall = !(frame.isToplevel() || isConstructor);
	    if (isMethodCall) {
	      methodName = frame.getMethodName();
	      typeName = frame.getTypeName();
	      if (functionName) {
	        tp = as = '';
	        if (typeName && functionName.indexOf(typeName)) {
	          tp = typeName + ".";
	        }
	        if (methodName && functionName.indexOf("." + methodName) !== functionName.length - methodName.length - 1) {
	          as = " [as " + methodName + "]";
	        }
	        return "" + tp + functionName + as + " (" + fileLocation + ")";
	      } else {
	        return typeName + "." + (methodName || '<anonymous>') + " (" + fileLocation + ")";
	      }
	    } else if (isConstructor) {
	      return "new " + (functionName || '<anonymous>') + " (" + fileLocation + ")";
	    } else if (functionName) {
	      return functionName + " (" + fileLocation + ")";
	    } else {
	      return fileLocation;
	    }
	  };

	  sourceMaps = {};

	  getSourceMap = function(filename) {
	    var answer, ref1;
	    if (sourceMaps[filename]) {
	      return sourceMaps[filename];
	    }
	    if (ref1 = path != null ? path.extname(filename) : void 0, indexOf.call(exports.FILE_EXTENSIONS, ref1) < 0) {
	      return;
	    }
	    answer = exports._compileFile(filename, true);
	    return sourceMaps[filename] = answer.sourceMap;
	  };

	  Error.prepareStackTrace = function(err, stack) {
	    var frame, frames, getSourceMapping;
	    getSourceMapping = function(filename, line, column) {
	      var answer, sourceMap;
	      sourceMap = getSourceMap(filename);
	      if (sourceMap) {
	        answer = sourceMap.sourceLocation([line - 1, column - 1]);
	      }
	      if (answer) {
	        return [answer[0] + 1, answer[1] + 1];
	      } else {
	        return null;
	      }
	    };
	    frames = (function() {
	      var j, len1, results;
	      results = [];
	      for (j = 0, len1 = stack.length; j < len1; j++) {
	        frame = stack[j];
	        if (frame.getFunction() === exports.run) {
	          break;
	        }
	        results.push("  at " + (formatSourcePosition(frame, getSourceMapping)));
	      }
	      return results;
	    })();
	    return (err.toString()) + "\n" + (frames.join('\n')) + "\n";
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), (function() { return this; }())))

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	var indexOf = __webpack_require__(79);

	var Object_keys = function (obj) {
	    if (Object.keys) return Object.keys(obj)
	    else {
	        var res = [];
	        for (var key in obj) res.push(key)
	        return res;
	    }
	};

	var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn)
	    else for (var i = 0; i < xs.length; i++) {
	        fn(xs[i], i, xs);
	    }
	};

	var defineProp = (function() {
	    try {
	        Object.defineProperty({}, '_', {});
	        return function(obj, name, value) {
	            Object.defineProperty(obj, name, {
	                writable: true,
	                enumerable: false,
	                configurable: true,
	                value: value
	            })
	        };
	    } catch(e) {
	        return function(obj, name, value) {
	            obj[name] = value;
	        };
	    }
	}());

	var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
	'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
	'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
	'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
	'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

	function Context() {}
	Context.prototype = {};

	var Script = exports.Script = function NodeScript (code) {
	    if (!(this instanceof Script)) return new Script(code);
	    this.code = code;
	};

	Script.prototype.runInContext = function (context) {
	    if (!(context instanceof Context)) {
	        throw new TypeError("needs a 'context' argument.");
	    }
	    
	    var iframe = document.createElement('iframe');
	    if (!iframe.style) iframe.style = {};
	    iframe.style.display = 'none';
	    
	    document.body.appendChild(iframe);
	    
	    var win = iframe.contentWindow;
	    var wEval = win.eval, wExecScript = win.execScript;

	    if (!wEval && wExecScript) {
	        // win.eval() magically appears when this is called in IE:
	        wExecScript.call(win, 'null');
	        wEval = win.eval;
	    }
	    
	    forEach(Object_keys(context), function (key) {
	        win[key] = context[key];
	    });
	    forEach(globals, function (key) {
	        if (context[key]) {
	            win[key] = context[key];
	        }
	    });
	    
	    var winKeys = Object_keys(win);

	    var res = wEval.call(win, this.code);
	    
	    forEach(Object_keys(win), function (key) {
	        // Avoid copying circular objects like `top` and `window` by only
	        // updating existing context properties or new properties in the `win`
	        // that was only introduced after the eval.
	        if (key in context || indexOf(winKeys, key) === -1) {
	            context[key] = win[key];
	        }
	    });

	    forEach(globals, function (key) {
	        if (!(key in context)) {
	            defineProp(context, key, win[key]);
	        }
	    });
	    
	    document.body.removeChild(iframe);
	    
	    return res;
	};

	Script.prototype.runInThisContext = function () {
	    return eval(this.code); // maybe...
	};

	Script.prototype.runInNewContext = function (context) {
	    var ctx = Script.createContext(context);
	    var res = this.runInContext(ctx);

	    forEach(Object_keys(ctx), function (key) {
	        context[key] = ctx[key];
	    });

	    return res;
	};

	forEach(Object_keys(Script.prototype), function (name) {
	    exports[name] = Script[name] = function (code) {
	        var s = Script(code);
	        return s[name].apply(s, [].slice.call(arguments, 1));
	    };
	});

	exports.createScript = function (code) {
	    return exports.Script(code);
	};

	exports.createContext = Script.createContext = function (context) {
	    var copy = new Context();
	    if(typeof context === 'object') {
	        forEach(Object_keys(context), function (key) {
	            copy[key] = context[key];
	        });
	    }
	    return copy;
	};


/***/ },
/* 79 */
/***/ function(module, exports) {

	
	var indexOf = [].indexOf;

	module.exports = function(arr, obj){
	  if (indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var BOM, BOOL, CALLABLE, CODE, COFFEE_ALIASES, COFFEE_ALIAS_MAP, COFFEE_KEYWORDS, COMMENT, COMPARE, COMPOUND_ASSIGN, HERECOMMENT_ILLEGAL, HEREDOC_DOUBLE, HEREDOC_INDENT, HEREDOC_SINGLE, HEREGEX, HEREGEX_OMIT, IDENTIFIER, INDENTABLE_CLOSERS, INDEXABLE, INVALID_ESCAPE, INVERSES, JSTOKEN, JS_FORBIDDEN, JS_KEYWORDS, LEADING_BLANK_LINE, LINE_BREAK, LINE_CONTINUER, LOGIC, Lexer, MATH, MULTI_DENT, NOT_REGEX, NUMBER, OPERATOR, POSSIBLY_DIVISION, REGEX, REGEX_FLAGS, REGEX_ILLEGAL, RELATION, RESERVED, Rewriter, SHIFT, SIMPLE_STRING_OMIT, STRICT_PROSCRIBED, STRING_DOUBLE, STRING_OMIT, STRING_SINGLE, STRING_START, TRAILING_BLANK_LINE, TRAILING_SPACES, UNARY, UNARY_MATH, VALID_FLAGS, WHITESPACE, compact, count, invertLiterate, key, locationDataToString, ref, ref1, repeat, starts, throwSyntaxError,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  ref = __webpack_require__(81), Rewriter = ref.Rewriter, INVERSES = ref.INVERSES;

	  ref1 = __webpack_require__(82), count = ref1.count, starts = ref1.starts, compact = ref1.compact, repeat = ref1.repeat, invertLiterate = ref1.invertLiterate, locationDataToString = ref1.locationDataToString, throwSyntaxError = ref1.throwSyntaxError;

	  exports.Lexer = Lexer = (function() {
	    function Lexer() {}

	    Lexer.prototype.tokenize = function(code, opts) {
	      var consumed, end, i, ref2;
	      if (opts == null) {
	        opts = {};
	      }
	      this.literate = opts.literate;
	      this.indent = 0;
	      this.baseIndent = 0;
	      this.indebt = 0;
	      this.outdebt = 0;
	      this.indents = [];
	      this.ends = [];
	      this.tokens = [];
	      this.seenFor = false;
	      this.chunkLine = opts.line || 0;
	      this.chunkColumn = opts.column || 0;
	      code = this.clean(code);
	      i = 0;
	      while (this.chunk = code.slice(i)) {
	        consumed = this.identifierToken() || this.commentToken() || this.whitespaceToken() || this.lineToken() || this.stringToken() || this.numberToken() || this.regexToken() || this.jsToken() || this.literalToken();
	        ref2 = this.getLineAndColumnFromChunk(consumed), this.chunkLine = ref2[0], this.chunkColumn = ref2[1];
	        i += consumed;
	        if (opts.untilBalanced && this.ends.length === 0) {
	          return {
	            tokens: this.tokens,
	            index: i
	          };
	        }
	      }
	      this.closeIndentation();
	      if (end = this.ends.pop()) {
	        this.error("missing " + end.tag, end.origin[2]);
	      }
	      if (opts.rewrite === false) {
	        return this.tokens;
	      }
	      return (new Rewriter).rewrite(this.tokens);
	    };

	    Lexer.prototype.clean = function(code) {
	      if (code.charCodeAt(0) === BOM) {
	        code = code.slice(1);
	      }
	      code = code.replace(/\r/g, '').replace(TRAILING_SPACES, '');
	      if (WHITESPACE.test(code)) {
	        code = "\n" + code;
	        this.chunkLine--;
	      }
	      if (this.literate) {
	        code = invertLiterate(code);
	      }
	      return code;
	    };

	    Lexer.prototype.identifierToken = function() {
	      var alias, colon, colonOffset, forcedIdentifier, id, idLength, input, match, poppedToken, prev, ref2, ref3, ref4, ref5, tag, tagToken;
	      if (!(match = IDENTIFIER.exec(this.chunk))) {
	        return 0;
	      }
	      input = match[0], id = match[1], colon = match[2];
	      idLength = id.length;
	      poppedToken = void 0;
	      if (id === 'own' && this.tag() === 'FOR') {
	        this.token('OWN', id);
	        return id.length;
	      }
	      if (id === 'from' && this.tag() === 'YIELD') {
	        this.token('FROM', id);
	        return id.length;
	      }
	      ref2 = this.tokens, prev = ref2[ref2.length - 1];
	      forcedIdentifier = colon || (prev != null) && (((ref3 = prev[0]) === '.' || ref3 === '?.' || ref3 === '::' || ref3 === '?::') || !prev.spaced && prev[0] === '@');
	      tag = 'IDENTIFIER';
	      if (!forcedIdentifier && (indexOf.call(JS_KEYWORDS, id) >= 0 || indexOf.call(COFFEE_KEYWORDS, id) >= 0)) {
	        tag = id.toUpperCase();
	        if (tag === 'WHEN' && (ref4 = this.tag(), indexOf.call(LINE_BREAK, ref4) >= 0)) {
	          tag = 'LEADING_WHEN';
	        } else if (tag === 'FOR') {
	          this.seenFor = true;
	        } else if (tag === 'UNLESS') {
	          tag = 'IF';
	        } else if (indexOf.call(UNARY, tag) >= 0) {
	          tag = 'UNARY';
	        } else if (indexOf.call(RELATION, tag) >= 0) {
	          if (tag !== 'INSTANCEOF' && this.seenFor) {
	            tag = 'FOR' + tag;
	            this.seenFor = false;
	          } else {
	            tag = 'RELATION';
	            if (this.value() === '!') {
	              poppedToken = this.tokens.pop();
	              id = '!' + id;
	            }
	          }
	        }
	      }
	      if (indexOf.call(JS_FORBIDDEN, id) >= 0) {
	        if (forcedIdentifier) {
	          tag = 'IDENTIFIER';
	          id = new String(id);
	          id.reserved = true;
	        } else if (indexOf.call(RESERVED, id) >= 0) {
	          this.error("reserved word '" + id + "'", {
	            length: id.length
	          });
	        }
	      }
	      if (!forcedIdentifier) {
	        if (indexOf.call(COFFEE_ALIASES, id) >= 0) {
	          alias = id;
	          id = COFFEE_ALIAS_MAP[id];
	        }
	        tag = (function() {
	          switch (id) {
	            case '!':
	              return 'UNARY';
	            case '==':
	            case '!=':
	              return 'COMPARE';
	            case '&&':
	            case '||':
	              return 'LOGIC';
	            case 'true':
	            case 'false':
	              return 'BOOL';
	            case 'break':
	            case 'continue':
	              return 'STATEMENT';
	            default:
	              return tag;
	          }
	        })();
	      }
	      tagToken = this.token(tag, id, 0, idLength);
	      if (alias) {
	        tagToken.origin = [tag, alias, tagToken[2]];
	      }
	      tagToken.variable = !forcedIdentifier;
	      if (poppedToken) {
	        ref5 = [poppedToken[2].first_line, poppedToken[2].first_column], tagToken[2].first_line = ref5[0], tagToken[2].first_column = ref5[1];
	      }
	      if (colon) {
	        colonOffset = input.lastIndexOf(':');
	        this.token(':', ':', colonOffset, colon.length);
	      }
	      return input.length;
	    };

	    Lexer.prototype.numberToken = function() {
	      var binaryLiteral, lexedLength, match, number, octalLiteral;
	      if (!(match = NUMBER.exec(this.chunk))) {
	        return 0;
	      }
	      number = match[0];
	      lexedLength = number.length;
	      if (/^0[BOX]/.test(number)) {
	        this.error("radix prefix in '" + number + "' must be lowercase", {
	          offset: 1
	        });
	      } else if (/E/.test(number) && !/^0x/.test(number)) {
	        this.error("exponential notation in '" + number + "' must be indicated with a lowercase 'e'", {
	          offset: number.indexOf('E')
	        });
	      } else if (/^0\d*[89]/.test(number)) {
	        this.error("decimal literal '" + number + "' must not be prefixed with '0'", {
	          length: lexedLength
	        });
	      } else if (/^0\d+/.test(number)) {
	        this.error("octal literal '" + number + "' must be prefixed with '0o'", {
	          length: lexedLength
	        });
	      }
	      if (octalLiteral = /^0o([0-7]+)/.exec(number)) {
	        number = '0x' + parseInt(octalLiteral[1], 8).toString(16);
	      }
	      if (binaryLiteral = /^0b([01]+)/.exec(number)) {
	        number = '0x' + parseInt(binaryLiteral[1], 2).toString(16);
	      }
	      this.token('NUMBER', number, 0, lexedLength);
	      return lexedLength;
	    };

	    Lexer.prototype.stringToken = function() {
	      var $, attempt, delimiter, doc, end, heredoc, i, indent, indentRegex, match, quote, ref2, ref3, regex, token, tokens;
	      quote = (STRING_START.exec(this.chunk) || [])[0];
	      if (!quote) {
	        return 0;
	      }
	      regex = (function() {
	        switch (quote) {
	          case "'":
	            return STRING_SINGLE;
	          case '"':
	            return STRING_DOUBLE;
	          case "'''":
	            return HEREDOC_SINGLE;
	          case '"""':
	            return HEREDOC_DOUBLE;
	        }
	      })();
	      heredoc = quote.length === 3;
	      ref2 = this.matchWithInterpolations(regex, quote), tokens = ref2.tokens, end = ref2.index;
	      $ = tokens.length - 1;
	      delimiter = quote.charAt(0);
	      if (heredoc) {
	        indent = null;
	        doc = ((function() {
	          var j, len, results;
	          results = [];
	          for (i = j = 0, len = tokens.length; j < len; i = ++j) {
	            token = tokens[i];
	            if (token[0] === 'NEOSTRING') {
	              results.push(token[1]);
	            }
	          }
	          return results;
	        })()).join('#{}');
	        while (match = HEREDOC_INDENT.exec(doc)) {
	          attempt = match[1];
	          if (indent === null || (0 < (ref3 = attempt.length) && ref3 < indent.length)) {
	            indent = attempt;
	          }
	        }
	        if (indent) {
	          indentRegex = RegExp("^" + indent, "gm");
	        }
	        this.mergeInterpolationTokens(tokens, {
	          delimiter: delimiter
	        }, (function(_this) {
	          return function(value, i) {
	            value = _this.formatString(value);
	            if (i === 0) {
	              value = value.replace(LEADING_BLANK_LINE, '');
	            }
	            if (i === $) {
	              value = value.replace(TRAILING_BLANK_LINE, '');
	            }
	            if (indentRegex) {
	              value = value.replace(indentRegex, '');
	            }
	            return value;
	          };
	        })(this));
	      } else {
	        this.mergeInterpolationTokens(tokens, {
	          delimiter: delimiter
	        }, (function(_this) {
	          return function(value, i) {
	            value = _this.formatString(value);
	            value = value.replace(SIMPLE_STRING_OMIT, function(match, offset) {
	              if ((i === 0 && offset === 0) || (i === $ && offset + match.length === value.length)) {
	                return '';
	              } else {
	                return ' ';
	              }
	            });
	            return value;
	          };
	        })(this));
	      }
	      return end;
	    };

	    Lexer.prototype.commentToken = function() {
	      var comment, here, match;
	      if (!(match = this.chunk.match(COMMENT))) {
	        return 0;
	      }
	      comment = match[0], here = match[1];
	      if (here) {
	        if (match = HERECOMMENT_ILLEGAL.exec(comment)) {
	          this.error("block comments cannot contain " + match[0], {
	            offset: match.index,
	            length: match[0].length
	          });
	        }
	        if (here.indexOf('\n') >= 0) {
	          here = here.replace(RegExp("\\n" + (repeat(' ', this.indent)), "g"), '\n');
	        }
	        this.token('HERECOMMENT', here, 0, comment.length);
	      }
	      return comment.length;
	    };

	    Lexer.prototype.jsToken = function() {
	      var match, script;
	      if (!(this.chunk.charAt(0) === '`' && (match = JSTOKEN.exec(this.chunk)))) {
	        return 0;
	      }
	      this.token('JS', (script = match[0]).slice(1, -1), 0, script.length);
	      return script.length;
	    };

	    Lexer.prototype.regexToken = function() {
	      var body, closed, end, flags, index, match, origin, prev, ref2, ref3, ref4, regex, tokens;
	      switch (false) {
	        case !(match = REGEX_ILLEGAL.exec(this.chunk)):
	          this.error("regular expressions cannot begin with " + match[2], {
	            offset: match.index + match[1].length
	          });
	          break;
	        case !(match = this.matchWithInterpolations(HEREGEX, '///')):
	          tokens = match.tokens, index = match.index;
	          break;
	        case !(match = REGEX.exec(this.chunk)):
	          regex = match[0], body = match[1], closed = match[2];
	          this.validateEscapes(body, {
	            isRegex: true,
	            offsetInChunk: 1
	          });
	          index = regex.length;
	          ref2 = this.tokens, prev = ref2[ref2.length - 1];
	          if (prev) {
	            if (prev.spaced && (ref3 = prev[0], indexOf.call(CALLABLE, ref3) >= 0)) {
	              if (!closed || POSSIBLY_DIVISION.test(regex)) {
	                return 0;
	              }
	            } else if (ref4 = prev[0], indexOf.call(NOT_REGEX, ref4) >= 0) {
	              return 0;
	            }
	          }
	          if (!closed) {
	            this.error('missing / (unclosed regex)');
	          }
	          break;
	        default:
	          return 0;
	      }
	      flags = REGEX_FLAGS.exec(this.chunk.slice(index))[0];
	      end = index + flags.length;
	      origin = this.makeToken('REGEX', null, 0, end);
	      switch (false) {
	        case !!VALID_FLAGS.test(flags):
	          this.error("invalid regular expression flags " + flags, {
	            offset: index,
	            length: flags.length
	          });
	          break;
	        case !(regex || tokens.length === 1):
	          if (body == null) {
	            body = this.formatHeregex(tokens[0][1]);
	          }
	          this.token('REGEX', "" + (this.makeDelimitedLiteral(body, {
	            delimiter: '/'
	          })) + flags, 0, end, origin);
	          break;
	        default:
	          this.token('REGEX_START', '(', 0, 0, origin);
	          this.token('IDENTIFIER', 'RegExp', 0, 0);
	          this.token('CALL_START', '(', 0, 0);
	          this.mergeInterpolationTokens(tokens, {
	            delimiter: '"',
	            double: true
	          }, this.formatHeregex);
	          if (flags) {
	            this.token(',', ',', index, 0);
	            this.token('STRING', '"' + flags + '"', index, flags.length);
	          }
	          this.token(')', ')', end, 0);
	          this.token('REGEX_END', ')', end, 0);
	      }
	      return end;
	    };

	    Lexer.prototype.lineToken = function() {
	      var diff, indent, match, noNewlines, size;
	      if (!(match = MULTI_DENT.exec(this.chunk))) {
	        return 0;
	      }
	      indent = match[0];
	      this.seenFor = false;
	      size = indent.length - 1 - indent.lastIndexOf('\n');
	      noNewlines = this.unfinished();
	      if (size - this.indebt === this.indent) {
	        if (noNewlines) {
	          this.suppressNewlines();
	        } else {
	          this.newlineToken(0);
	        }
	        return indent.length;
	      }
	      if (size > this.indent) {
	        if (noNewlines) {
	          this.indebt = size - this.indent;
	          this.suppressNewlines();
	          return indent.length;
	        }
	        if (!this.tokens.length) {
	          this.baseIndent = this.indent = size;
	          return indent.length;
	        }
	        diff = size - this.indent + this.outdebt;
	        this.token('INDENT', diff, indent.length - size, size);
	        this.indents.push(diff);
	        this.ends.push({
	          tag: 'OUTDENT'
	        });
	        this.outdebt = this.indebt = 0;
	        this.indent = size;
	      } else if (size < this.baseIndent) {
	        this.error('missing indentation', {
	          offset: indent.length
	        });
	      } else {
	        this.indebt = 0;
	        this.outdentToken(this.indent - size, noNewlines, indent.length);
	      }
	      return indent.length;
	    };

	    Lexer.prototype.outdentToken = function(moveOut, noNewlines, outdentLength) {
	      var decreasedIndent, dent, lastIndent, ref2;
	      decreasedIndent = this.indent - moveOut;
	      while (moveOut > 0) {
	        lastIndent = this.indents[this.indents.length - 1];
	        if (!lastIndent) {
	          moveOut = 0;
	        } else if (lastIndent === this.outdebt) {
	          moveOut -= this.outdebt;
	          this.outdebt = 0;
	        } else if (lastIndent < this.outdebt) {
	          this.outdebt -= lastIndent;
	          moveOut -= lastIndent;
	        } else {
	          dent = this.indents.pop() + this.outdebt;
	          if (outdentLength && (ref2 = this.chunk[outdentLength], indexOf.call(INDENTABLE_CLOSERS, ref2) >= 0)) {
	            decreasedIndent -= dent - moveOut;
	            moveOut = dent;
	          }
	          this.outdebt = 0;
	          this.pair('OUTDENT');
	          this.token('OUTDENT', moveOut, 0, outdentLength);
	          moveOut -= dent;
	        }
	      }
	      if (dent) {
	        this.outdebt -= moveOut;
	      }
	      while (this.value() === ';') {
	        this.tokens.pop();
	      }
	      if (!(this.tag() === 'TERMINATOR' || noNewlines)) {
	        this.token('TERMINATOR', '\n', outdentLength, 0);
	      }
	      this.indent = decreasedIndent;
	      return this;
	    };

	    Lexer.prototype.whitespaceToken = function() {
	      var match, nline, prev, ref2;
	      if (!((match = WHITESPACE.exec(this.chunk)) || (nline = this.chunk.charAt(0) === '\n'))) {
	        return 0;
	      }
	      ref2 = this.tokens, prev = ref2[ref2.length - 1];
	      if (prev) {
	        prev[match ? 'spaced' : 'newLine'] = true;
	      }
	      if (match) {
	        return match[0].length;
	      } else {
	        return 0;
	      }
	    };

	    Lexer.prototype.newlineToken = function(offset) {
	      while (this.value() === ';') {
	        this.tokens.pop();
	      }
	      if (this.tag() !== 'TERMINATOR') {
	        this.token('TERMINATOR', '\n', offset, 0);
	      }
	      return this;
	    };

	    Lexer.prototype.suppressNewlines = function() {
	      if (this.value() === '\\') {
	        this.tokens.pop();
	      }
	      return this;
	    };

	    Lexer.prototype.literalToken = function() {
	      var match, prev, ref2, ref3, ref4, ref5, ref6, tag, token, value;
	      if (match = OPERATOR.exec(this.chunk)) {
	        value = match[0];
	        if (CODE.test(value)) {
	          this.tagParameters();
	        }
	      } else {
	        value = this.chunk.charAt(0);
	      }
	      tag = value;
	      ref2 = this.tokens, prev = ref2[ref2.length - 1];
	      if (value === '=' && prev) {
	        if (!prev[1].reserved && (ref3 = prev[1], indexOf.call(JS_FORBIDDEN, ref3) >= 0)) {
	          if (prev.origin) {
	            prev = prev.origin;
	          }
	          this.error("reserved word '" + prev[1] + "' can't be assigned", prev[2]);
	        }
	        if ((ref4 = prev[1]) === '||' || ref4 === '&&') {
	          prev[0] = 'COMPOUND_ASSIGN';
	          prev[1] += '=';
	          return value.length;
	        }
	      }
	      if (value === ';') {
	        this.seenFor = false;
	        tag = 'TERMINATOR';
	      } else if (indexOf.call(MATH, value) >= 0) {
	        tag = 'MATH';
	      } else if (indexOf.call(COMPARE, value) >= 0) {
	        tag = 'COMPARE';
	      } else if (indexOf.call(COMPOUND_ASSIGN, value) >= 0) {
	        tag = 'COMPOUND_ASSIGN';
	      } else if (indexOf.call(UNARY, value) >= 0) {
	        tag = 'UNARY';
	      } else if (indexOf.call(UNARY_MATH, value) >= 0) {
	        tag = 'UNARY_MATH';
	      } else if (indexOf.call(SHIFT, value) >= 0) {
	        tag = 'SHIFT';
	      } else if (indexOf.call(LOGIC, value) >= 0 || value === '?' && (prev != null ? prev.spaced : void 0)) {
	        tag = 'LOGIC';
	      } else if (prev && !prev.spaced) {
	        if (value === '(' && (ref5 = prev[0], indexOf.call(CALLABLE, ref5) >= 0)) {
	          if (prev[0] === '?') {
	            prev[0] = 'FUNC_EXIST';
	          }
	          tag = 'CALL_START';
	        } else if (value === '[' && (ref6 = prev[0], indexOf.call(INDEXABLE, ref6) >= 0)) {
	          tag = 'INDEX_START';
	          switch (prev[0]) {
	            case '?':
	              prev[0] = 'INDEX_SOAK';
	          }
	        }
	      }
	      token = this.makeToken(tag, value);
	      switch (value) {
	        case '(':
	        case '{':
	        case '[':
	          this.ends.push({
	            tag: INVERSES[value],
	            origin: token
	          });
	          break;
	        case ')':
	        case '}':
	        case ']':
	          this.pair(value);
	      }
	      this.tokens.push(token);
	      return value.length;
	    };

	    Lexer.prototype.tagParameters = function() {
	      var i, stack, tok, tokens;
	      if (this.tag() !== ')') {
	        return this;
	      }
	      stack = [];
	      tokens = this.tokens;
	      i = tokens.length;
	      tokens[--i][0] = 'PARAM_END';
	      while (tok = tokens[--i]) {
	        switch (tok[0]) {
	          case ')':
	            stack.push(tok);
	            break;
	          case '(':
	          case 'CALL_START':
	            if (stack.length) {
	              stack.pop();
	            } else if (tok[0] === '(') {
	              tok[0] = 'PARAM_START';
	              return this;
	            } else {
	              return this;
	            }
	        }
	      }
	      return this;
	    };

	    Lexer.prototype.closeIndentation = function() {
	      return this.outdentToken(this.indent);
	    };

	    Lexer.prototype.matchWithInterpolations = function(regex, delimiter) {
	      var close, column, firstToken, index, lastToken, line, nested, offsetInChunk, open, ref2, ref3, ref4, str, strPart, tokens;
	      tokens = [];
	      offsetInChunk = delimiter.length;
	      if (this.chunk.slice(0, offsetInChunk) !== delimiter) {
	        return null;
	      }
	      str = this.chunk.slice(offsetInChunk);
	      while (true) {
	        strPart = regex.exec(str)[0];
	        this.validateEscapes(strPart, {
	          isRegex: delimiter.charAt(0) === '/',
	          offsetInChunk: offsetInChunk
	        });
	        tokens.push(this.makeToken('NEOSTRING', strPart, offsetInChunk));
	        str = str.slice(strPart.length);
	        offsetInChunk += strPart.length;
	        if (str.slice(0, 2) !== '#{') {
	          break;
	        }
	        ref2 = this.getLineAndColumnFromChunk(offsetInChunk + 1), line = ref2[0], column = ref2[1];
	        ref3 = new Lexer().tokenize(str.slice(1), {
	          line: line,
	          column: column,
	          untilBalanced: true
	        }), nested = ref3.tokens, index = ref3.index;
	        index += 1;
	        open = nested[0], close = nested[nested.length - 1];
	        open[0] = open[1] = '(';
	        close[0] = close[1] = ')';
	        close.origin = ['', 'end of interpolation', close[2]];
	        if (((ref4 = nested[1]) != null ? ref4[0] : void 0) === 'TERMINATOR') {
	          nested.splice(1, 1);
	        }
	        tokens.push(['TOKENS', nested]);
	        str = str.slice(index);
	        offsetInChunk += index;
	      }
	      if (str.slice(0, delimiter.length) !== delimiter) {
	        this.error("missing " + delimiter, {
	          length: delimiter.length
	        });
	      }
	      firstToken = tokens[0], lastToken = tokens[tokens.length - 1];
	      firstToken[2].first_column -= delimiter.length;
	      lastToken[2].last_column += delimiter.length;
	      if (lastToken[1].length === 0) {
	        lastToken[2].last_column -= 1;
	      }
	      return {
	        tokens: tokens,
	        index: offsetInChunk + delimiter.length
	      };
	    };

	    Lexer.prototype.mergeInterpolationTokens = function(tokens, options, fn) {
	      var converted, firstEmptyStringIndex, firstIndex, i, j, lastToken, len, locationToken, lparen, plusToken, ref2, rparen, tag, token, tokensToPush, value;
	      if (tokens.length > 1) {
	        lparen = this.token('STRING_START', '(', 0, 0);
	      }
	      firstIndex = this.tokens.length;
	      for (i = j = 0, len = tokens.length; j < len; i = ++j) {
	        token = tokens[i];
	        tag = token[0], value = token[1];
	        switch (tag) {
	          case 'TOKENS':
	            if (value.length === 2) {
	              continue;
	            }
	            locationToken = value[0];
	            tokensToPush = value;
	            break;
	          case 'NEOSTRING':
	            converted = fn(token[1], i);
	            if (converted.length === 0) {
	              if (i === 0) {
	                firstEmptyStringIndex = this.tokens.length;
	              } else {
	                continue;
	              }
	            }
	            if (i === 2 && (firstEmptyStringIndex != null)) {
	              this.tokens.splice(firstEmptyStringIndex, 2);
	            }
	            token[0] = 'STRING';
	            token[1] = this.makeDelimitedLiteral(converted, options);
	            locationToken = token;
	            tokensToPush = [token];
	        }
	        if (this.tokens.length > firstIndex) {
	          plusToken = this.token('+', '+');
	          plusToken[2] = {
	            first_line: locationToken[2].first_line,
	            first_column: locationToken[2].first_column,
	            last_line: locationToken[2].first_line,
	            last_column: locationToken[2].first_column
	          };
	        }
	        (ref2 = this.tokens).push.apply(ref2, tokensToPush);
	      }
	      if (lparen) {
	        lastToken = tokens[tokens.length - 1];
	        lparen.origin = [
	          'STRING', null, {
	            first_line: lparen[2].first_line,
	            first_column: lparen[2].first_column,
	            last_line: lastToken[2].last_line,
	            last_column: lastToken[2].last_column
	          }
	        ];
	        rparen = this.token('STRING_END', ')');
	        return rparen[2] = {
	          first_line: lastToken[2].last_line,
	          first_column: lastToken[2].last_column,
	          last_line: lastToken[2].last_line,
	          last_column: lastToken[2].last_column
	        };
	      }
	    };

	    Lexer.prototype.pair = function(tag) {
	      var lastIndent, prev, ref2, ref3, wanted;
	      ref2 = this.ends, prev = ref2[ref2.length - 1];
	      if (tag !== (wanted = prev != null ? prev.tag : void 0)) {
	        if ('OUTDENT' !== wanted) {
	          this.error("unmatched " + tag);
	        }
	        ref3 = this.indents, lastIndent = ref3[ref3.length - 1];
	        this.outdentToken(lastIndent, true);
	        return this.pair(tag);
	      }
	      return this.ends.pop();
	    };

	    Lexer.prototype.getLineAndColumnFromChunk = function(offset) {
	      var column, lastLine, lineCount, ref2, string;
	      if (offset === 0) {
	        return [this.chunkLine, this.chunkColumn];
	      }
	      if (offset >= this.chunk.length) {
	        string = this.chunk;
	      } else {
	        string = this.chunk.slice(0, +(offset - 1) + 1 || 9e9);
	      }
	      lineCount = count(string, '\n');
	      column = this.chunkColumn;
	      if (lineCount > 0) {
	        ref2 = string.split('\n'), lastLine = ref2[ref2.length - 1];
	        column = lastLine.length;
	      } else {
	        column += string.length;
	      }
	      return [this.chunkLine + lineCount, column];
	    };

	    Lexer.prototype.makeToken = function(tag, value, offsetInChunk, length) {
	      var lastCharacter, locationData, ref2, ref3, token;
	      if (offsetInChunk == null) {
	        offsetInChunk = 0;
	      }
	      if (length == null) {
	        length = value.length;
	      }
	      locationData = {};
	      ref2 = this.getLineAndColumnFromChunk(offsetInChunk), locationData.first_line = ref2[0], locationData.first_column = ref2[1];
	      lastCharacter = Math.max(0, length - 1);
	      ref3 = this.getLineAndColumnFromChunk(offsetInChunk + lastCharacter), locationData.last_line = ref3[0], locationData.last_column = ref3[1];
	      token = [tag, value, locationData];
	      return token;
	    };

	    Lexer.prototype.token = function(tag, value, offsetInChunk, length, origin) {
	      var token;
	      token = this.makeToken(tag, value, offsetInChunk, length);
	      if (origin) {
	        token.origin = origin;
	      }
	      this.tokens.push(token);
	      return token;
	    };

	    Lexer.prototype.tag = function() {
	      var ref2, token;
	      ref2 = this.tokens, token = ref2[ref2.length - 1];
	      return token != null ? token[0] : void 0;
	    };

	    Lexer.prototype.value = function() {
	      var ref2, token;
	      ref2 = this.tokens, token = ref2[ref2.length - 1];
	      return token != null ? token[1] : void 0;
	    };

	    Lexer.prototype.unfinished = function() {
	      var ref2;
	      return LINE_CONTINUER.test(this.chunk) || ((ref2 = this.tag()) === '\\' || ref2 === '.' || ref2 === '?.' || ref2 === '?::' || ref2 === 'UNARY' || ref2 === 'MATH' || ref2 === 'UNARY_MATH' || ref2 === '+' || ref2 === '-' || ref2 === 'YIELD' || ref2 === '**' || ref2 === 'SHIFT' || ref2 === 'RELATION' || ref2 === 'COMPARE' || ref2 === 'LOGIC' || ref2 === 'THROW' || ref2 === 'EXTENDS');
	    };

	    Lexer.prototype.formatString = function(str) {
	      return str.replace(STRING_OMIT, '$1');
	    };

	    Lexer.prototype.formatHeregex = function(str) {
	      return str.replace(HEREGEX_OMIT, '$1$2');
	    };

	    Lexer.prototype.validateEscapes = function(str, options) {
	      var before, hex, invalidEscape, match, message, octal, ref2, unicode;
	      if (options == null) {
	        options = {};
	      }
	      match = INVALID_ESCAPE.exec(str);
	      if (!match) {
	        return;
	      }
	      match[0], before = match[1], octal = match[2], hex = match[3], unicode = match[4];
	      if (options.isRegex && octal && octal.charAt(0) !== '0') {
	        return;
	      }
	      message = octal ? "octal escape sequences are not allowed" : "invalid escape sequence";
	      invalidEscape = "\\" + (octal || hex || unicode);
	      return this.error(message + " " + invalidEscape, {
	        offset: ((ref2 = options.offsetInChunk) != null ? ref2 : 0) + match.index + before.length,
	        length: invalidEscape.length
	      });
	    };

	    Lexer.prototype.makeDelimitedLiteral = function(body, options) {
	      var regex;
	      if (options == null) {
	        options = {};
	      }
	      if (body === '' && options.delimiter === '/') {
	        body = '(?:)';
	      }
	      regex = RegExp("(\\\\\\\\)|(\\\\0(?=[1-7]))|\\\\?(" + options.delimiter + ")|\\\\?(?:(\\n)|(\\r)|(\\u2028)|(\\u2029))|(\\\\.)", "g");
	      body = body.replace(regex, function(match, backslash, nul, delimiter, lf, cr, ls, ps, other) {
	        switch (false) {
	          case !backslash:
	            if (options.double) {
	              return backslash + backslash;
	            } else {
	              return backslash;
	            }
	          case !nul:
	            return '\\x00';
	          case !delimiter:
	            return "\\" + delimiter;
	          case !lf:
	            return '\\n';
	          case !cr:
	            return '\\r';
	          case !ls:
	            return '\\u2028';
	          case !ps:
	            return '\\u2029';
	          case !other:
	            if (options.double) {
	              return "\\" + other;
	            } else {
	              return other;
	            }
	        }
	      });
	      return "" + options.delimiter + body + options.delimiter;
	    };

	    Lexer.prototype.error = function(message, options) {
	      var first_column, first_line, location, ref2, ref3, ref4;
	      if (options == null) {
	        options = {};
	      }
	      location = 'first_line' in options ? options : ((ref3 = this.getLineAndColumnFromChunk((ref2 = options.offset) != null ? ref2 : 0), first_line = ref3[0], first_column = ref3[1], ref3), {
	        first_line: first_line,
	        first_column: first_column,
	        last_column: first_column + ((ref4 = options.length) != null ? ref4 : 1) - 1
	      });
	      return throwSyntaxError(message, location);
	    };

	    return Lexer;

	  })();

	  JS_KEYWORDS = ['true', 'false', 'null', 'this', 'new', 'delete', 'typeof', 'in', 'instanceof', 'return', 'throw', 'break', 'continue', 'debugger', 'yield', 'if', 'else', 'switch', 'for', 'while', 'do', 'try', 'catch', 'finally', 'class', 'extends', 'super'];

	  COFFEE_KEYWORDS = ['undefined', 'then', 'unless', 'until', 'loop', 'of', 'by', 'when'];

	  COFFEE_ALIAS_MAP = {
	    and: '&&',
	    or: '||',
	    is: '==',
	    isnt: '!=',
	    not: '!',
	    yes: 'true',
	    no: 'false',
	    on: 'true',
	    off: 'false'
	  };

	  COFFEE_ALIASES = (function() {
	    var results;
	    results = [];
	    for (key in COFFEE_ALIAS_MAP) {
	      results.push(key);
	    }
	    return results;
	  })();

	  COFFEE_KEYWORDS = COFFEE_KEYWORDS.concat(COFFEE_ALIASES);

	  RESERVED = ['case', 'default', 'function', 'var', 'void', 'with', 'const', 'let', 'enum', 'export', 'import', 'native', 'implements', 'interface', 'package', 'private', 'protected', 'public', 'static'];

	  STRICT_PROSCRIBED = ['arguments', 'eval', 'yield*'];

	  JS_FORBIDDEN = JS_KEYWORDS.concat(RESERVED).concat(STRICT_PROSCRIBED);

	  exports.RESERVED = RESERVED.concat(JS_KEYWORDS).concat(COFFEE_KEYWORDS).concat(STRICT_PROSCRIBED);

	  exports.STRICT_PROSCRIBED = STRICT_PROSCRIBED;

	  BOM = 65279;

	  IDENTIFIER = /^(?!\d)((?:(?!\s)[$\w\x7f-\uffff])+)([^\n\S]*:(?!:))?/;

	  NUMBER = /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i;

	  OPERATOR = /^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>*\/%])\2=?|\?(\.|::)|\.{2,3})/;

	  WHITESPACE = /^[^\n\S]+/;

	  COMMENT = /^###([^#][\s\S]*?)(?:###[^\n\S]*|###$)|^(?:\s*#(?!##[^#]).*)+/;

	  CODE = /^[-=]>/;

	  MULTI_DENT = /^(?:\n[^\n\S]*)+/;

	  JSTOKEN = /^`[^\\`]*(?:\\.[^\\`]*)*`/;

	  STRING_START = /^(?:'''|"""|'|")/;

	  STRING_SINGLE = /^(?:[^\\']|\\[\s\S])*/;

	  STRING_DOUBLE = /^(?:[^\\"#]|\\[\s\S]|\#(?!\{))*/;

	  HEREDOC_SINGLE = /^(?:[^\\']|\\[\s\S]|'(?!''))*/;

	  HEREDOC_DOUBLE = /^(?:[^\\"#]|\\[\s\S]|"(?!"")|\#(?!\{))*/;

	  STRING_OMIT = /((?:\\\\)+)|\\[^\S\n]*\n\s*/g;

	  SIMPLE_STRING_OMIT = /\s*\n\s*/g;

	  HEREDOC_INDENT = /\n+([^\n\S]*)(?=\S)/g;

	  REGEX = /^\/(?!\/)((?:[^[\/\n\\]|\\[^\n]|\[(?:\\[^\n]|[^\]\n\\])*\])*)(\/)?/;

	  REGEX_FLAGS = /^\w*/;

	  VALID_FLAGS = /^(?!.*(.).*\1)[imgy]*$/;

	  HEREGEX = /^(?:[^\\\/#]|\\[\s\S]|\/(?!\/\/)|\#(?!\{))*/;

	  HEREGEX_OMIT = /((?:\\\\)+)|\\(\s)|\s+(?:#.*)?/g;

	  REGEX_ILLEGAL = /^(\/|\/{3}\s*)(\*)/;

	  POSSIBLY_DIVISION = /^\/=?\s/;

	  HERECOMMENT_ILLEGAL = /\*\//;

	  LINE_CONTINUER = /^\s*(?:,|\??\.(?![.\d])|::)/;

	  INVALID_ESCAPE = /((?:^|[^\\])(?:\\\\)*)\\(?:(0[0-7]|[1-7])|(x(?![\da-fA-F]{2}).{0,2})|(u(?![\da-fA-F]{4}).{0,4}))/;

	  LEADING_BLANK_LINE = /^[^\n\S]*\n/;

	  TRAILING_BLANK_LINE = /\n[^\n\S]*$/;

	  TRAILING_SPACES = /\s+$/;

	  COMPOUND_ASSIGN = ['-=', '+=', '/=', '*=', '%=', '||=', '&&=', '?=', '<<=', '>>=', '>>>=', '&=', '^=', '|=', '**=', '//=', '%%='];

	  UNARY = ['NEW', 'TYPEOF', 'DELETE', 'DO'];

	  UNARY_MATH = ['!', '~'];

	  LOGIC = ['&&', '||', '&', '|', '^'];

	  SHIFT = ['<<', '>>', '>>>'];

	  COMPARE = ['==', '!=', '<', '>', '<=', '>='];

	  MATH = ['*', '/', '%', '//', '%%'];

	  RELATION = ['IN', 'OF', 'INSTANCEOF'];

	  BOOL = ['TRUE', 'FALSE'];

	  CALLABLE = ['IDENTIFIER', ')', ']', '?', '@', 'THIS', 'SUPER'];

	  INDEXABLE = CALLABLE.concat(['NUMBER', 'STRING', 'STRING_END', 'REGEX', 'REGEX_END', 'BOOL', 'NULL', 'UNDEFINED', '}', '::']);

	  NOT_REGEX = INDEXABLE.concat(['++', '--']);

	  LINE_BREAK = ['INDENT', 'OUTDENT', 'TERMINATOR'];

	  INDENTABLE_CLOSERS = [')', '}', ']'];

	}).call(this);


/***/ },
/* 81 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var BALANCED_PAIRS, CALL_CLOSERS, EXPRESSION_CLOSE, EXPRESSION_END, EXPRESSION_START, IMPLICIT_CALL, IMPLICIT_END, IMPLICIT_FUNC, IMPLICIT_UNSPACED_CALL, INVERSES, LINEBREAKS, SINGLE_CLOSERS, SINGLE_LINERS, generate, k, left, len, ref, rite,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	    slice = [].slice;

	  generate = function(tag, value, origin) {
	    var tok;
	    tok = [tag, value];
	    tok.generated = true;
	    if (origin) {
	      tok.origin = origin;
	    }
	    return tok;
	  };

	  exports.Rewriter = (function() {
	    function Rewriter() {}

	    Rewriter.prototype.rewrite = function(tokens1) {
	      this.tokens = tokens1;
	      this.removeLeadingNewlines();
	      this.closeOpenCalls();
	      this.closeOpenIndexes();
	      this.normalizeLines();
	      this.tagPostfixConditionals();
	      this.addImplicitBracesAndParens();
	      this.addLocationDataToGeneratedTokens();
	      return this.tokens;
	    };

	    Rewriter.prototype.scanTokens = function(block) {
	      var i, token, tokens;
	      tokens = this.tokens;
	      i = 0;
	      while (token = tokens[i]) {
	        i += block.call(this, token, i, tokens);
	      }
	      return true;
	    };

	    Rewriter.prototype.detectEnd = function(i, condition, action) {
	      var levels, ref, ref1, token, tokens;
	      tokens = this.tokens;
	      levels = 0;
	      while (token = tokens[i]) {
	        if (levels === 0 && condition.call(this, token, i)) {
	          return action.call(this, token, i);
	        }
	        if (!token || levels < 0) {
	          return action.call(this, token, i - 1);
	        }
	        if (ref = token[0], indexOf.call(EXPRESSION_START, ref) >= 0) {
	          levels += 1;
	        } else if (ref1 = token[0], indexOf.call(EXPRESSION_END, ref1) >= 0) {
	          levels -= 1;
	        }
	        i += 1;
	      }
	      return i - 1;
	    };

	    Rewriter.prototype.removeLeadingNewlines = function() {
	      var i, k, len, ref, tag;
	      ref = this.tokens;
	      for (i = k = 0, len = ref.length; k < len; i = ++k) {
	        tag = ref[i][0];
	        if (tag !== 'TERMINATOR') {
	          break;
	        }
	      }
	      if (i) {
	        return this.tokens.splice(0, i);
	      }
	    };

	    Rewriter.prototype.closeOpenCalls = function() {
	      var action, condition;
	      condition = function(token, i) {
	        var ref;
	        return ((ref = token[0]) === ')' || ref === 'CALL_END') || token[0] === 'OUTDENT' && this.tag(i - 1) === ')';
	      };
	      action = function(token, i) {
	        return this.tokens[token[0] === 'OUTDENT' ? i - 1 : i][0] = 'CALL_END';
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] === 'CALL_START') {
	          this.detectEnd(i + 1, condition, action);
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.closeOpenIndexes = function() {
	      var action, condition;
	      condition = function(token, i) {
	        var ref;
	        return (ref = token[0]) === ']' || ref === 'INDEX_END';
	      };
	      action = function(token, i) {
	        return token[0] = 'INDEX_END';
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] === 'INDEX_START') {
	          this.detectEnd(i + 1, condition, action);
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.indexOfTag = function() {
	      var fuzz, i, j, k, pattern, ref, ref1;
	      i = arguments[0], pattern = 2 <= arguments.length ? slice.call(arguments, 1) : [];
	      fuzz = 0;
	      for (j = k = 0, ref = pattern.length; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
	        while (this.tag(i + j + fuzz) === 'HERECOMMENT') {
	          fuzz += 2;
	        }
	        if (pattern[j] == null) {
	          continue;
	        }
	        if (typeof pattern[j] === 'string') {
	          pattern[j] = [pattern[j]];
	        }
	        if (ref1 = this.tag(i + j + fuzz), indexOf.call(pattern[j], ref1) < 0) {
	          return -1;
	        }
	      }
	      return i + j + fuzz - 1;
	    };

	    Rewriter.prototype.looksObjectish = function(j) {
	      var end, index;
	      if (this.indexOfTag(j, '@', null, ':') > -1 || this.indexOfTag(j, null, ':') > -1) {
	        return true;
	      }
	      index = this.indexOfTag(j, EXPRESSION_START);
	      if (index > -1) {
	        end = null;
	        this.detectEnd(index + 1, (function(token) {
	          var ref;
	          return ref = token[0], indexOf.call(EXPRESSION_END, ref) >= 0;
	        }), (function(token, i) {
	          return end = i;
	        }));
	        if (this.tag(end + 1) === ':') {
	          return true;
	        }
	      }
	      return false;
	    };

	    Rewriter.prototype.findTagsBackwards = function(i, tags) {
	      var backStack, ref, ref1, ref2, ref3, ref4, ref5;
	      backStack = [];
	      while (i >= 0 && (backStack.length || (ref2 = this.tag(i), indexOf.call(tags, ref2) < 0) && ((ref3 = this.tag(i), indexOf.call(EXPRESSION_START, ref3) < 0) || this.tokens[i].generated) && (ref4 = this.tag(i), indexOf.call(LINEBREAKS, ref4) < 0))) {
	        if (ref = this.tag(i), indexOf.call(EXPRESSION_END, ref) >= 0) {
	          backStack.push(this.tag(i));
	        }
	        if ((ref1 = this.tag(i), indexOf.call(EXPRESSION_START, ref1) >= 0) && backStack.length) {
	          backStack.pop();
	        }
	        i -= 1;
	      }
	      return ref5 = this.tag(i), indexOf.call(tags, ref5) >= 0;
	    };

	    Rewriter.prototype.addImplicitBracesAndParens = function() {
	      var stack, start;
	      stack = [];
	      start = null;
	      return this.scanTokens(function(token, i, tokens) {
	        var endImplicitCall, endImplicitObject, forward, inImplicit, inImplicitCall, inImplicitControl, inImplicitObject, newLine, nextTag, offset, prevTag, prevToken, ref, ref1, ref2, ref3, ref4, ref5, s, sameLine, stackIdx, stackTag, stackTop, startIdx, startImplicitCall, startImplicitObject, startsLine, tag;
	        tag = token[0];
	        prevTag = (prevToken = i > 0 ? tokens[i - 1] : [])[0];
	        nextTag = (i < tokens.length - 1 ? tokens[i + 1] : [])[0];
	        stackTop = function() {
	          return stack[stack.length - 1];
	        };
	        startIdx = i;
	        forward = function(n) {
	          return i - startIdx + n;
	        };
	        inImplicit = function() {
	          var ref, ref1;
	          return (ref = stackTop()) != null ? (ref1 = ref[2]) != null ? ref1.ours : void 0 : void 0;
	        };
	        inImplicitCall = function() {
	          var ref;
	          return inImplicit() && ((ref = stackTop()) != null ? ref[0] : void 0) === '(';
	        };
	        inImplicitObject = function() {
	          var ref;
	          return inImplicit() && ((ref = stackTop()) != null ? ref[0] : void 0) === '{';
	        };
	        inImplicitControl = function() {
	          var ref;
	          return inImplicit && ((ref = stackTop()) != null ? ref[0] : void 0) === 'CONTROL';
	        };
	        startImplicitCall = function(j) {
	          var idx;
	          idx = j != null ? j : i;
	          stack.push([
	            '(', idx, {
	              ours: true
	            }
	          ]);
	          tokens.splice(idx, 0, generate('CALL_START', '('));
	          if (j == null) {
	            return i += 1;
	          }
	        };
	        endImplicitCall = function() {
	          stack.pop();
	          tokens.splice(i, 0, generate('CALL_END', ')', ['', 'end of input', token[2]]));
	          return i += 1;
	        };
	        startImplicitObject = function(j, startsLine) {
	          var idx, val;
	          if (startsLine == null) {
	            startsLine = true;
	          }
	          idx = j != null ? j : i;
	          stack.push([
	            '{', idx, {
	              sameLine: true,
	              startsLine: startsLine,
	              ours: true
	            }
	          ]);
	          val = new String('{');
	          val.generated = true;
	          tokens.splice(idx, 0, generate('{', val, token));
	          if (j == null) {
	            return i += 1;
	          }
	        };
	        endImplicitObject = function(j) {
	          j = j != null ? j : i;
	          stack.pop();
	          tokens.splice(j, 0, generate('}', '}', token));
	          return i += 1;
	        };
	        if (inImplicitCall() && (tag === 'IF' || tag === 'TRY' || tag === 'FINALLY' || tag === 'CATCH' || tag === 'CLASS' || tag === 'SWITCH')) {
	          stack.push([
	            'CONTROL', i, {
	              ours: true
	            }
	          ]);
	          return forward(1);
	        }
	        if (tag === 'INDENT' && inImplicit()) {
	          if (prevTag !== '=>' && prevTag !== '->' && prevTag !== '[' && prevTag !== '(' && prevTag !== ',' && prevTag !== '{' && prevTag !== 'TRY' && prevTag !== 'ELSE' && prevTag !== '=') {
	            while (inImplicitCall()) {
	              endImplicitCall();
	            }
	          }
	          if (inImplicitControl()) {
	            stack.pop();
	          }
	          stack.push([tag, i]);
	          return forward(1);
	        }
	        if (indexOf.call(EXPRESSION_START, tag) >= 0) {
	          stack.push([tag, i]);
	          return forward(1);
	        }
	        if (indexOf.call(EXPRESSION_END, tag) >= 0) {
	          while (inImplicit()) {
	            if (inImplicitCall()) {
	              endImplicitCall();
	            } else if (inImplicitObject()) {
	              endImplicitObject();
	            } else {
	              stack.pop();
	            }
	          }
	          start = stack.pop();
	        }
	        if ((indexOf.call(IMPLICIT_FUNC, tag) >= 0 && token.spaced || tag === '?' && i > 0 && !tokens[i - 1].spaced) && (indexOf.call(IMPLICIT_CALL, nextTag) >= 0 || indexOf.call(IMPLICIT_UNSPACED_CALL, nextTag) >= 0 && !((ref = tokens[i + 1]) != null ? ref.spaced : void 0) && !((ref1 = tokens[i + 1]) != null ? ref1.newLine : void 0))) {
	          if (tag === '?') {
	            tag = token[0] = 'FUNC_EXIST';
	          }
	          startImplicitCall(i + 1);
	          return forward(2);
	        }
	        if (indexOf.call(IMPLICIT_FUNC, tag) >= 0 && this.indexOfTag(i + 1, 'INDENT') > -1 && this.looksObjectish(i + 2) && !this.findTagsBackwards(i, ['CLASS', 'EXTENDS', 'IF', 'CATCH', 'SWITCH', 'LEADING_WHEN', 'FOR', 'WHILE', 'UNTIL'])) {
	          startImplicitCall(i + 1);
	          stack.push(['INDENT', i + 2]);
	          return forward(3);
	        }
	        if (tag === ':') {
	          s = (function() {
	            var ref2;
	            switch (false) {
	              case ref2 = this.tag(i - 1), indexOf.call(EXPRESSION_END, ref2) < 0:
	                return start[1];
	              case this.tag(i - 2) !== '@':
	                return i - 2;
	              default:
	                return i - 1;
	            }
	          }).call(this);
	          while (this.tag(s - 2) === 'HERECOMMENT') {
	            s -= 2;
	          }
	          this.insideForDeclaration = nextTag === 'FOR';
	          startsLine = s === 0 || (ref2 = this.tag(s - 1), indexOf.call(LINEBREAKS, ref2) >= 0) || tokens[s - 1].newLine;
	          if (stackTop()) {
	            ref3 = stackTop(), stackTag = ref3[0], stackIdx = ref3[1];
	            if ((stackTag === '{' || stackTag === 'INDENT' && this.tag(stackIdx - 1) === '{') && (startsLine || this.tag(s - 1) === ',' || this.tag(s - 1) === '{')) {
	              return forward(1);
	            }
	          }
	          startImplicitObject(s, !!startsLine);
	          return forward(2);
	        }
	        if (inImplicitObject() && indexOf.call(LINEBREAKS, tag) >= 0) {
	          stackTop()[2].sameLine = false;
	        }
	        newLine = prevTag === 'OUTDENT' || prevToken.newLine;
	        if (indexOf.call(IMPLICIT_END, tag) >= 0 || indexOf.call(CALL_CLOSERS, tag) >= 0 && newLine) {
	          while (inImplicit()) {
	            ref4 = stackTop(), stackTag = ref4[0], stackIdx = ref4[1], (ref5 = ref4[2], sameLine = ref5.sameLine, startsLine = ref5.startsLine);
	            if (inImplicitCall() && prevTag !== ',') {
	              endImplicitCall();
	            } else if (inImplicitObject() && !this.insideForDeclaration && sameLine && tag !== 'TERMINATOR' && prevTag !== ':') {
	              endImplicitObject();
	            } else if (inImplicitObject() && tag === 'TERMINATOR' && prevTag !== ',' && !(startsLine && this.looksObjectish(i + 1))) {
	              if (nextTag === 'HERECOMMENT') {
	                return forward(1);
	              }
	              endImplicitObject();
	            } else {
	              break;
	            }
	          }
	        }
	        if (tag === ',' && !this.looksObjectish(i + 1) && inImplicitObject() && !this.insideForDeclaration && (nextTag !== 'TERMINATOR' || !this.looksObjectish(i + 2))) {
	          offset = nextTag === 'OUTDENT' ? 1 : 0;
	          while (inImplicitObject()) {
	            endImplicitObject(i + offset);
	          }
	        }
	        return forward(1);
	      });
	    };

	    Rewriter.prototype.addLocationDataToGeneratedTokens = function() {
	      return this.scanTokens(function(token, i, tokens) {
	        var column, line, nextLocation, prevLocation, ref, ref1;
	        if (token[2]) {
	          return 1;
	        }
	        if (!(token.generated || token.explicit)) {
	          return 1;
	        }
	        if (token[0] === '{' && (nextLocation = (ref = tokens[i + 1]) != null ? ref[2] : void 0)) {
	          line = nextLocation.first_line, column = nextLocation.first_column;
	        } else if (prevLocation = (ref1 = tokens[i - 1]) != null ? ref1[2] : void 0) {
	          line = prevLocation.last_line, column = prevLocation.last_column;
	        } else {
	          line = column = 0;
	        }
	        token[2] = {
	          first_line: line,
	          first_column: column,
	          last_line: line,
	          last_column: column
	        };
	        return 1;
	      });
	    };

	    Rewriter.prototype.normalizeLines = function() {
	      var action, condition, indent, outdent, starter;
	      starter = indent = outdent = null;
	      condition = function(token, i) {
	        var ref, ref1, ref2, ref3;
	        return token[1] !== ';' && (ref = token[0], indexOf.call(SINGLE_CLOSERS, ref) >= 0) && !(token[0] === 'TERMINATOR' && (ref1 = this.tag(i + 1), indexOf.call(EXPRESSION_CLOSE, ref1) >= 0)) && !(token[0] === 'ELSE' && starter !== 'THEN') && !(((ref2 = token[0]) === 'CATCH' || ref2 === 'FINALLY') && (starter === '->' || starter === '=>')) || (ref3 = token[0], indexOf.call(CALL_CLOSERS, ref3) >= 0) && this.tokens[i - 1].newLine;
	      };
	      action = function(token, i) {
	        return this.tokens.splice((this.tag(i - 1) === ',' ? i - 1 : i), 0, outdent);
	      };
	      return this.scanTokens(function(token, i, tokens) {
	        var j, k, ref, ref1, ref2, tag;
	        tag = token[0];
	        if (tag === 'TERMINATOR') {
	          if (this.tag(i + 1) === 'ELSE' && this.tag(i - 1) !== 'OUTDENT') {
	            tokens.splice.apply(tokens, [i, 1].concat(slice.call(this.indentation())));
	            return 1;
	          }
	          if (ref = this.tag(i + 1), indexOf.call(EXPRESSION_CLOSE, ref) >= 0) {
	            tokens.splice(i, 1);
	            return 0;
	          }
	        }
	        if (tag === 'CATCH') {
	          for (j = k = 1; k <= 2; j = ++k) {
	            if (!((ref1 = this.tag(i + j)) === 'OUTDENT' || ref1 === 'TERMINATOR' || ref1 === 'FINALLY')) {
	              continue;
	            }
	            tokens.splice.apply(tokens, [i + j, 0].concat(slice.call(this.indentation())));
	            return 2 + j;
	          }
	        }
	        if (indexOf.call(SINGLE_LINERS, tag) >= 0 && this.tag(i + 1) !== 'INDENT' && !(tag === 'ELSE' && this.tag(i + 1) === 'IF')) {
	          starter = tag;
	          ref2 = this.indentation(tokens[i]), indent = ref2[0], outdent = ref2[1];
	          if (starter === 'THEN') {
	            indent.fromThen = true;
	          }
	          tokens.splice(i + 1, 0, indent);
	          this.detectEnd(i + 2, condition, action);
	          if (tag === 'THEN') {
	            tokens.splice(i, 1);
	          }
	          return 1;
	        }
	        return 1;
	      });
	    };

	    Rewriter.prototype.tagPostfixConditionals = function() {
	      var action, condition, original;
	      original = null;
	      condition = function(token, i) {
	        var prevTag, tag;
	        tag = token[0];
	        prevTag = this.tokens[i - 1][0];
	        return tag === 'TERMINATOR' || (tag === 'INDENT' && indexOf.call(SINGLE_LINERS, prevTag) < 0);
	      };
	      action = function(token, i) {
	        if (token[0] !== 'INDENT' || (token.generated && !token.fromThen)) {
	          return original[0] = 'POST_' + original[0];
	        }
	      };
	      return this.scanTokens(function(token, i) {
	        if (token[0] !== 'IF') {
	          return 1;
	        }
	        original = token;
	        this.detectEnd(i + 1, condition, action);
	        return 1;
	      });
	    };

	    Rewriter.prototype.indentation = function(origin) {
	      var indent, outdent;
	      indent = ['INDENT', 2];
	      outdent = ['OUTDENT', 2];
	      if (origin) {
	        indent.generated = outdent.generated = true;
	        indent.origin = outdent.origin = origin;
	      } else {
	        indent.explicit = outdent.explicit = true;
	      }
	      return [indent, outdent];
	    };

	    Rewriter.prototype.generate = generate;

	    Rewriter.prototype.tag = function(i) {
	      var ref;
	      return (ref = this.tokens[i]) != null ? ref[0] : void 0;
	    };

	    return Rewriter;

	  })();

	  BALANCED_PAIRS = [['(', ')'], ['[', ']'], ['{', '}'], ['INDENT', 'OUTDENT'], ['CALL_START', 'CALL_END'], ['PARAM_START', 'PARAM_END'], ['INDEX_START', 'INDEX_END'], ['STRING_START', 'STRING_END'], ['REGEX_START', 'REGEX_END']];

	  exports.INVERSES = INVERSES = {};

	  EXPRESSION_START = [];

	  EXPRESSION_END = [];

	  for (k = 0, len = BALANCED_PAIRS.length; k < len; k++) {
	    ref = BALANCED_PAIRS[k], left = ref[0], rite = ref[1];
	    EXPRESSION_START.push(INVERSES[rite] = left);
	    EXPRESSION_END.push(INVERSES[left] = rite);
	  }

	  EXPRESSION_CLOSE = ['CATCH', 'THEN', 'ELSE', 'FINALLY'].concat(EXPRESSION_END);

	  IMPLICIT_FUNC = ['IDENTIFIER', 'SUPER', ')', 'CALL_END', ']', 'INDEX_END', '@', 'THIS'];

	  IMPLICIT_CALL = ['IDENTIFIER', 'NUMBER', 'STRING', 'STRING_START', 'JS', 'REGEX', 'REGEX_START', 'NEW', 'PARAM_START', 'CLASS', 'IF', 'TRY', 'SWITCH', 'THIS', 'BOOL', 'NULL', 'UNDEFINED', 'UNARY', 'YIELD', 'UNARY_MATH', 'SUPER', 'THROW', '@', '->', '=>', '[', '(', '{', '--', '++'];

	  IMPLICIT_UNSPACED_CALL = ['+', '-'];

	  IMPLICIT_END = ['POST_IF', 'FOR', 'WHILE', 'UNTIL', 'WHEN', 'BY', 'LOOP', 'TERMINATOR'];

	  SINGLE_LINERS = ['ELSE', '->', '=>', 'TRY', 'FINALLY', 'THEN'];

	  SINGLE_CLOSERS = ['TERMINATOR', 'CATCH', 'FINALLY', 'ELSE', 'OUTDENT', 'LEADING_WHEN'];

	  LINEBREAKS = ['TERMINATOR', 'INDENT', 'OUTDENT'];

	  CALL_CLOSERS = ['.', '?.', '::', '?::'];

	}).call(this);


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.10.0
	(function() {
	  var buildLocationData, extend, flatten, ref, repeat, syntaxErrorToString;

	  exports.starts = function(string, literal, start) {
	    return literal === string.substr(start, literal.length);
	  };

	  exports.ends = function(string, literal, back) {
	    var len;
	    len = literal.length;
	    return literal === string.substr(string.length - len - (back || 0), len);
	  };

	  exports.repeat = repeat = function(str, n) {
	    var res;
	    res = '';
	    while (n > 0) {
	      if (n & 1) {
	        res += str;
	      }
	      n >>>= 1;
	      str += str;
	    }
	    return res;
	  };

	  exports.compact = function(array) {
	    var i, item, len1, results;
	    results = [];
	    for (i = 0, len1 = array.length; i < len1; i++) {
	      item = array[i];
	      if (item) {
	        results.push(item);
	      }
	    }
	    return results;
	  };

	  exports.count = function(string, substr) {
	    var num, pos;
	    num = pos = 0;
	    if (!substr.length) {
	      return 1 / 0;
	    }
	    while (pos = 1 + string.indexOf(substr, pos)) {
	      num++;
	    }
	    return num;
	  };

	  exports.merge = function(options, overrides) {
	    return extend(extend({}, options), overrides);
	  };

	  extend = exports.extend = function(object, properties) {
	    var key, val;
	    for (key in properties) {
	      val = properties[key];
	      object[key] = val;
	    }
	    return object;
	  };

	  exports.flatten = flatten = function(array) {
	    var element, flattened, i, len1;
	    flattened = [];
	    for (i = 0, len1 = array.length; i < len1; i++) {
	      element = array[i];
	      if ('[object Array]' === Object.prototype.toString.call(element)) {
	        flattened = flattened.concat(flatten(element));
	      } else {
	        flattened.push(element);
	      }
	    }
	    return flattened;
	  };

	  exports.del = function(obj, key) {
	    var val;
	    val = obj[key];
	    delete obj[key];
	    return val;
	  };

	  exports.some = (ref = Array.prototype.some) != null ? ref : function(fn) {
	    var e, i, len1;
	    for (i = 0, len1 = this.length; i < len1; i++) {
	      e = this[i];
	      if (fn(e)) {
	        return true;
	      }
	    }
	    return false;
	  };

	  exports.invertLiterate = function(code) {
	    var line, lines, maybe_code;
	    maybe_code = true;
	    lines = (function() {
	      var i, len1, ref1, results;
	      ref1 = code.split('\n');
	      results = [];
	      for (i = 0, len1 = ref1.length; i < len1; i++) {
	        line = ref1[i];
	        if (maybe_code && /^([ ]{4}|[ ]{0,3}\t)/.test(line)) {
	          results.push(line);
	        } else if (maybe_code = /^\s*$/.test(line)) {
	          results.push(line);
	        } else {
	          results.push('# ' + line);
	        }
	      }
	      return results;
	    })();
	    return lines.join('\n');
	  };

	  buildLocationData = function(first, last) {
	    if (!last) {
	      return first;
	    } else {
	      return {
	        first_line: first.first_line,
	        first_column: first.first_column,
	        last_line: last.last_line,
	        last_column: last.last_column
	      };
	    }
	  };

	  exports.addLocationDataFn = function(first, last) {
	    return function(obj) {
	      if (((typeof obj) === 'object') && (!!obj['updateLocationDataIfMissing'])) {
	        obj.updateLocationDataIfMissing(buildLocationData(first, last));
	      }
	      return obj;
	    };
	  };

	  exports.locationDataToString = function(obj) {
	    var locationData;
	    if (("2" in obj) && ("first_line" in obj[2])) {
	      locationData = obj[2];
	    } else if ("first_line" in obj) {
	      locationData = obj;
	    }
	    if (locationData) {
	      return ((locationData.first_line + 1) + ":" + (locationData.first_column + 1) + "-") + ((locationData.last_line + 1) + ":" + (locationData.last_column + 1));
	    } else {
	      return "No location data";
	    }
	  };

	  exports.baseFileName = function(file, stripExt, useWinPathSep) {
	    var parts, pathSep;
	    if (stripExt == null) {
	      stripExt = false;
	    }
	    if (useWinPathSep == null) {
	      useWinPathSep = false;
	    }
	    pathSep = useWinPathSep ? /\\|\// : /\//;
	    parts = file.split(pathSep);
	    file = parts[parts.length - 1];
	    if (!(stripExt && file.indexOf('.') >= 0)) {
	      return file;
	    }
	    parts = file.split('.');
	    parts.pop();
	    if (parts[parts.length - 1] === 'coffee' && parts.length > 1) {
	      parts.pop();
	    }
	    return parts.join('.');
	  };

	  exports.isCoffee = function(file) {
	    return /\.((lit)?coffee|coffee\.md)$/.test(file);
	  };

	  exports.isLiterate = function(file) {
	    return /\.(litcoffee|coffee\.md)$/.test(file);
	  };

	  exports.throwSyntaxError = function(message, location) {
	    var error;
	    error = new SyntaxError(message);
	    error.location = location;
	    error.toString = syntaxErrorToString;
	    error.stack = error.toString();
	    throw error;
	  };

	  exports.updateSyntaxError = function(error, code, filename) {
	    if (error.toString === syntaxErrorToString) {
	      error.code || (error.code = code);
	      error.filename || (error.filename = filename);
	      error.stack = error.toString();
	    }
	    return error;
	  };

	  syntaxErrorToString = function() {
	    var codeLine, colorize, colorsEnabled, end, filename, first_column, first_line, last_column, last_line, marker, ref1, ref2, ref3, ref4, start;
	    if (!(this.code && this.location)) {
	      return Error.prototype.toString.call(this);
	    }
	    ref1 = this.location, first_line = ref1.first_line, first_column = ref1.first_column, last_line = ref1.last_line, last_column = ref1.last_column;
	    if (last_line == null) {
	      last_line = first_line;
	    }
	    if (last_column == null) {
	      last_column = first_column;
	    }
	    filename = this.filename || '[stdin]';
	    codeLine = this.code.split('\n')[first_line];
	    start = first_column;
	    end = first_line === last_line ? last_column + 1 : codeLine.length;
	    marker = codeLine.slice(0, start).replace(/[^\s]/g, ' ') + repeat('^', end - start);
	    if (typeof process !== "undefined" && process !== null) {
	      colorsEnabled = ((ref2 = process.stdout) != null ? ref2.isTTY : void 0) && !((ref3 = process.env) != null ? ref3.NODE_DISABLE_COLORS : void 0);
	    }
	    if ((ref4 = this.colorful) != null ? ref4 : colorsEnabled) {
	      colorize = function(str) {
	        return "\x1B[1;31m" + str + "\x1B[0m";
	      };
	      codeLine = codeLine.slice(0, start) + colorize(codeLine.slice(start, end)) + codeLine.slice(end);
	      marker = colorize(marker);
	    }
	    return filename + ":" + (first_line + 1) + ":" + (first_column + 1) + ": error: " + this.message + "\n" + codeLine + "\n" + marker;
	  };

	  exports.nameWhitespaceCharacter = function(string) {
	    switch (string) {
	      case ' ':
	        return 'space';
	      case '\n':
	        return 'newline';
	      case '\r':
	        return 'carriage return';
	      case '\t':
	        return 'tab';
	      default:
	        return string;
	    }
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {/* parser generated by jison 0.4.15 */
	/*
	  Returns a Parser object of the following structure:

	  Parser: {
	    yy: {}
	  }

	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),

	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),

	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },

	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }


	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }


	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var parser = (function(){
	var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,20],$V1=[1,75],$V2=[1,71],$V3=[1,76],$V4=[1,77],$V5=[1,73],$V6=[1,74],$V7=[1,50],$V8=[1,52],$V9=[1,53],$Va=[1,54],$Vb=[1,55],$Vc=[1,45],$Vd=[1,46],$Ve=[1,27],$Vf=[1,60],$Vg=[1,61],$Vh=[1,70],$Vi=[1,43],$Vj=[1,26],$Vk=[1,58],$Vl=[1,59],$Vm=[1,57],$Vn=[1,38],$Vo=[1,44],$Vp=[1,56],$Vq=[1,65],$Vr=[1,66],$Vs=[1,67],$Vt=[1,68],$Vu=[1,42],$Vv=[1,64],$Vw=[1,29],$Vx=[1,30],$Vy=[1,31],$Vz=[1,32],$VA=[1,33],$VB=[1,34],$VC=[1,35],$VD=[1,78],$VE=[1,6,26,34,109],$VF=[1,88],$VG=[1,81],$VH=[1,80],$VI=[1,79],$VJ=[1,82],$VK=[1,83],$VL=[1,84],$VM=[1,85],$VN=[1,86],$VO=[1,87],$VP=[1,91],$VQ=[1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,136,137,142,143,144,145,146,147,148],$VR=[1,97],$VS=[1,98],$VT=[1,99],$VU=[1,100],$VV=[1,102],$VW=[1,103],$VX=[1,96],$VY=[2,115],$VZ=[1,6,25,26,34,56,61,64,73,74,75,76,78,80,81,85,91,92,93,98,100,109,111,112,113,117,118,133,136,137,142,143,144,145,146,147,148],$V_=[2,82],$V$=[1,108],$V01=[2,61],$V11=[1,112],$V21=[1,117],$V31=[1,118],$V41=[1,120],$V51=[1,6,25,26,34,46,56,61,64,73,74,75,76,78,80,81,85,91,92,93,98,100,109,111,112,113,117,118,133,136,137,142,143,144,145,146,147,148],$V61=[2,79],$V71=[1,6,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,136,137,142,143,144,145,146,147,148],$V81=[1,155],$V91=[1,157],$Va1=[1,152],$Vb1=[1,6,25,26,34,46,56,61,64,73,74,75,76,78,80,81,85,87,91,92,93,98,100,109,111,112,113,117,118,133,136,137,140,141,142,143,144,145,146,147,148,149],$Vc1=[2,98],$Vd1=[1,6,25,26,34,49,56,61,64,73,74,75,76,78,80,81,85,91,92,93,98,100,109,111,112,113,117,118,133,136,137,142,143,144,145,146,147,148],$Ve1=[1,6,25,26,34,46,49,56,61,64,73,74,75,76,78,80,81,85,87,91,92,93,98,100,109,111,112,113,117,118,124,125,133,136,137,140,141,142,143,144,145,146,147,148,149],$Vf1=[1,207],$Vg1=[1,206],$Vh1=[1,6,25,26,34,38,56,61,64,73,74,75,76,78,80,81,85,91,92,93,98,100,109,111,112,113,117,118,133,136,137,142,143,144,145,146,147,148],$Vi1=[2,59],$Vj1=[1,217],$Vk1=[6,25,26,56,61],$Vl1=[6,25,26,46,56,61,64],$Vm1=[1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,136,137,143,145,146,147,148],$Vn1=[1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133],$Vo1=[73,74,75,76,78,81,91,92],$Vp1=[1,236],$Vq1=[2,136],$Vr1=[1,6,25,26,34,46,56,61,64,73,74,75,76,78,80,81,85,91,92,93,98,100,109,111,112,113,117,118,124,125,133,136,137,142,143,144,145,146,147,148],$Vs1=[1,245],$Vt1=[6,25,26,61,93,98],$Vu1=[1,6,25,26,34,56,61,64,80,85,93,98,100,109,118,133],$Vv1=[1,6,25,26,34,56,61,64,80,85,93,98,100,109,112,118,133],$Vw1=[124,125],$Vx1=[61,124,125],$Vy1=[1,256],$Vz1=[6,25,26,61,85],$VA1=[6,25,26,49,61,85],$VB1=[6,25,26,46,49,61,85],$VC1=[1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,136,137,145,146,147,148],$VD1=[11,28,30,32,33,36,37,40,41,42,43,44,52,53,54,58,59,80,83,86,90,95,96,97,103,107,108,111,113,115,117,126,132,134,135,136,137,138,140,141],$VE1=[2,125],$VF1=[6,25,26],$VG1=[2,60],$VH1=[1,270],$VI1=[1,271],$VJ1=[1,6,25,26,34,56,61,64,80,85,93,98,100,105,106,109,111,112,113,117,118,128,130,133,136,137,142,143,144,145,146,147,148],$VK1=[26,128,130],$VL1=[1,6,26,34,56,61,64,80,85,93,98,100,109,112,118,133],$VM1=[2,74],$VN1=[1,293],$VO1=[1,294],$VP1=[1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,128,133,136,137,142,143,144,145,146,147,148],$VQ1=[1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,113,117,118,133],$VR1=[1,305],$VS1=[1,306],$VT1=[6,25,26,61],$VU1=[1,6,25,26,34,56,61,64,80,85,93,98,100,105,109,111,112,113,117,118,133,136,137,142,143,144,145,146,147,148],$VV1=[25,61];
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"Root":3,"Body":4,"Line":5,"TERMINATOR":6,"Expression":7,"Statement":8,"Return":9,"Comment":10,"STATEMENT":11,"Value":12,"Invocation":13,"Code":14,"Operation":15,"Assign":16,"If":17,"Try":18,"While":19,"For":20,"Switch":21,"Class":22,"Throw":23,"Block":24,"INDENT":25,"OUTDENT":26,"Identifier":27,"IDENTIFIER":28,"AlphaNumeric":29,"NUMBER":30,"String":31,"STRING":32,"STRING_START":33,"STRING_END":34,"Regex":35,"REGEX":36,"REGEX_START":37,"REGEX_END":38,"Literal":39,"JS":40,"DEBUGGER":41,"UNDEFINED":42,"NULL":43,"BOOL":44,"Assignable":45,"=":46,"AssignObj":47,"ObjAssignable":48,":":49,"SimpleObjAssignable":50,"ThisProperty":51,"RETURN":52,"HERECOMMENT":53,"PARAM_START":54,"ParamList":55,"PARAM_END":56,"FuncGlyph":57,"->":58,"=>":59,"OptComma":60,",":61,"Param":62,"ParamVar":63,"...":64,"Array":65,"Object":66,"Splat":67,"SimpleAssignable":68,"Accessor":69,"Parenthetical":70,"Range":71,"This":72,".":73,"?.":74,"::":75,"?::":76,"Index":77,"INDEX_START":78,"IndexValue":79,"INDEX_END":80,"INDEX_SOAK":81,"Slice":82,"{":83,"AssignList":84,"}":85,"CLASS":86,"EXTENDS":87,"OptFuncExist":88,"Arguments":89,"SUPER":90,"FUNC_EXIST":91,"CALL_START":92,"CALL_END":93,"ArgList":94,"THIS":95,"@":96,"[":97,"]":98,"RangeDots":99,"..":100,"Arg":101,"SimpleArgs":102,"TRY":103,"Catch":104,"FINALLY":105,"CATCH":106,"THROW":107,"(":108,")":109,"WhileSource":110,"WHILE":111,"WHEN":112,"UNTIL":113,"Loop":114,"LOOP":115,"ForBody":116,"FOR":117,"BY":118,"ForStart":119,"ForSource":120,"ForVariables":121,"OWN":122,"ForValue":123,"FORIN":124,"FOROF":125,"SWITCH":126,"Whens":127,"ELSE":128,"When":129,"LEADING_WHEN":130,"IfBlock":131,"IF":132,"POST_IF":133,"UNARY":134,"UNARY_MATH":135,"-":136,"+":137,"YIELD":138,"FROM":139,"--":140,"++":141,"?":142,"MATH":143,"**":144,"SHIFT":145,"COMPARE":146,"LOGIC":147,"RELATION":148,"COMPOUND_ASSIGN":149,"$accept":0,"$end":1},
	terminals_: {2:"error",6:"TERMINATOR",11:"STATEMENT",25:"INDENT",26:"OUTDENT",28:"IDENTIFIER",30:"NUMBER",32:"STRING",33:"STRING_START",34:"STRING_END",36:"REGEX",37:"REGEX_START",38:"REGEX_END",40:"JS",41:"DEBUGGER",42:"UNDEFINED",43:"NULL",44:"BOOL",46:"=",49:":",52:"RETURN",53:"HERECOMMENT",54:"PARAM_START",56:"PARAM_END",58:"->",59:"=>",61:",",64:"...",73:".",74:"?.",75:"::",76:"?::",78:"INDEX_START",80:"INDEX_END",81:"INDEX_SOAK",83:"{",85:"}",86:"CLASS",87:"EXTENDS",90:"SUPER",91:"FUNC_EXIST",92:"CALL_START",93:"CALL_END",95:"THIS",96:"@",97:"[",98:"]",100:"..",103:"TRY",105:"FINALLY",106:"CATCH",107:"THROW",108:"(",109:")",111:"WHILE",112:"WHEN",113:"UNTIL",115:"LOOP",117:"FOR",118:"BY",122:"OWN",124:"FORIN",125:"FOROF",126:"SWITCH",128:"ELSE",130:"LEADING_WHEN",132:"IF",133:"POST_IF",134:"UNARY",135:"UNARY_MATH",136:"-",137:"+",138:"YIELD",139:"FROM",140:"--",141:"++",142:"?",143:"MATH",144:"**",145:"SHIFT",146:"COMPARE",147:"LOGIC",148:"RELATION",149:"COMPOUND_ASSIGN"},
	productions_: [0,[3,0],[3,1],[4,1],[4,3],[4,2],[5,1],[5,1],[8,1],[8,1],[8,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[24,2],[24,3],[27,1],[29,1],[29,1],[31,1],[31,3],[35,1],[35,3],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[39,1],[16,3],[16,4],[16,5],[47,1],[47,3],[47,5],[47,3],[47,5],[47,1],[50,1],[50,1],[48,1],[48,1],[9,2],[9,1],[10,1],[14,5],[14,2],[57,1],[57,1],[60,0],[60,1],[55,0],[55,1],[55,3],[55,4],[55,6],[62,1],[62,2],[62,3],[62,1],[63,1],[63,1],[63,1],[63,1],[67,2],[68,1],[68,2],[68,2],[68,1],[45,1],[45,1],[45,1],[12,1],[12,1],[12,1],[12,1],[12,1],[69,2],[69,2],[69,2],[69,2],[69,1],[69,1],[77,3],[77,2],[79,1],[79,1],[66,4],[84,0],[84,1],[84,3],[84,4],[84,6],[22,1],[22,2],[22,3],[22,4],[22,2],[22,3],[22,4],[22,5],[13,3],[13,3],[13,1],[13,2],[88,0],[88,1],[89,2],[89,4],[72,1],[72,1],[51,2],[65,2],[65,4],[99,1],[99,1],[71,5],[82,3],[82,2],[82,2],[82,1],[94,1],[94,3],[94,4],[94,4],[94,6],[101,1],[101,1],[101,1],[102,1],[102,3],[18,2],[18,3],[18,4],[18,5],[104,3],[104,3],[104,2],[23,2],[70,3],[70,5],[110,2],[110,4],[110,2],[110,4],[19,2],[19,2],[19,2],[19,1],[114,2],[114,2],[20,2],[20,2],[20,2],[116,2],[116,4],[116,2],[119,2],[119,3],[123,1],[123,1],[123,1],[123,1],[121,1],[121,3],[120,2],[120,2],[120,4],[120,4],[120,4],[120,6],[120,6],[21,5],[21,7],[21,4],[21,6],[127,1],[127,2],[129,3],[129,4],[131,3],[131,5],[17,1],[17,3],[17,3],[17,3],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,3],[15,2],[15,2],[15,2],[15,2],[15,2],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,5],[15,4],[15,3]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
	/* this == yyval */

	var $0 = $$.length - 1;
	switch (yystate) {
	case 1:
	return this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Block);
	break;
	case 2:
	return this.$ = $$[$0];
	break;
	case 3:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(yy.Block.wrap([$$[$0]]));
	break;
	case 4:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].push($$[$0]));
	break;
	case 5:
	this.$ = $$[$0-1];
	break;
	case 6: case 7: case 8: case 9: case 11: case 12: case 13: case 14: case 15: case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 27: case 32: case 34: case 47: case 48: case 49: case 50: case 51: case 59: case 60: case 70: case 71: case 72: case 73: case 78: case 79: case 82: case 86: case 92: case 136: case 137: case 139: case 169: case 170: case 186: case 192:
	this.$ = $$[$0];
	break;
	case 10: case 25: case 26: case 28: case 30: case 33: case 35:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Literal($$[$0]));
	break;
	case 23:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Block);
	break;
	case 24: case 31: case 93:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-1]);
	break;
	case 29: case 149:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Parens($$[$0-1]));
	break;
	case 36:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Undefined);
	break;
	case 37:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Null);
	break;
	case 38:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Bool($$[$0]));
	break;
	case 39:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign($$[$0-2], $$[$0]));
	break;
	case 40:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Assign($$[$0-3], $$[$0]));
	break;
	case 41:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign($$[$0-4], $$[$0-1]));
	break;
	case 42: case 75: case 80: case 81: case 83: case 84: case 85: case 171: case 172:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Value($$[$0]));
	break;
	case 43:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-2])(new yy.Value($$[$0-2])), $$[$0], 'object', {
	          operatorToken: yy.addLocationDataFn(_$[$0-1])(new yy.Literal($$[$0-1]))
	        }));
	break;
	case 44:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-4])(new yy.Value($$[$0-4])), $$[$0-1], 'object', {
	          operatorToken: yy.addLocationDataFn(_$[$0-3])(new yy.Literal($$[$0-3]))
	        }));
	break;
	case 45:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-2])(new yy.Value($$[$0-2])), $$[$0], null, {
	          operatorToken: yy.addLocationDataFn(_$[$0-1])(new yy.Literal($$[$0-1]))
	        }));
	break;
	case 46:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign(yy.addLocationDataFn(_$[$0-4])(new yy.Value($$[$0-4])), $$[$0-1], null, {
	          operatorToken: yy.addLocationDataFn(_$[$0-3])(new yy.Literal($$[$0-3]))
	        }));
	break;
	case 52:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Return($$[$0]));
	break;
	case 53:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Return);
	break;
	case 54:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Comment($$[$0]));
	break;
	case 55:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Code($$[$0-3], $$[$0], $$[$0-1]));
	break;
	case 56:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Code([], $$[$0], $$[$0-1]));
	break;
	case 57:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('func');
	break;
	case 58:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('boundfunc');
	break;
	case 61: case 98:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])([]);
	break;
	case 62: case 99: case 131: case 173:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])([$$[$0]]);
	break;
	case 63: case 100: case 132:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].concat($$[$0]));
	break;
	case 64: case 101: case 133:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])($$[$0-3].concat($$[$0]));
	break;
	case 65: case 102: case 135:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])($$[$0-5].concat($$[$0-2]));
	break;
	case 66:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Param($$[$0]));
	break;
	case 67:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Param($$[$0-1], null, true));
	break;
	case 68:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Param($$[$0-2], $$[$0]));
	break;
	case 69: case 138:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Expansion);
	break;
	case 74:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Splat($$[$0-1]));
	break;
	case 76:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].add($$[$0]));
	break;
	case 77:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Value($$[$0-1], [].concat($$[$0])));
	break;
	case 87:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Access($$[$0]));
	break;
	case 88:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Access($$[$0], 'soak'));
	break;
	case 89:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Access(new yy.Literal('prototype'))), yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))]);
	break;
	case 90:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Access(new yy.Literal('prototype'), 'soak')), yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))]);
	break;
	case 91:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Access(new yy.Literal('prototype')));
	break;
	case 94:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(yy.extend($$[$0], {
	          soak: true
	        }));
	break;
	case 95:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Index($$[$0]));
	break;
	case 96:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Slice($$[$0]));
	break;
	case 97:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Obj($$[$0-2], $$[$0-3].generated));
	break;
	case 103:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Class);
	break;
	case 104:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Class(null, null, $$[$0]));
	break;
	case 105:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Class(null, $$[$0]));
	break;
	case 106:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Class(null, $$[$0-1], $$[$0]));
	break;
	case 107:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Class($$[$0]));
	break;
	case 108:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Class($$[$0-1], null, $$[$0]));
	break;
	case 109:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Class($$[$0-2], $$[$0]));
	break;
	case 110:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Class($$[$0-3], $$[$0-1], $$[$0]));
	break;
	case 111: case 112:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Call($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 113:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Call('super', [new yy.Splat(new yy.Literal('arguments'))]));
	break;
	case 114:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Call('super', $$[$0]));
	break;
	case 115:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(false);
	break;
	case 116:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(true);
	break;
	case 117:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([]);
	break;
	case 118: case 134:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])($$[$0-2]);
	break;
	case 119: case 120:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Value(new yy.Literal('this')));
	break;
	case 121:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Value(yy.addLocationDataFn(_$[$0-1])(new yy.Literal('this')), [yy.addLocationDataFn(_$[$0])(new yy.Access($$[$0]))], 'this'));
	break;
	case 122:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Arr([]));
	break;
	case 123:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Arr($$[$0-2]));
	break;
	case 124:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('inclusive');
	break;
	case 125:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])('exclusive');
	break;
	case 126:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Range($$[$0-3], $$[$0-1], $$[$0-2]));
	break;
	case 127:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Range($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 128:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Range($$[$0-1], null, $$[$0]));
	break;
	case 129:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Range(null, $$[$0], $$[$0-1]));
	break;
	case 130:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])(new yy.Range(null, null, $$[$0]));
	break;
	case 140:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([].concat($$[$0-2], $$[$0]));
	break;
	case 141:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Try($$[$0]));
	break;
	case 142:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Try($$[$0-1], $$[$0][0], $$[$0][1]));
	break;
	case 143:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Try($$[$0-2], null, null, $$[$0]));
	break;
	case 144:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Try($$[$0-3], $$[$0-2][0], $$[$0-2][1], $$[$0]));
	break;
	case 145:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([$$[$0-1], $$[$0]]);
	break;
	case 146:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([yy.addLocationDataFn(_$[$0-1])(new yy.Value($$[$0-1])), $$[$0]]);
	break;
	case 147:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])([null, $$[$0]]);
	break;
	case 148:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Throw($$[$0]));
	break;
	case 150:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Parens($$[$0-2]));
	break;
	case 151:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While($$[$0]));
	break;
	case 152:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.While($$[$0-2], {
	          guard: $$[$0]
	        }));
	break;
	case 153:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While($$[$0], {
	          invert: true
	        }));
	break;
	case 154:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.While($$[$0-2], {
	          invert: true,
	          guard: $$[$0]
	        }));
	break;
	case 155:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].addBody($$[$0]));
	break;
	case 156: case 157:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0].addBody(yy.addLocationDataFn(_$[$0-1])(yy.Block.wrap([$$[$0-1]]))));
	break;
	case 158:
	this.$ = yy.addLocationDataFn(_$[$0], _$[$0])($$[$0]);
	break;
	case 159:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While(yy.addLocationDataFn(_$[$0-1])(new yy.Literal('true'))).addBody($$[$0]));
	break;
	case 160:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.While(yy.addLocationDataFn(_$[$0-1])(new yy.Literal('true'))).addBody(yy.addLocationDataFn(_$[$0])(yy.Block.wrap([$$[$0]]))));
	break;
	case 161: case 162:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.For($$[$0-1], $$[$0]));
	break;
	case 163:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.For($$[$0], $$[$0-1]));
	break;
	case 164:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: yy.addLocationDataFn(_$[$0])(new yy.Value($$[$0]))
	        });
	break;
	case 165:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: yy.addLocationDataFn(_$[$0-2])(new yy.Value($$[$0-2])),
	          step: $$[$0]
	        });
	break;
	case 166:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])((function () {
	        $$[$0].own = $$[$0-1].own;
	        $$[$0].name = $$[$0-1][0];
	        $$[$0].index = $$[$0-1][1];
	        return $$[$0];
	      }()));
	break;
	case 167:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0]);
	break;
	case 168:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])((function () {
	        $$[$0].own = true;
	        return $$[$0];
	      }()));
	break;
	case 174:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([$$[$0-2], $$[$0]]);
	break;
	case 175:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: $$[$0]
	        });
	break;
	case 176:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])({
	          source: $$[$0],
	          object: true
	        });
	break;
	case 177:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          guard: $$[$0]
	        });
	break;
	case 178:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          guard: $$[$0],
	          object: true
	        });
	break;
	case 179:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])({
	          source: $$[$0-2],
	          step: $$[$0]
	        });
	break;
	case 180:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])({
	          source: $$[$0-4],
	          guard: $$[$0-2],
	          step: $$[$0]
	        });
	break;
	case 181:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])({
	          source: $$[$0-4],
	          step: $$[$0-2],
	          guard: $$[$0]
	        });
	break;
	case 182:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Switch($$[$0-3], $$[$0-1]));
	break;
	case 183:
	this.$ = yy.addLocationDataFn(_$[$0-6], _$[$0])(new yy.Switch($$[$0-5], $$[$0-3], $$[$0-1]));
	break;
	case 184:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Switch(null, $$[$0-1]));
	break;
	case 185:
	this.$ = yy.addLocationDataFn(_$[$0-5], _$[$0])(new yy.Switch(null, $$[$0-3], $$[$0-1]));
	break;
	case 187:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])($$[$0-1].concat($$[$0]));
	break;
	case 188:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])([[$$[$0-1], $$[$0]]]);
	break;
	case 189:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])([[$$[$0-2], $$[$0-1]]]);
	break;
	case 190:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0-1], $$[$0], {
	          type: $$[$0-2]
	        }));
	break;
	case 191:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])($$[$0-4].addElse(yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0-1], $$[$0], {
	          type: $$[$0-2]
	        }))));
	break;
	case 193:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])($$[$0-2].addElse($$[$0]));
	break;
	case 194: case 195:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.If($$[$0], yy.addLocationDataFn(_$[$0-2])(yy.Block.wrap([$$[$0-2]])), {
	          type: $$[$0-1],
	          statement: true
	        }));
	break;
	case 196: case 197: case 200: case 201:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op($$[$0-1], $$[$0]));
	break;
	case 198:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('-', $$[$0]));
	break;
	case 199:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('+', $$[$0]));
	break;
	case 202:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op($$[$0-2].concat($$[$0-1]), $$[$0]));
	break;
	case 203:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('--', $$[$0]));
	break;
	case 204:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('++', $$[$0]));
	break;
	case 205:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('--', $$[$0-1], null, true));
	break;
	case 206:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Op('++', $$[$0-1], null, true));
	break;
	case 207:
	this.$ = yy.addLocationDataFn(_$[$0-1], _$[$0])(new yy.Existence($$[$0-1]));
	break;
	case 208:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op('+', $$[$0-2], $$[$0]));
	break;
	case 209:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op('-', $$[$0-2], $$[$0]));
	break;
	case 210: case 211: case 212: case 213: case 214:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Op($$[$0-1], $$[$0-2], $$[$0]));
	break;
	case 215:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])((function () {
	        if ($$[$0-1].charAt(0) === '!') {
	          return new yy.Op($$[$0-1].slice(1), $$[$0-2], $$[$0]).invert();
	        } else {
	          return new yy.Op($$[$0-1], $$[$0-2], $$[$0]);
	        }
	      }()));
	break;
	case 216:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Assign($$[$0-2], $$[$0], $$[$0-1]));
	break;
	case 217:
	this.$ = yy.addLocationDataFn(_$[$0-4], _$[$0])(new yy.Assign($$[$0-4], $$[$0-1], $$[$0-3]));
	break;
	case 218:
	this.$ = yy.addLocationDataFn(_$[$0-3], _$[$0])(new yy.Assign($$[$0-3], $$[$0], $$[$0-2]));
	break;
	case 219:
	this.$ = yy.addLocationDataFn(_$[$0-2], _$[$0])(new yy.Extends($$[$0-2], $$[$0]));
	break;
	}
	},
	table: [{1:[2,1],3:1,4:2,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{1:[3]},{1:[2,2],6:$VD},o($VE,[2,3]),o($VE,[2,6],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($VE,[2,7],{119:69,110:92,116:93,111:$Vq,113:$Vr,117:$Vt,133:$VP}),o($VQ,[2,11],{88:94,69:95,77:101,73:$VR,74:$VS,75:$VT,76:$VU,78:$VV,81:$VW,91:$VX,92:$VY}),o($VQ,[2,12],{77:101,88:104,69:105,73:$VR,74:$VS,75:$VT,76:$VU,78:$VV,81:$VW,91:$VX,92:$VY}),o($VQ,[2,13]),o($VQ,[2,14]),o($VQ,[2,15]),o($VQ,[2,16]),o($VQ,[2,17]),o($VQ,[2,18]),o($VQ,[2,19]),o($VQ,[2,20]),o($VQ,[2,21]),o($VQ,[2,22]),o($VQ,[2,8]),o($VQ,[2,9]),o($VQ,[2,10]),o($VZ,$V_,{46:[1,106]}),o($VZ,[2,83]),o($VZ,[2,84]),o($VZ,[2,85]),o($VZ,[2,86]),o([1,6,25,26,34,38,56,61,64,73,74,75,76,78,80,81,85,91,93,98,100,109,111,112,113,117,118,133,136,137,142,143,144,145,146,147,148],[2,113],{89:107,92:$V$}),o([6,25,56,61],$V01,{55:109,62:110,63:111,27:113,51:114,65:115,66:116,28:$V1,64:$V11,83:$Vh,96:$V21,97:$V31}),{24:119,25:$V41},{7:121,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:123,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:124,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:125,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:127,8:126,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,139:[1,128],140:$VB,141:$VC},{12:130,13:131,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:132,51:63,65:47,66:48,68:129,70:23,71:24,72:25,83:$Vh,90:$Vj,95:$Vk,96:$Vl,97:$Vm,108:$Vp},{12:130,13:131,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:132,51:63,65:47,66:48,68:133,70:23,71:24,72:25,83:$Vh,90:$Vj,95:$Vk,96:$Vl,97:$Vm,108:$Vp},o($V51,$V61,{87:[1,137],140:[1,134],141:[1,135],149:[1,136]}),o($VQ,[2,192],{128:[1,138]}),{24:139,25:$V41},{24:140,25:$V41},o($VQ,[2,158]),{24:141,25:$V41},{7:142,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,143],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($V71,[2,103],{39:22,70:23,71:24,72:25,65:47,66:48,29:49,35:51,27:62,51:63,31:72,12:130,13:131,45:132,24:144,68:146,25:$V41,28:$V1,30:$V2,32:$V3,33:$V4,36:$V5,37:$V6,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,83:$Vh,87:[1,145],90:$Vj,95:$Vk,96:$Vl,97:$Vm,108:$Vp}),{7:147,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,142,143,144,145,146,147,148],[2,53],{12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,70:23,71:24,72:25,57:28,68:36,131:37,110:39,114:40,116:41,65:47,66:48,29:49,35:51,27:62,51:63,119:69,31:72,8:122,7:148,11:$V0,28:$V1,30:$V2,32:$V3,33:$V4,36:$V5,37:$V6,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,52:$Vc,53:$Vd,54:$Ve,58:$Vf,59:$Vg,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,115:$Vs,126:$Vu,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC}),o($VQ,[2,54]),o($V51,[2,80]),o($V51,[2,81]),o($VZ,[2,32]),o($VZ,[2,33]),o($VZ,[2,34]),o($VZ,[2,35]),o($VZ,[2,36]),o($VZ,[2,37]),o($VZ,[2,38]),{4:149,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,150],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:151,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,64:$V91,65:47,66:48,67:156,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,94:153,95:$Vk,96:$Vl,97:$Vm,98:$Va1,101:154,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VZ,[2,119]),o($VZ,[2,120],{27:158,28:$V1}),{25:[2,57]},{25:[2,58]},o($Vb1,[2,75]),o($Vb1,[2,78]),{7:159,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:160,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:161,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:163,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:162,25:$V41,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{27:168,28:$V1,51:169,65:170,66:171,71:164,83:$Vh,96:$V21,97:$Vm,121:165,122:[1,166],123:167},{120:172,124:[1,173],125:[1,174]},o([6,25,61,85],$Vc1,{31:72,84:175,47:176,48:177,50:178,10:179,29:180,27:181,51:182,28:$V1,30:$V2,32:$V3,33:$V4,53:$Vd,96:$V21}),o($Vd1,[2,26]),o($Vd1,[2,27]),o($VZ,[2,30]),{12:130,13:183,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:132,51:63,65:47,66:48,68:184,70:23,71:24,72:25,83:$Vh,90:$Vj,95:$Vk,96:$Vl,97:$Vm,108:$Vp},o($Ve1,[2,25]),o($Vd1,[2,28]),{4:185,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VE,[2,5],{7:4,8:5,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,70:23,71:24,72:25,57:28,68:36,131:37,110:39,114:40,116:41,65:47,66:48,29:49,35:51,27:62,51:63,119:69,31:72,5:186,11:$V0,28:$V1,30:$V2,32:$V3,33:$V4,36:$V5,37:$V6,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,52:$Vc,53:$Vd,54:$Ve,58:$Vf,59:$Vg,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,111:$Vq,113:$Vr,115:$Vs,117:$Vt,126:$Vu,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC}),o($VQ,[2,207]),{7:187,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:188,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:189,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:190,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:191,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:192,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:193,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:194,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:195,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VQ,[2,157]),o($VQ,[2,162]),{7:196,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VQ,[2,156]),o($VQ,[2,161]),{89:197,92:$V$},o($Vb1,[2,76]),{92:[2,116]},{27:198,28:$V1},{27:199,28:$V1},o($Vb1,[2,91],{27:200,28:$V1}),{27:201,28:$V1},o($Vb1,[2,92]),{7:203,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,64:$Vf1,65:47,66:48,68:36,70:23,71:24,72:25,79:202,82:204,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,99:205,100:$Vg1,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{77:208,78:$VV,81:$VW},{89:209,92:$V$},o($Vb1,[2,77]),{6:[1,211],7:210,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,212],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($Vh1,[2,114]),{7:215,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,64:$V91,65:47,66:48,67:156,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,93:[1,213],94:214,95:$Vk,96:$Vl,97:$Vm,101:154,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o([6,25],$Vi1,{60:218,56:[1,216],61:$Vj1}),o($Vk1,[2,62]),o($Vk1,[2,66],{46:[1,220],64:[1,219]}),o($Vk1,[2,69]),o($Vl1,[2,70]),o($Vl1,[2,71]),o($Vl1,[2,72]),o($Vl1,[2,73]),{27:158,28:$V1},{7:215,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,64:$V91,65:47,66:48,67:156,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,94:153,95:$Vk,96:$Vl,97:$Vm,98:$Va1,101:154,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VQ,[2,56]),{4:222,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[1,221],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,136,137,143,144,145,146,147,148],[2,196],{119:69,110:89,116:90,142:$VI}),{110:92,111:$Vq,113:$Vr,116:93,117:$Vt,119:69,133:$VP},o($Vm1,[2,197],{119:69,110:89,116:90,142:$VI,144:$VK}),o($Vm1,[2,198],{119:69,110:89,116:90,142:$VI,144:$VK}),o($Vm1,[2,199],{119:69,110:89,116:90,142:$VI,144:$VK}),o($VQ,[2,200],{119:69,110:92,116:93}),o($Vn1,[2,201],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{7:223,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VQ,[2,203],{73:$V61,74:$V61,75:$V61,76:$V61,78:$V61,81:$V61,91:$V61,92:$V61}),{69:95,73:$VR,74:$VS,75:$VT,76:$VU,77:101,78:$VV,81:$VW,88:94,91:$VX,92:$VY},{69:105,73:$VR,74:$VS,75:$VT,76:$VU,77:101,78:$VV,81:$VW,88:104,91:$VX,92:$VY},o($Vo1,$V_),o($VQ,[2,204],{73:$V61,74:$V61,75:$V61,76:$V61,78:$V61,81:$V61,91:$V61,92:$V61}),o($VQ,[2,205]),o($VQ,[2,206]),{6:[1,226],7:224,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,225],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:227,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{24:228,25:$V41,132:[1,229]},o($VQ,[2,141],{104:230,105:[1,231],106:[1,232]}),o($VQ,[2,155]),o($VQ,[2,163]),{25:[1,233],110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},{127:234,129:235,130:$Vp1},o($VQ,[2,104]),{7:237,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($V71,[2,107],{24:238,25:$V41,73:$V61,74:$V61,75:$V61,76:$V61,78:$V61,81:$V61,91:$V61,92:$V61,87:[1,239]}),o($Vn1,[2,148],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vn1,[2,52],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{6:$VD,109:[1,240]},{4:241,5:3,7:4,8:5,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o([6,25,61,98],$Vq1,{119:69,110:89,116:90,99:242,64:[1,243],100:$Vg1,111:$Vq,113:$Vr,117:$Vt,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vr1,[2,122]),o([6,25,98],$Vi1,{60:244,61:$Vs1}),o($Vt1,[2,131]),{7:215,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,64:$V91,65:47,66:48,67:156,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,94:246,95:$Vk,96:$Vl,97:$Vm,101:154,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($Vt1,[2,137]),o($Vt1,[2,138]),o($Ve1,[2,121]),{24:247,25:$V41,110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},o($Vu1,[2,151],{119:69,110:89,116:90,111:$Vq,112:[1,248],113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vu1,[2,153],{119:69,110:89,116:90,111:$Vq,112:[1,249],113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($VQ,[2,159]),o($Vv1,[2,160],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,133,136,137,142,143,144,145,146,147,148],[2,164],{118:[1,250]}),o($Vw1,[2,167]),{27:168,28:$V1,51:169,65:170,66:171,83:$Vh,96:$V21,97:$V31,121:251,123:167},o($Vw1,[2,173],{61:[1,252]}),o($Vx1,[2,169]),o($Vx1,[2,170]),o($Vx1,[2,171]),o($Vx1,[2,172]),o($VQ,[2,166]),{7:253,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:254,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o([6,25,85],$Vi1,{60:255,61:$Vy1}),o($Vz1,[2,99]),o($Vz1,[2,42],{49:[1,257]}),o($VA1,[2,50],{46:[1,258]}),o($Vz1,[2,47]),o($VA1,[2,51]),o($VB1,[2,48]),o($VB1,[2,49]),{38:[1,259],69:105,73:$VR,74:$VS,75:$VT,76:$VU,77:101,78:$VV,81:$VW,88:104,91:$VX,92:$VY},o($Vo1,$V61),{6:$VD,34:[1,260]},o($VE,[2,4]),o($VC1,[2,208],{119:69,110:89,116:90,142:$VI,143:$VJ,144:$VK}),o($VC1,[2,209],{119:69,110:89,116:90,142:$VI,143:$VJ,144:$VK}),o($Vm1,[2,210],{119:69,110:89,116:90,142:$VI,144:$VK}),o($Vm1,[2,211],{119:69,110:89,116:90,142:$VI,144:$VK}),o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,145,146,147,148],[2,212],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK}),o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,146,147],[2,213],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,148:$VO}),o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,147],[2,214],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,148:$VO}),o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,118,133,146,147,148],[2,215],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL}),o($Vv1,[2,195],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vv1,[2,194],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vh1,[2,111]),o($Vb1,[2,87]),o($Vb1,[2,88]),o($Vb1,[2,89]),o($Vb1,[2,90]),{80:[1,261]},{64:$Vf1,80:[2,95],99:262,100:$Vg1,110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},{80:[2,96]},{7:263,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,80:[2,130],83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VD1,[2,124]),o($VD1,$VE1),o($Vb1,[2,94]),o($Vh1,[2,112]),o($Vn1,[2,39],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{7:264,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:265,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($Vh1,[2,117]),o([6,25,93],$Vi1,{60:266,61:$Vs1}),o($Vt1,$Vq1,{119:69,110:89,116:90,64:[1,267],111:$Vq,113:$Vr,117:$Vt,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{57:268,58:$Vf,59:$Vg},o($VF1,$VG1,{63:111,27:113,51:114,65:115,66:116,62:269,28:$V1,64:$V11,83:$Vh,96:$V21,97:$V31}),{6:$VH1,25:$VI1},o($Vk1,[2,67]),{7:272,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VJ1,[2,23]),{6:$VD,26:[1,273]},o($Vn1,[2,202],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vn1,[2,216],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{7:274,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:275,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($Vn1,[2,219],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($VQ,[2,193]),{7:276,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VQ,[2,142],{105:[1,277]}),{24:278,25:$V41},{24:281,25:$V41,27:279,28:$V1,66:280,83:$Vh},{127:282,129:235,130:$Vp1},{26:[1,283],128:[1,284],129:285,130:$Vp1},o($VK1,[2,186]),{7:287,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,102:286,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VL1,[2,105],{119:69,110:89,116:90,24:288,25:$V41,111:$Vq,113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($VQ,[2,108]),{7:289,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VZ,[2,149]),{6:$VD,26:[1,290]},{7:291,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o([11,28,30,32,33,36,37,40,41,42,43,44,52,53,54,58,59,83,86,90,95,96,97,103,107,108,111,113,115,117,126,132,134,135,136,137,138,140,141],$VE1,{6:$VM1,25:$VM1,61:$VM1,98:$VM1}),{6:$VN1,25:$VO1,98:[1,292]},o([6,25,26,93,98],$VG1,{12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,9:18,10:19,45:21,39:22,70:23,71:24,72:25,57:28,68:36,131:37,110:39,114:40,116:41,65:47,66:48,29:49,35:51,27:62,51:63,119:69,31:72,8:122,67:156,7:215,101:295,11:$V0,28:$V1,30:$V2,32:$V3,33:$V4,36:$V5,37:$V6,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,52:$Vc,53:$Vd,54:$Ve,58:$Vf,59:$Vg,64:$V91,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,111:$Vq,113:$Vr,115:$Vs,117:$Vt,126:$Vu,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC}),o($VF1,$Vi1,{60:296,61:$Vs1}),o($VP1,[2,190]),{7:297,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:298,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:299,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($Vw1,[2,168]),{27:168,28:$V1,51:169,65:170,66:171,83:$Vh,96:$V21,97:$V31,123:300},o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,113,117,133],[2,175],{119:69,110:89,116:90,112:[1,301],118:[1,302],136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($VQ1,[2,176],{119:69,110:89,116:90,112:[1,303],136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{6:$VR1,25:$VS1,85:[1,304]},o([6,25,26,85],$VG1,{31:72,48:177,50:178,10:179,29:180,27:181,51:182,47:307,28:$V1,30:$V2,32:$V3,33:$V4,53:$Vd,96:$V21}),{7:308,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,309],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:310,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,311],27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VZ,[2,31]),o($Vd1,[2,29]),o($Vb1,[2,93]),{7:312,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,80:[2,128],83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{80:[2,129],110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},o($Vn1,[2,40],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{26:[1,313],110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},{6:$VN1,25:$VO1,93:[1,314]},o($Vt1,$VM1),{24:315,25:$V41},o($Vk1,[2,63]),{27:113,28:$V1,51:114,62:316,63:111,64:$V11,65:115,66:116,83:$Vh,96:$V21,97:$V31},o($VT1,$V01,{62:110,63:111,27:113,51:114,65:115,66:116,55:317,28:$V1,64:$V11,83:$Vh,96:$V21,97:$V31}),o($Vk1,[2,68],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($VJ1,[2,24]),{26:[1,318],110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},o($Vn1,[2,218],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{24:319,25:$V41,110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},{24:320,25:$V41},o($VQ,[2,143]),{24:321,25:$V41},{24:322,25:$V41},o($VU1,[2,147]),{26:[1,323],128:[1,324],129:285,130:$Vp1},o($VQ,[2,184]),{24:325,25:$V41},o($VK1,[2,187]),{24:326,25:$V41,61:[1,327]},o($VV1,[2,139],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($VQ,[2,106]),o($VL1,[2,109],{119:69,110:89,116:90,24:328,25:$V41,111:$Vq,113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{109:[1,329]},{98:[1,330],110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},o($Vr1,[2,123]),{7:215,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,64:$V91,65:47,66:48,67:156,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,101:331,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:215,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:$V81,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,64:$V91,65:47,66:48,67:156,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,94:332,95:$Vk,96:$Vl,97:$Vm,101:154,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($Vt1,[2,132]),{6:$VN1,25:$VO1,26:[1,333]},o($Vv1,[2,152],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vv1,[2,154],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vv1,[2,165],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vw1,[2,174]),{7:334,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:335,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:336,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($Vr1,[2,97]),{10:179,27:181,28:$V1,29:180,30:$V2,31:72,32:$V3,33:$V4,47:337,48:177,50:178,51:182,53:$Vd,96:$V21},o($VT1,$Vc1,{31:72,47:176,48:177,50:178,10:179,29:180,27:181,51:182,84:338,28:$V1,30:$V2,32:$V3,33:$V4,53:$Vd,96:$V21}),o($Vz1,[2,100]),o($Vz1,[2,43],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{7:339,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($Vz1,[2,45],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{7:340,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{80:[2,127],110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},o($VQ,[2,41]),o($Vh1,[2,118]),o($VQ,[2,55]),o($Vk1,[2,64]),o($VF1,$Vi1,{60:341,61:$Vj1}),o($VQ,[2,217]),o($VP1,[2,191]),o($VQ,[2,144]),o($VU1,[2,145]),o($VU1,[2,146]),o($VQ,[2,182]),{24:342,25:$V41},{26:[1,343]},o($VK1,[2,188],{6:[1,344]}),{7:345,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},o($VQ,[2,110]),o($VZ,[2,150]),o($VZ,[2,126]),o($Vt1,[2,133]),o($VF1,$Vi1,{60:346,61:$Vs1}),o($Vt1,[2,134]),o([1,6,25,26,34,56,61,64,80,85,93,98,100,109,111,112,113,117,133],[2,177],{119:69,110:89,116:90,118:[1,347],136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($VQ1,[2,179],{119:69,110:89,116:90,112:[1,348],136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vn1,[2,178],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vz1,[2,101]),o($VF1,$Vi1,{60:349,61:$Vy1}),{26:[1,350],110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},{26:[1,351],110:89,111:$Vq,113:$Vr,116:90,117:$Vt,119:69,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO},{6:$VH1,25:$VI1,26:[1,352]},{26:[1,353]},o($VQ,[2,185]),o($VK1,[2,189]),o($VV1,[2,140],{119:69,110:89,116:90,111:$Vq,113:$Vr,117:$Vt,133:$VF,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),{6:$VN1,25:$VO1,26:[1,354]},{7:355,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{7:356,8:122,9:18,10:19,11:$V0,12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:62,28:$V1,29:49,30:$V2,31:72,32:$V3,33:$V4,35:51,36:$V5,37:$V6,39:22,40:$V7,41:$V8,42:$V9,43:$Va,44:$Vb,45:21,51:63,52:$Vc,53:$Vd,54:$Ve,57:28,58:$Vf,59:$Vg,65:47,66:48,68:36,70:23,71:24,72:25,83:$Vh,86:$Vi,90:$Vj,95:$Vk,96:$Vl,97:$Vm,103:$Vn,107:$Vo,108:$Vp,110:39,111:$Vq,113:$Vr,114:40,115:$Vs,116:41,117:$Vt,119:69,126:$Vu,131:37,132:$Vv,134:$Vw,135:$Vx,136:$Vy,137:$Vz,138:$VA,140:$VB,141:$VC},{6:$VR1,25:$VS1,26:[1,357]},o($Vz1,[2,44]),o($Vz1,[2,46]),o($Vk1,[2,65]),o($VQ,[2,183]),o($Vt1,[2,135]),o($Vn1,[2,180],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vn1,[2,181],{119:69,110:89,116:90,136:$VG,137:$VH,142:$VI,143:$VJ,144:$VK,145:$VL,146:$VM,147:$VN,148:$VO}),o($Vz1,[2,102])],
	defaultActions: {60:[2,57],61:[2,58],96:[2,116],204:[2,96]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        throw new Error(str);
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    var args = lstack.slice.call(arguments, 1);
	    var lexer = Object.create(this.lexer);
	    var sharedState = { yy: {} };
	    for (var k in this.yy) {
	        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
	            sharedState.yy[k] = this.yy[k];
	        }
	    }
	    lexer.setInput(input, sharedState.yy);
	    sharedState.yy.lexer = lexer;
	    sharedState.yy.parser = this;
	    if (typeof lexer.yylloc == 'undefined') {
	        lexer.yylloc = {};
	    }
	    var yyloc = lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = lexer.options && lexer.options.ranges;
	    if (typeof sharedState.yy.parseError === 'function') {
	        this.parseError = sharedState.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }
	    _token_stack:
	        function lex() {
	            var token;
	            token = lexer.lex() || EOF;
	            if (typeof token !== 'number') {
	                token = self.symbols_[token] || token;
	            }
	            return token;
	        }
	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(lexer.yytext);
	            lstack.push(lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = lexer.yyleng;
	                yytext = lexer.yytext;
	                yylineno = lexer.yylineno;
	                yyloc = lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.apply(yyval, [
	                yytext,
	                yyleng,
	                yylineno,
	                sharedState.yy,
	                action[1],
	                vstack,
	                lstack
	            ].concat(args));
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};

	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();


	if (true) {
	exports.parser = parser;
	exports.Parser = parser.Parser;
	exports.parse = function () { return parser.parse.apply(parser, arguments); };
	exports.main = function commonjsMain(args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(__webpack_require__(5).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	};
	if (typeof module !== 'undefined' && __webpack_require__.c[0] === module) {
	  exports.main(process.argv.slice(1));
	}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(3)(module)))

/***/ },
/* 84 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var LineMap, SourceMap;

	  LineMap = (function() {
	    function LineMap(line1) {
	      this.line = line1;
	      this.columns = [];
	    }

	    LineMap.prototype.add = function(column, arg, options) {
	      var sourceColumn, sourceLine;
	      sourceLine = arg[0], sourceColumn = arg[1];
	      if (options == null) {
	        options = {};
	      }
	      if (this.columns[column] && options.noReplace) {
	        return;
	      }
	      return this.columns[column] = {
	        line: this.line,
	        column: column,
	        sourceLine: sourceLine,
	        sourceColumn: sourceColumn
	      };
	    };

	    LineMap.prototype.sourceLocation = function(column) {
	      var mapping;
	      while (!((mapping = this.columns[column]) || (column <= 0))) {
	        column--;
	      }
	      return mapping && [mapping.sourceLine, mapping.sourceColumn];
	    };

	    return LineMap;

	  })();

	  SourceMap = (function() {
	    var BASE64_CHARS, VLQ_CONTINUATION_BIT, VLQ_SHIFT, VLQ_VALUE_MASK;

	    function SourceMap() {
	      this.lines = [];
	    }

	    SourceMap.prototype.add = function(sourceLocation, generatedLocation, options) {
	      var base, column, line, lineMap;
	      if (options == null) {
	        options = {};
	      }
	      line = generatedLocation[0], column = generatedLocation[1];
	      lineMap = ((base = this.lines)[line] || (base[line] = new LineMap(line)));
	      return lineMap.add(column, sourceLocation, options);
	    };

	    SourceMap.prototype.sourceLocation = function(arg) {
	      var column, line, lineMap;
	      line = arg[0], column = arg[1];
	      while (!((lineMap = this.lines[line]) || (line <= 0))) {
	        line--;
	      }
	      return lineMap && lineMap.sourceLocation(column);
	    };

	    SourceMap.prototype.generate = function(options, code) {
	      var buffer, i, j, lastColumn, lastSourceColumn, lastSourceLine, len, len1, lineMap, lineNumber, mapping, needComma, ref, ref1, v3, writingline;
	      if (options == null) {
	        options = {};
	      }
	      if (code == null) {
	        code = null;
	      }
	      writingline = 0;
	      lastColumn = 0;
	      lastSourceLine = 0;
	      lastSourceColumn = 0;
	      needComma = false;
	      buffer = "";
	      ref = this.lines;
	      for (lineNumber = i = 0, len = ref.length; i < len; lineNumber = ++i) {
	        lineMap = ref[lineNumber];
	        if (lineMap) {
	          ref1 = lineMap.columns;
	          for (j = 0, len1 = ref1.length; j < len1; j++) {
	            mapping = ref1[j];
	            if (!(mapping)) {
	              continue;
	            }
	            while (writingline < mapping.line) {
	              lastColumn = 0;
	              needComma = false;
	              buffer += ";";
	              writingline++;
	            }
	            if (needComma) {
	              buffer += ",";
	              needComma = false;
	            }
	            buffer += this.encodeVlq(mapping.column - lastColumn);
	            lastColumn = mapping.column;
	            buffer += this.encodeVlq(0);
	            buffer += this.encodeVlq(mapping.sourceLine - lastSourceLine);
	            lastSourceLine = mapping.sourceLine;
	            buffer += this.encodeVlq(mapping.sourceColumn - lastSourceColumn);
	            lastSourceColumn = mapping.sourceColumn;
	            needComma = true;
	          }
	        }
	      }
	      v3 = {
	        version: 3,
	        file: options.generatedFile || '',
	        sourceRoot: options.sourceRoot || '',
	        sources: options.sourceFiles || [''],
	        names: [],
	        mappings: buffer
	      };
	      if (options.inline) {
	        v3.sourcesContent = [code];
	      }
	      return JSON.stringify(v3, null, 2);
	    };

	    VLQ_SHIFT = 5;

	    VLQ_CONTINUATION_BIT = 1 << VLQ_SHIFT;

	    VLQ_VALUE_MASK = VLQ_CONTINUATION_BIT - 1;

	    SourceMap.prototype.encodeVlq = function(value) {
	      var answer, nextChunk, signBit, valueToEncode;
	      answer = '';
	      signBit = value < 0 ? 1 : 0;
	      valueToEncode = (Math.abs(value) << 1) + signBit;
	      while (valueToEncode || !answer) {
	        nextChunk = valueToEncode & VLQ_VALUE_MASK;
	        valueToEncode = valueToEncode >> VLQ_SHIFT;
	        if (valueToEncode) {
	          nextChunk |= VLQ_CONTINUATION_BIT;
	        }
	        answer += this.encodeBase64(nextChunk);
	      }
	      return answer;
	    };

	    BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	    SourceMap.prototype.encodeBase64 = function(value) {
	      return BASE64_CHARS[value] || (function() {
	        throw new Error("Cannot Base64 encode value: " + value);
	      })();
	    };

	    return SourceMap;

	  })();

	  module.exports = SourceMap;

	}).call(this);


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./browser": 86,
		"./browser.js": 86,
		"./cake": 87,
		"./cake.js": 87,
		"./coffee-script": 77,
		"./coffee-script.js": 77,
		"./command": 89,
		"./command.js": 89,
		"./grammar": 93,
		"./grammar.js": 93,
		"./helpers": 82,
		"./helpers.js": 82,
		"./index": 94,
		"./index.js": 94,
		"./lexer": 80,
		"./lexer.js": 80,
		"./nodes": 91,
		"./nodes.js": 91,
		"./optparse": 88,
		"./optparse.js": 88,
		"./parser": 83,
		"./parser.js": 83,
		"./register": 95,
		"./register.js": 95,
		"./repl": 90,
		"./repl.js": 90,
		"./rewriter": 81,
		"./rewriter.js": 81,
		"./scope": 92,
		"./scope.js": 92,
		"./sourcemap": 84,
		"./sourcemap.js": 84
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 85;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var CoffeeScript, compile, runScripts,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  CoffeeScript = __webpack_require__(77);

	  CoffeeScript.require = __webpack_require__(85);

	  compile = CoffeeScript.compile;

	  CoffeeScript["eval"] = function(code, options) {
	    if (options == null) {
	      options = {};
	    }
	    if (options.bare == null) {
	      options.bare = true;
	    }
	    return eval(compile(code, options));
	  };

	  CoffeeScript.run = function(code, options) {
	    if (options == null) {
	      options = {};
	    }
	    options.bare = true;
	    options.shiftLine = true;
	    return Function(compile(code, options))();
	  };

	  if (typeof window === "undefined" || window === null) {
	    return;
	  }

	  if ((typeof btoa !== "undefined" && btoa !== null) && (typeof JSON !== "undefined" && JSON !== null) && (typeof unescape !== "undefined" && unescape !== null) && (typeof encodeURIComponent !== "undefined" && encodeURIComponent !== null)) {
	    compile = function(code, options) {
	      var js, ref, v3SourceMap;
	      if (options == null) {
	        options = {};
	      }
	      options.sourceMap = true;
	      options.inline = true;
	      ref = CoffeeScript.compile(code, options), js = ref.js, v3SourceMap = ref.v3SourceMap;
	      return js + "\n//# sourceMappingURL=data:application/json;base64," + (btoa(unescape(encodeURIComponent(v3SourceMap)))) + "\n//# sourceURL=coffeescript";
	    };
	  }

	  CoffeeScript.load = function(url, callback, options, hold) {
	    var xhr;
	    if (options == null) {
	      options = {};
	    }
	    if (hold == null) {
	      hold = false;
	    }
	    options.sourceFiles = [url];
	    xhr = window.ActiveXObject ? new window.ActiveXObject('Microsoft.XMLHTTP') : new window.XMLHttpRequest();
	    xhr.open('GET', url, true);
	    if ('overrideMimeType' in xhr) {
	      xhr.overrideMimeType('text/plain');
	    }
	    xhr.onreadystatechange = function() {
	      var param, ref;
	      if (xhr.readyState === 4) {
	        if ((ref = xhr.status) === 0 || ref === 200) {
	          param = [xhr.responseText, options];
	          if (!hold) {
	            CoffeeScript.run.apply(CoffeeScript, param);
	          }
	        } else {
	          throw new Error("Could not load " + url);
	        }
	        if (callback) {
	          return callback(param);
	        }
	      }
	    };
	    return xhr.send(null);
	  };

	  runScripts = function() {
	    var coffees, coffeetypes, execute, fn, i, index, j, len, s, script, scripts;
	    scripts = window.document.getElementsByTagName('script');
	    coffeetypes = ['text/coffeescript', 'text/literate-coffeescript'];
	    coffees = (function() {
	      var j, len, ref, results;
	      results = [];
	      for (j = 0, len = scripts.length; j < len; j++) {
	        s = scripts[j];
	        if (ref = s.type, indexOf.call(coffeetypes, ref) >= 0) {
	          results.push(s);
	        }
	      }
	      return results;
	    })();
	    index = 0;
	    execute = function() {
	      var param;
	      param = coffees[index];
	      if (param instanceof Array) {
	        CoffeeScript.run.apply(CoffeeScript, param);
	        index++;
	        return execute();
	      }
	    };
	    fn = function(script, i) {
	      var options, source;
	      options = {
	        literate: script.type === coffeetypes[1]
	      };
	      source = script.src || script.getAttribute('data-src');
	      if (source) {
	        return CoffeeScript.load(source, function(param) {
	          coffees[i] = param;
	          return execute();
	        }, options, true);
	      } else {
	        options.sourceFiles = ['embedded'];
	        return coffees[i] = [script.innerHTML, options];
	      }
	    };
	    for (i = j = 0, len = coffees.length; j < len; i = ++j) {
	      script = coffees[i];
	      fn(script, i);
	    }
	    return execute();
	  };

	  if (window.addEventListener) {
	    window.addEventListener('DOMContentLoaded', runScripts, false);
	  } else {
	    window.attachEvent('onload', runScripts);
	  }

	}).call(this);


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Generated by CoffeeScript 1.10.0
	(function() {
	  var CoffeeScript, cakefileDirectory, fatalError, fs, helpers, missingTask, oparse, options, optparse, path, printTasks, switches, tasks;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(5);

	  helpers = __webpack_require__(82);

	  optparse = __webpack_require__(88);

	  CoffeeScript = __webpack_require__(77);

	  CoffeeScript.register();

	  tasks = {};

	  options = {};

	  switches = [];

	  oparse = null;

	  helpers.extend(global, {
	    task: function(name, description, action) {
	      var ref;
	      if (!action) {
	        ref = [description, action], action = ref[0], description = ref[1];
	      }
	      return tasks[name] = {
	        name: name,
	        description: description,
	        action: action
	      };
	    },
	    option: function(letter, flag, description) {
	      return switches.push([letter, flag, description]);
	    },
	    invoke: function(name) {
	      if (!tasks[name]) {
	        missingTask(name);
	      }
	      return tasks[name].action(options);
	    }
	  });

	  exports.run = function() {
	    var arg, args, e, error, i, len, ref, results;
	    global.__originalDirname = fs.realpathSync('.');
	    process.chdir(cakefileDirectory(__originalDirname));
	    args = process.argv.slice(2);
	    CoffeeScript.run(fs.readFileSync('Cakefile').toString(), {
	      filename: 'Cakefile'
	    });
	    oparse = new optparse.OptionParser(switches);
	    if (!args.length) {
	      return printTasks();
	    }
	    try {
	      options = oparse.parse(args);
	    } catch (error) {
	      e = error;
	      return fatalError("" + e);
	    }
	    ref = options["arguments"];
	    results = [];
	    for (i = 0, len = ref.length; i < len; i++) {
	      arg = ref[i];
	      results.push(invoke(arg));
	    }
	    return results;
	  };

	  printTasks = function() {
	    var cakefilePath, desc, name, relative, spaces, task;
	    relative = path.relative || path.resolve;
	    cakefilePath = path.join(relative(__originalDirname, process.cwd()), 'Cakefile');
	    console.log(cakefilePath + " defines the following tasks:\n");
	    for (name in tasks) {
	      task = tasks[name];
	      spaces = 20 - name.length;
	      spaces = spaces > 0 ? Array(spaces + 1).join(' ') : '';
	      desc = task.description ? "# " + task.description : '';
	      console.log("cake " + name + spaces + " " + desc);
	    }
	    if (switches.length) {
	      return console.log(oparse.help());
	    }
	  };

	  fatalError = function(message) {
	    console.error(message + '\n');
	    console.log('To see a list of all tasks/options, run "cake"');
	    return process.exit(1);
	  };

	  missingTask = function(task) {
	    return fatalError("No such task: " + task);
	  };

	  cakefileDirectory = function(dir) {
	    var parent;
	    if (fs.existsSync(path.join(dir, 'Cakefile'))) {
	      return dir;
	    }
	    parent = path.normalize(path.join(dir, '..'));
	    if (parent !== dir) {
	      return cakefileDirectory(parent);
	    }
	    throw new Error("Cakefile not found in " + (process.cwd()));
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(1)))

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var LONG_FLAG, MULTI_FLAG, OPTIONAL, OptionParser, SHORT_FLAG, buildRule, buildRules, normalizeArguments, repeat;

	  repeat = __webpack_require__(82).repeat;

	  exports.OptionParser = OptionParser = (function() {
	    function OptionParser(rules, banner) {
	      this.banner = banner;
	      this.rules = buildRules(rules);
	    }

	    OptionParser.prototype.parse = function(args) {
	      var arg, i, isOption, j, k, len, len1, matchedRule, options, originalArgs, pos, ref, rule, seenNonOptionArg, skippingArgument, value;
	      options = {
	        "arguments": []
	      };
	      skippingArgument = false;
	      originalArgs = args;
	      args = normalizeArguments(args);
	      for (i = j = 0, len = args.length; j < len; i = ++j) {
	        arg = args[i];
	        if (skippingArgument) {
	          skippingArgument = false;
	          continue;
	        }
	        if (arg === '--') {
	          pos = originalArgs.indexOf('--');
	          options["arguments"] = options["arguments"].concat(originalArgs.slice(pos + 1));
	          break;
	        }
	        isOption = !!(arg.match(LONG_FLAG) || arg.match(SHORT_FLAG));
	        seenNonOptionArg = options["arguments"].length > 0;
	        if (!seenNonOptionArg) {
	          matchedRule = false;
	          ref = this.rules;
	          for (k = 0, len1 = ref.length; k < len1; k++) {
	            rule = ref[k];
	            if (rule.shortFlag === arg || rule.longFlag === arg) {
	              value = true;
	              if (rule.hasArgument) {
	                skippingArgument = true;
	                value = args[i + 1];
	              }
	              options[rule.name] = rule.isList ? (options[rule.name] || []).concat(value) : value;
	              matchedRule = true;
	              break;
	            }
	          }
	          if (isOption && !matchedRule) {
	            throw new Error("unrecognized option: " + arg);
	          }
	        }
	        if (seenNonOptionArg || !isOption) {
	          options["arguments"].push(arg);
	        }
	      }
	      return options;
	    };

	    OptionParser.prototype.help = function() {
	      var j, len, letPart, lines, ref, rule, spaces;
	      lines = [];
	      if (this.banner) {
	        lines.unshift(this.banner + "\n");
	      }
	      ref = this.rules;
	      for (j = 0, len = ref.length; j < len; j++) {
	        rule = ref[j];
	        spaces = 15 - rule.longFlag.length;
	        spaces = spaces > 0 ? repeat(' ', spaces) : '';
	        letPart = rule.shortFlag ? rule.shortFlag + ', ' : '    ';
	        lines.push('  ' + letPart + rule.longFlag + spaces + rule.description);
	      }
	      return "\n" + (lines.join('\n')) + "\n";
	    };

	    return OptionParser;

	  })();

	  LONG_FLAG = /^(--\w[\w\-]*)/;

	  SHORT_FLAG = /^(-\w)$/;

	  MULTI_FLAG = /^-(\w{2,})/;

	  OPTIONAL = /\[(\w+(\*?))\]/;

	  buildRules = function(rules) {
	    var j, len, results, tuple;
	    results = [];
	    for (j = 0, len = rules.length; j < len; j++) {
	      tuple = rules[j];
	      if (tuple.length < 3) {
	        tuple.unshift(null);
	      }
	      results.push(buildRule.apply(null, tuple));
	    }
	    return results;
	  };

	  buildRule = function(shortFlag, longFlag, description, options) {
	    var match;
	    if (options == null) {
	      options = {};
	    }
	    match = longFlag.match(OPTIONAL);
	    longFlag = longFlag.match(LONG_FLAG)[1];
	    return {
	      name: longFlag.substr(2),
	      shortFlag: shortFlag,
	      longFlag: longFlag,
	      description: description,
	      hasArgument: !!(match && match[1]),
	      isList: !!(match && match[2])
	    };
	  };

	  normalizeArguments = function(args) {
	    var arg, j, k, l, len, len1, match, ref, result;
	    args = args.slice(0);
	    result = [];
	    for (j = 0, len = args.length; j < len; j++) {
	      arg = args[j];
	      if (match = arg.match(MULTI_FLAG)) {
	        ref = match[1].split('');
	        for (k = 0, len1 = ref.length; k < len1; k++) {
	          l = ref[k];
	          result.push('-' + l);
	        }
	      } else {
	        result.push(arg);
	      }
	    }
	    return result;
	  };

	}).call(this);


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.10.0
	(function() {
	  var BANNER, CoffeeScript, EventEmitter, SWITCHES, compileJoin, compileOptions, compilePath, compileScript, compileStdio, exec, findDirectoryIndex, forkNode, fs, helpers, hidden, joinTimeout, makePrelude, mkdirp, notSources, optionParser, optparse, opts, outputPath, parseOptions, path, printLine, printTokens, printWarn, ref, removeSource, removeSourceDir, silentUnlink, sourceCode, sources, spawn, timeLog, usage, useWinPathSep, version, wait, watch, watchDir, watchedDirs, writeJs,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(5);

	  helpers = __webpack_require__(82);

	  optparse = __webpack_require__(88);

	  CoffeeScript = __webpack_require__(77);

	  ref = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())), spawn = ref.spawn, exec = ref.exec;

	  EventEmitter = __webpack_require__(36).EventEmitter;

	  useWinPathSep = path.sep === '\\';

	  helpers.extend(CoffeeScript, new EventEmitter);

	  printLine = function(line) {
	    return process.stdout.write(line + '\n');
	  };

	  printWarn = function(line) {
	    return process.stderr.write(line + '\n');
	  };

	  hidden = function(file) {
	    return /^\.|~$/.test(file);
	  };

	  BANNER = 'Usage: coffee [options] path/to/script.coffee -- [args]\n\nIf called without options, `coffee` will run your script.';

	  SWITCHES = [['-b', '--bare', 'compile without a top-level function wrapper'], ['-c', '--compile', 'compile to JavaScript and save as .js files'], ['-e', '--eval', 'pass a string from the command line as input'], ['-h', '--help', 'display this help message'], ['-i', '--interactive', 'run an interactive CoffeeScript REPL'], ['-j', '--join [FILE]', 'concatenate the source CoffeeScript before compiling'], ['-m', '--map', 'generate source map and save as .js.map files'], ['-n', '--nodes', 'print out the parse tree that the parser produces'], ['--nodejs [ARGS]', 'pass options directly to the "node" binary'], ['--no-header', 'suppress the "Generated by" header'], ['-o', '--output [DIR]', 'set the output directory for compiled JavaScript'], ['-p', '--print', 'print out the compiled JavaScript'], ['-r', '--require [MODULE*]', 'require the given module before eval or REPL'], ['-s', '--stdio', 'listen for and compile scripts over stdio'], ['-l', '--literate', 'treat stdio as literate style coffee-script'], ['-t', '--tokens', 'print out the tokens that the lexer/rewriter produce'], ['-v', '--version', 'display the version number'], ['-w', '--watch', 'watch scripts for changes and rerun commands']];

	  opts = {};

	  sources = [];

	  sourceCode = [];

	  notSources = {};

	  watchedDirs = {};

	  optionParser = null;

	  exports.run = function() {
	    var i, len, literals, ref1, replCliOpts, results, source;
	    parseOptions();
	    replCliOpts = {
	      useGlobal: true
	    };
	    if (opts.require) {
	      opts.prelude = makePrelude(opts.require);
	    }
	    replCliOpts.prelude = opts.prelude;
	    if (opts.nodejs) {
	      return forkNode();
	    }
	    if (opts.help) {
	      return usage();
	    }
	    if (opts.version) {
	      return version();
	    }
	    if (opts.interactive) {
	      return __webpack_require__(90).start(replCliOpts);
	    }
	    if (opts.stdio) {
	      return compileStdio();
	    }
	    if (opts["eval"]) {
	      return compileScript(null, opts["arguments"][0]);
	    }
	    if (!opts["arguments"].length) {
	      return __webpack_require__(90).start(replCliOpts);
	    }
	    literals = opts.run ? opts["arguments"].splice(1) : [];
	    process.argv = process.argv.slice(0, 2).concat(literals);
	    process.argv[0] = 'coffee';
	    if (opts.output) {
	      opts.output = path.resolve(opts.output);
	    }
	    if (opts.join) {
	      opts.join = path.resolve(opts.join);
	      console.error('\nThe --join option is deprecated and will be removed in a future version.\n\nIf for some reason it\'s necessary to share local variables between files,\nreplace...\n\n    $ coffee --compile --join bundle.js -- a.coffee b.coffee c.coffee\n\nwith...\n\n    $ cat a.coffee b.coffee c.coffee | coffee --compile --stdio > bundle.js\n');
	    }
	    ref1 = opts["arguments"];
	    results = [];
	    for (i = 0, len = ref1.length; i < len; i++) {
	      source = ref1[i];
	      source = path.resolve(source);
	      results.push(compilePath(source, true, source));
	    }
	    return results;
	  };

	  makePrelude = function(requires) {
	    return requires.map(function(module) {
	      var _, match, name;
	      if (match = module.match(/^(.*)=(.*)$/)) {
	        _ = match[0], name = match[1], module = match[2];
	      }
	      name || (name = helpers.baseFileName(module, true, useWinPathSep));
	      return name + " = require('" + module + "')";
	    }).join(';');
	  };

	  compilePath = function(source, topLevel, base) {
	    var code, err, error, error1, error2, file, files, i, len, results, stats;
	    if (indexOf.call(sources, source) >= 0 || watchedDirs[source] || !topLevel && (notSources[source] || hidden(source))) {
	      return;
	    }
	    try {
	      stats = fs.statSync(source);
	    } catch (error) {
	      err = error;
	      if (err.code === 'ENOENT') {
	        console.error("File not found: " + source);
	        process.exit(1);
	      }
	      throw err;
	    }
	    if (stats.isDirectory()) {
	      if (path.basename(source) === 'node_modules') {
	        notSources[source] = true;
	        return;
	      }
	      if (opts.run) {
	        compilePath(findDirectoryIndex(source), topLevel, base);
	        return;
	      }
	      if (opts.watch) {
	        watchDir(source, base);
	      }
	      try {
	        files = fs.readdirSync(source);
	      } catch (error1) {
	        err = error1;
	        if (err.code === 'ENOENT') {
	          return;
	        } else {
	          throw err;
	        }
	      }
	      results = [];
	      for (i = 0, len = files.length; i < len; i++) {
	        file = files[i];
	        results.push(compilePath(path.join(source, file), false, base));
	      }
	      return results;
	    } else if (topLevel || helpers.isCoffee(source)) {
	      sources.push(source);
	      sourceCode.push(null);
	      delete notSources[source];
	      if (opts.watch) {
	        watch(source, base);
	      }
	      try {
	        code = fs.readFileSync(source);
	      } catch (error2) {
	        err = error2;
	        if (err.code === 'ENOENT') {
	          return;
	        } else {
	          throw err;
	        }
	      }
	      return compileScript(source, code.toString(), base);
	    } else {
	      return notSources[source] = true;
	    }
	  };

	  findDirectoryIndex = function(source) {
	    var err, error, ext, i, index, len, ref1;
	    ref1 = CoffeeScript.FILE_EXTENSIONS;
	    for (i = 0, len = ref1.length; i < len; i++) {
	      ext = ref1[i];
	      index = path.join(source, "index" + ext);
	      try {
	        if ((fs.statSync(index)).isFile()) {
	          return index;
	        }
	      } catch (error) {
	        err = error;
	        if (err.code !== 'ENOENT') {
	          throw err;
	        }
	      }
	    }
	    console.error("Missing index.coffee or index.litcoffee in " + source);
	    return process.exit(1);
	  };

	  compileScript = function(file, input, base) {
	    var compiled, err, error, message, o, options, t, task;
	    if (base == null) {
	      base = null;
	    }
	    o = opts;
	    options = compileOptions(file, base);
	    try {
	      t = task = {
	        file: file,
	        input: input,
	        options: options
	      };
	      CoffeeScript.emit('compile', task);
	      if (o.tokens) {
	        return printTokens(CoffeeScript.tokens(t.input, t.options));
	      } else if (o.nodes) {
	        return printLine(CoffeeScript.nodes(t.input, t.options).toString().trim());
	      } else if (o.run) {
	        CoffeeScript.register();
	        if (opts.prelude) {
	          CoffeeScript["eval"](opts.prelude, t.options);
	        }
	        return CoffeeScript.run(t.input, t.options);
	      } else if (o.join && t.file !== o.join) {
	        if (helpers.isLiterate(file)) {
	          t.input = helpers.invertLiterate(t.input);
	        }
	        sourceCode[sources.indexOf(t.file)] = t.input;
	        return compileJoin();
	      } else {
	        compiled = CoffeeScript.compile(t.input, t.options);
	        t.output = compiled;
	        if (o.map) {
	          t.output = compiled.js;
	          t.sourceMap = compiled.v3SourceMap;
	        }
	        CoffeeScript.emit('success', task);
	        if (o.print) {
	          return printLine(t.output.trim());
	        } else if (o.compile || o.map) {
	          return writeJs(base, t.file, t.output, options.jsPath, t.sourceMap);
	        }
	      }
	    } catch (error) {
	      err = error;
	      CoffeeScript.emit('failure', err, task);
	      if (CoffeeScript.listeners('failure').length) {
	        return;
	      }
	      message = err.stack || ("" + err);
	      if (o.watch) {
	        return printLine(message + '\x07');
	      } else {
	        printWarn(message);
	        return process.exit(1);
	      }
	    }
	  };

	  compileStdio = function() {
	    var code, stdin;
	    code = '';
	    stdin = process.openStdin();
	    stdin.on('data', function(buffer) {
	      if (buffer) {
	        return code += buffer.toString();
	      }
	    });
	    return stdin.on('end', function() {
	      return compileScript(null, code);
	    });
	  };

	  joinTimeout = null;

	  compileJoin = function() {
	    if (!opts.join) {
	      return;
	    }
	    if (!sourceCode.some(function(code) {
	      return code === null;
	    })) {
	      clearTimeout(joinTimeout);
	      return joinTimeout = wait(100, function() {
	        return compileScript(opts.join, sourceCode.join('\n'), opts.join);
	      });
	    }
	  };

	  watch = function(source, base) {
	    var compile, compileTimeout, err, error, prevStats, rewatch, startWatcher, watchErr, watcher;
	    watcher = null;
	    prevStats = null;
	    compileTimeout = null;
	    watchErr = function(err) {
	      var error;
	      if (err.code !== 'ENOENT') {
	        throw err;
	      }
	      if (indexOf.call(sources, source) < 0) {
	        return;
	      }
	      try {
	        rewatch();
	        return compile();
	      } catch (error) {
	        removeSource(source, base);
	        return compileJoin();
	      }
	    };
	    compile = function() {
	      clearTimeout(compileTimeout);
	      return compileTimeout = wait(25, function() {
	        return fs.stat(source, function(err, stats) {
	          if (err) {
	            return watchErr(err);
	          }
	          if (prevStats && stats.size === prevStats.size && stats.mtime.getTime() === prevStats.mtime.getTime()) {
	            return rewatch();
	          }
	          prevStats = stats;
	          return fs.readFile(source, function(err, code) {
	            if (err) {
	              return watchErr(err);
	            }
	            compileScript(source, code.toString(), base);
	            return rewatch();
	          });
	        });
	      });
	    };
	    startWatcher = function() {
	      return watcher = fs.watch(source).on('change', compile).on('error', function(err) {
	        if (err.code !== 'EPERM') {
	          throw err;
	        }
	        return removeSource(source, base);
	      });
	    };
	    rewatch = function() {
	      if (watcher != null) {
	        watcher.close();
	      }
	      return startWatcher();
	    };
	    try {
	      return startWatcher();
	    } catch (error) {
	      err = error;
	      return watchErr(err);
	    }
	  };

	  watchDir = function(source, base) {
	    var err, error, readdirTimeout, startWatcher, stopWatcher, watcher;
	    watcher = null;
	    readdirTimeout = null;
	    startWatcher = function() {
	      return watcher = fs.watch(source).on('error', function(err) {
	        if (err.code !== 'EPERM') {
	          throw err;
	        }
	        return stopWatcher();
	      }).on('change', function() {
	        clearTimeout(readdirTimeout);
	        return readdirTimeout = wait(25, function() {
	          var err, error, file, files, i, len, results;
	          try {
	            files = fs.readdirSync(source);
	          } catch (error) {
	            err = error;
	            if (err.code !== 'ENOENT') {
	              throw err;
	            }
	            return stopWatcher();
	          }
	          results = [];
	          for (i = 0, len = files.length; i < len; i++) {
	            file = files[i];
	            results.push(compilePath(path.join(source, file), false, base));
	          }
	          return results;
	        });
	      });
	    };
	    stopWatcher = function() {
	      watcher.close();
	      return removeSourceDir(source, base);
	    };
	    watchedDirs[source] = true;
	    try {
	      return startWatcher();
	    } catch (error) {
	      err = error;
	      if (err.code !== 'ENOENT') {
	        throw err;
	      }
	    }
	  };

	  removeSourceDir = function(source, base) {
	    var file, i, len, sourcesChanged;
	    delete watchedDirs[source];
	    sourcesChanged = false;
	    for (i = 0, len = sources.length; i < len; i++) {
	      file = sources[i];
	      if (!(source === path.dirname(file))) {
	        continue;
	      }
	      removeSource(file, base);
	      sourcesChanged = true;
	    }
	    if (sourcesChanged) {
	      return compileJoin();
	    }
	  };

	  removeSource = function(source, base) {
	    var index;
	    index = sources.indexOf(source);
	    sources.splice(index, 1);
	    sourceCode.splice(index, 1);
	    if (!opts.join) {
	      silentUnlink(outputPath(source, base));
	      silentUnlink(outputPath(source, base, '.js.map'));
	      return timeLog("removed " + source);
	    }
	  };

	  silentUnlink = function(path) {
	    var err, error, ref1;
	    try {
	      return fs.unlinkSync(path);
	    } catch (error) {
	      err = error;
	      if ((ref1 = err.code) !== 'ENOENT' && ref1 !== 'EPERM') {
	        throw err;
	      }
	    }
	  };

	  outputPath = function(source, base, extension) {
	    var basename, dir, srcDir;
	    if (extension == null) {
	      extension = ".js";
	    }
	    basename = helpers.baseFileName(source, true, useWinPathSep);
	    srcDir = path.dirname(source);
	    if (!opts.output) {
	      dir = srcDir;
	    } else if (source === base) {
	      dir = opts.output;
	    } else {
	      dir = path.join(opts.output, path.relative(base, srcDir));
	    }
	    return path.join(dir, basename + extension);
	  };

	  mkdirp = function(dir, fn) {
	    var mkdirs, mode;
	    mode = 0x1ff & ~process.umask();
	    return (mkdirs = function(p, fn) {
	      return fs.exists(p, function(exists) {
	        if (exists) {
	          return fn();
	        } else {
	          return mkdirs(path.dirname(p), function() {
	            return fs.mkdir(p, mode, function(err) {
	              if (err) {
	                return fn(err);
	              }
	              return fn();
	            });
	          });
	        }
	      });
	    })(dir, fn);
	  };

	  writeJs = function(base, sourcePath, js, jsPath, generatedSourceMap) {
	    var compile, jsDir, sourceMapPath;
	    if (generatedSourceMap == null) {
	      generatedSourceMap = null;
	    }
	    sourceMapPath = outputPath(sourcePath, base, ".js.map");
	    jsDir = path.dirname(jsPath);
	    compile = function() {
	      if (opts.compile) {
	        if (js.length <= 0) {
	          js = ' ';
	        }
	        if (generatedSourceMap) {
	          js = js + "\n//# sourceMappingURL=" + (helpers.baseFileName(sourceMapPath, false, useWinPathSep)) + "\n";
	        }
	        fs.writeFile(jsPath, js, function(err) {
	          if (err) {
	            printLine(err.message);
	            return process.exit(1);
	          } else if (opts.compile && opts.watch) {
	            return timeLog("compiled " + sourcePath);
	          }
	        });
	      }
	      if (generatedSourceMap) {
	        return fs.writeFile(sourceMapPath, generatedSourceMap, function(err) {
	          if (err) {
	            printLine("Could not write source map: " + err.message);
	            return process.exit(1);
	          }
	        });
	      }
	    };
	    return fs.exists(jsDir, function(itExists) {
	      if (itExists) {
	        return compile();
	      } else {
	        return mkdirp(jsDir, compile);
	      }
	    });
	  };

	  wait = function(milliseconds, func) {
	    return setTimeout(func, milliseconds);
	  };

	  timeLog = function(message) {
	    return console.log(((new Date).toLocaleTimeString()) + " - " + message);
	  };

	  printTokens = function(tokens) {
	    var strings, tag, token, value;
	    strings = (function() {
	      var i, len, results;
	      results = [];
	      for (i = 0, len = tokens.length; i < len; i++) {
	        token = tokens[i];
	        tag = token[0];
	        value = token[1].toString().replace(/\n/, '\\n');
	        results.push("[" + tag + " " + value + "]");
	      }
	      return results;
	    })();
	    return printLine(strings.join(' '));
	  };

	  parseOptions = function() {
	    var o;
	    optionParser = new optparse.OptionParser(SWITCHES, BANNER);
	    o = opts = optionParser.parse(process.argv.slice(2));
	    o.compile || (o.compile = !!o.output);
	    o.run = !(o.compile || o.print || o.map);
	    return o.print = !!(o.print || (o["eval"] || o.stdio && o.compile));
	  };

	  compileOptions = function(filename, base) {
	    var answer, cwd, jsDir, jsPath;
	    answer = {
	      filename: filename,
	      literate: opts.literate || helpers.isLiterate(filename),
	      bare: opts.bare,
	      header: opts.compile && !opts['no-header'],
	      sourceMap: opts.map
	    };
	    if (filename) {
	      if (base) {
	        cwd = process.cwd();
	        jsPath = outputPath(filename, base);
	        jsDir = path.dirname(jsPath);
	        answer = helpers.merge(answer, {
	          jsPath: jsPath,
	          sourceRoot: path.relative(jsDir, cwd),
	          sourceFiles: [path.relative(cwd, filename)],
	          generatedFile: helpers.baseFileName(jsPath, false, useWinPathSep)
	        });
	      } else {
	        answer = helpers.merge(answer, {
	          sourceRoot: "",
	          sourceFiles: [helpers.baseFileName(filename, false, useWinPathSep)],
	          generatedFile: helpers.baseFileName(filename, true, useWinPathSep) + ".js"
	        });
	      }
	    }
	    return answer;
	  };

	  forkNode = function() {
	    var args, nodeArgs, p;
	    nodeArgs = opts.nodejs.split(/\s+/);
	    args = process.argv.slice(1);
	    args.splice(args.indexOf('--nodejs'), 2);
	    p = spawn(process.execPath, nodeArgs.concat(args), {
	      cwd: process.cwd(),
	      env: process.env,
	      stdio: [0, 1, 2]
	    });
	    return p.on('exit', function(code) {
	      return process.exit(code);
	    });
	  };

	  usage = function() {
	    return printLine((new optparse.OptionParser(SWITCHES, BANNER)).help());
	  };

	  version = function() {
	    return printLine("CoffeeScript version " + CoffeeScript.VERSION);
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, global, Buffer) {// Generated by CoffeeScript 1.10.0
	(function() {
	  var CoffeeScript, addHistory, addMultilineHandler, fs, getCommandId, merge, nodeREPL, path, ref, replDefaults, runInContext, updateSyntaxError, vm;

	  fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  path = __webpack_require__(5);

	  vm = __webpack_require__(78);

	  nodeREPL = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"repl\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  CoffeeScript = __webpack_require__(77);

	  ref = __webpack_require__(82), merge = ref.merge, updateSyntaxError = ref.updateSyntaxError;

	  replDefaults = {
	    prompt: 'coffee> ',
	    historyFile: process.env.HOME ? path.join(process.env.HOME, '.coffee_history') : void 0,
	    historyMaxInputSize: 10240,
	    "eval": function(input, context, filename, cb) {
	      var Assign, Block, Literal, Value, ast, err, error, js, ref1, referencedVars, token, tokens;
	      input = input.replace(/\uFF00/g, '\n');
	      input = input.replace(/^\(([\s\S]*)\n\)$/m, '$1');
	      ref1 = __webpack_require__(91), Block = ref1.Block, Assign = ref1.Assign, Value = ref1.Value, Literal = ref1.Literal;
	      try {
	        tokens = CoffeeScript.tokens(input);
	        referencedVars = (function() {
	          var i, len, results;
	          results = [];
	          for (i = 0, len = tokens.length; i < len; i++) {
	            token = tokens[i];
	            if (token.variable) {
	              results.push(token[1]);
	            }
	          }
	          return results;
	        })();
	        ast = CoffeeScript.nodes(tokens);
	        ast = new Block([new Assign(new Value(new Literal('_')), ast, '=')]);
	        js = ast.compile({
	          bare: true,
	          locals: Object.keys(context),
	          referencedVars: referencedVars
	        });
	        return cb(null, runInContext(js, context, filename));
	      } catch (error) {
	        err = error;
	        updateSyntaxError(err, input);
	        return cb(err);
	      }
	    }
	  };

	  runInContext = function(js, context, filename) {
	    if (context === global) {
	      return vm.runInThisContext(js, filename);
	    } else {
	      return vm.runInContext(js, context, filename);
	    }
	  };

	  addMultilineHandler = function(repl) {
	    var inputStream, multiline, nodeLineListener, origPrompt, outputStream, ref1, rli;
	    rli = repl.rli, inputStream = repl.inputStream, outputStream = repl.outputStream;
	    origPrompt = (ref1 = repl._prompt) != null ? ref1 : repl.prompt;
	    multiline = {
	      enabled: false,
	      initialPrompt: origPrompt.replace(/^[^> ]*/, function(x) {
	        return x.replace(/./g, '-');
	      }),
	      prompt: origPrompt.replace(/^[^> ]*>?/, function(x) {
	        return x.replace(/./g, '.');
	      }),
	      buffer: ''
	    };
	    nodeLineListener = rli.listeners('line')[0];
	    rli.removeListener('line', nodeLineListener);
	    rli.on('line', function(cmd) {
	      if (multiline.enabled) {
	        multiline.buffer += cmd + "\n";
	        rli.setPrompt(multiline.prompt);
	        rli.prompt(true);
	      } else {
	        rli.setPrompt(origPrompt);
	        nodeLineListener(cmd);
	      }
	    });
	    return inputStream.on('keypress', function(char, key) {
	      if (!(key && key.ctrl && !key.meta && !key.shift && key.name === 'v')) {
	        return;
	      }
	      if (multiline.enabled) {
	        if (!multiline.buffer.match(/\n/)) {
	          multiline.enabled = !multiline.enabled;
	          rli.setPrompt(origPrompt);
	          rli.prompt(true);
	          return;
	        }
	        if ((rli.line != null) && !rli.line.match(/^\s*$/)) {
	          return;
	        }
	        multiline.enabled = !multiline.enabled;
	        rli.line = '';
	        rli.cursor = 0;
	        rli.output.cursorTo(0);
	        rli.output.clearLine(1);
	        multiline.buffer = multiline.buffer.replace(/\n/g, '\uFF00');
	        rli.emit('line', multiline.buffer);
	        multiline.buffer = '';
	      } else {
	        multiline.enabled = !multiline.enabled;
	        rli.setPrompt(multiline.initialPrompt);
	        rli.prompt(true);
	      }
	    });
	  };

	  addHistory = function(repl, filename, maxSize) {
	    var buffer, fd, lastLine, readFd, size, stat;
	    lastLine = null;
	    try {
	      stat = fs.statSync(filename);
	      size = Math.min(maxSize, stat.size);
	      readFd = fs.openSync(filename, 'r');
	      buffer = new Buffer(size);
	      fs.readSync(readFd, buffer, 0, size, stat.size - size);
	      fs.close(readFd);
	      repl.rli.history = buffer.toString().split('\n').reverse();
	      if (stat.size > maxSize) {
	        repl.rli.history.pop();
	      }
	      if (repl.rli.history[0] === '') {
	        repl.rli.history.shift();
	      }
	      repl.rli.historyIndex = -1;
	      lastLine = repl.rli.history[0];
	    } catch (undefined) {}
	    fd = fs.openSync(filename, 'a');
	    repl.rli.addListener('line', function(code) {
	      if (code && code.length && code !== '.history' && lastLine !== code) {
	        fs.write(fd, code + "\n");
	        return lastLine = code;
	      }
	    });
	    repl.on('exit', function() {
	      return fs.close(fd);
	    });
	    return repl.commands[getCommandId(repl, 'history')] = {
	      help: 'Show command history',
	      action: function() {
	        repl.outputStream.write((repl.rli.history.slice(0).reverse().join('\n')) + "\n");
	        return repl.displayPrompt();
	      }
	    };
	  };

	  getCommandId = function(repl, commandName) {
	    var commandsHaveLeadingDot;
	    commandsHaveLeadingDot = repl.commands['.help'] != null;
	    if (commandsHaveLeadingDot) {
	      return "." + commandName;
	    } else {
	      return commandName;
	    }
	  };

	  module.exports = {
	    start: function(opts) {
	      var build, major, minor, ref1, repl;
	      if (opts == null) {
	        opts = {};
	      }
	      ref1 = process.versions.node.split('.').map(function(n) {
	        return parseInt(n);
	      }), major = ref1[0], minor = ref1[1], build = ref1[2];
	      if (major === 0 && minor < 8) {
	        console.warn("Node 0.8.0+ required for CoffeeScript REPL");
	        process.exit(1);
	      }
	      CoffeeScript.register();
	      process.argv = ['coffee'].concat(process.argv.slice(2));
	      opts = merge(replDefaults, opts);
	      repl = nodeREPL.start(opts);
	      if (opts.prelude) {
	        runInContext(opts.prelude, repl.context, 'prelude');
	      }
	      repl.on('exit', function() {
	        if (!repl.rli.closed) {
	          return repl.outputStream.write('\n');
	        }
	      });
	      addMultilineHandler(repl);
	      if (opts.historyFile) {
	        addHistory(repl, opts.historyFile, opts.historyMaxInputSize);
	      }
	      repl.commands[getCommandId(repl, 'load')].help = 'Load code from a file into this REPL session';
	      return repl;
	    }
	  };

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), (function() { return this; }()), __webpack_require__(12).Buffer))

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Access, Arr, Assign, Base, Block, Call, Class, Code, CodeFragment, Comment, Existence, Expansion, Extends, For, HEXNUM, IDENTIFIER, IS_REGEX, IS_STRING, If, In, Index, LEVEL_ACCESS, LEVEL_COND, LEVEL_LIST, LEVEL_OP, LEVEL_PAREN, LEVEL_TOP, Literal, NEGATE, NO, NUMBER, Obj, Op, Param, Parens, RESERVED, Range, Return, SIMPLENUM, STRICT_PROSCRIBED, Scope, Slice, Splat, Switch, TAB, THIS, Throw, Try, UTILITIES, Value, While, YES, addLocationDataFn, compact, del, ends, extend, flatten, fragmentsToText, isComplexOrAssignable, isLiteralArguments, isLiteralThis, locationDataToString, merge, multident, parseNum, ref1, ref2, some, starts, throwSyntaxError, unfoldSoak, utility,
	    extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    hasProp = {}.hasOwnProperty,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
	    slice = [].slice;

	  Error.stackTraceLimit = Infinity;

	  Scope = __webpack_require__(92).Scope;

	  ref1 = __webpack_require__(80), RESERVED = ref1.RESERVED, STRICT_PROSCRIBED = ref1.STRICT_PROSCRIBED;

	  ref2 = __webpack_require__(82), compact = ref2.compact, flatten = ref2.flatten, extend = ref2.extend, merge = ref2.merge, del = ref2.del, starts = ref2.starts, ends = ref2.ends, some = ref2.some, addLocationDataFn = ref2.addLocationDataFn, locationDataToString = ref2.locationDataToString, throwSyntaxError = ref2.throwSyntaxError;

	  exports.extend = extend;

	  exports.addLocationDataFn = addLocationDataFn;

	  YES = function() {
	    return true;
	  };

	  NO = function() {
	    return false;
	  };

	  THIS = function() {
	    return this;
	  };

	  NEGATE = function() {
	    this.negated = !this.negated;
	    return this;
	  };

	  exports.CodeFragment = CodeFragment = (function() {
	    function CodeFragment(parent, code) {
	      var ref3;
	      this.code = "" + code;
	      this.locationData = parent != null ? parent.locationData : void 0;
	      this.type = (parent != null ? (ref3 = parent.constructor) != null ? ref3.name : void 0 : void 0) || 'unknown';
	    }

	    CodeFragment.prototype.toString = function() {
	      return "" + this.code + (this.locationData ? ": " + locationDataToString(this.locationData) : '');
	    };

	    return CodeFragment;

	  })();

	  fragmentsToText = function(fragments) {
	    var fragment;
	    return ((function() {
	      var j, len1, results;
	      results = [];
	      for (j = 0, len1 = fragments.length; j < len1; j++) {
	        fragment = fragments[j];
	        results.push(fragment.code);
	      }
	      return results;
	    })()).join('');
	  };

	  exports.Base = Base = (function() {
	    function Base() {}

	    Base.prototype.compile = function(o, lvl) {
	      return fragmentsToText(this.compileToFragments(o, lvl));
	    };

	    Base.prototype.compileToFragments = function(o, lvl) {
	      var node;
	      o = extend({}, o);
	      if (lvl) {
	        o.level = lvl;
	      }
	      node = this.unfoldSoak(o) || this;
	      node.tab = o.indent;
	      if (o.level === LEVEL_TOP || !node.isStatement(o)) {
	        return node.compileNode(o);
	      } else {
	        return node.compileClosure(o);
	      }
	    };

	    Base.prototype.compileClosure = function(o) {
	      var args, argumentsNode, func, jumpNode, meth, parts, ref3;
	      if (jumpNode = this.jumps()) {
	        jumpNode.error('cannot use a pure statement in an expression');
	      }
	      o.sharedScope = true;
	      func = new Code([], Block.wrap([this]));
	      args = [];
	      if ((argumentsNode = this.contains(isLiteralArguments)) || this.contains(isLiteralThis)) {
	        args = [new Literal('this')];
	        if (argumentsNode) {
	          meth = 'apply';
	          args.push(new Literal('arguments'));
	        } else {
	          meth = 'call';
	        }
	        func = new Value(func, [new Access(new Literal(meth))]);
	      }
	      parts = (new Call(func, args)).compileNode(o);
	      if (func.isGenerator || ((ref3 = func.base) != null ? ref3.isGenerator : void 0)) {
	        parts.unshift(this.makeCode("(yield* "));
	        parts.push(this.makeCode(")"));
	      }
	      return parts;
	    };

	    Base.prototype.cache = function(o, level, isComplex) {
	      var complex, ref, sub;
	      complex = isComplex != null ? isComplex(this) : this.isComplex();
	      if (complex) {
	        ref = new Literal(o.scope.freeVariable('ref'));
	        sub = new Assign(ref, this);
	        if (level) {
	          return [sub.compileToFragments(o, level), [this.makeCode(ref.value)]];
	        } else {
	          return [sub, ref];
	        }
	      } else {
	        ref = level ? this.compileToFragments(o, level) : this;
	        return [ref, ref];
	      }
	    };

	    Base.prototype.cacheToCodeFragments = function(cacheValues) {
	      return [fragmentsToText(cacheValues[0]), fragmentsToText(cacheValues[1])];
	    };

	    Base.prototype.makeReturn = function(res) {
	      var me;
	      me = this.unwrapAll();
	      if (res) {
	        return new Call(new Literal(res + ".push"), [me]);
	      } else {
	        return new Return(me);
	      }
	    };

	    Base.prototype.contains = function(pred) {
	      var node;
	      node = void 0;
	      this.traverseChildren(false, function(n) {
	        if (pred(n)) {
	          node = n;
	          return false;
	        }
	      });
	      return node;
	    };

	    Base.prototype.lastNonComment = function(list) {
	      var i;
	      i = list.length;
	      while (i--) {
	        if (!(list[i] instanceof Comment)) {
	          return list[i];
	        }
	      }
	      return null;
	    };

	    Base.prototype.toString = function(idt, name) {
	      var tree;
	      if (idt == null) {
	        idt = '';
	      }
	      if (name == null) {
	        name = this.constructor.name;
	      }
	      tree = '\n' + idt + name;
	      if (this.soak) {
	        tree += '?';
	      }
	      this.eachChild(function(node) {
	        return tree += node.toString(idt + TAB);
	      });
	      return tree;
	    };

	    Base.prototype.eachChild = function(func) {
	      var attr, child, j, k, len1, len2, ref3, ref4;
	      if (!this.children) {
	        return this;
	      }
	      ref3 = this.children;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        attr = ref3[j];
	        if (this[attr]) {
	          ref4 = flatten([this[attr]]);
	          for (k = 0, len2 = ref4.length; k < len2; k++) {
	            child = ref4[k];
	            if (func(child) === false) {
	              return this;
	            }
	          }
	        }
	      }
	      return this;
	    };

	    Base.prototype.traverseChildren = function(crossScope, func) {
	      return this.eachChild(function(child) {
	        var recur;
	        recur = func(child);
	        if (recur !== false) {
	          return child.traverseChildren(crossScope, func);
	        }
	      });
	    };

	    Base.prototype.invert = function() {
	      return new Op('!', this);
	    };

	    Base.prototype.unwrapAll = function() {
	      var node;
	      node = this;
	      while (node !== (node = node.unwrap())) {
	        continue;
	      }
	      return node;
	    };

	    Base.prototype.children = [];

	    Base.prototype.isStatement = NO;

	    Base.prototype.jumps = NO;

	    Base.prototype.isComplex = YES;

	    Base.prototype.isChainable = NO;

	    Base.prototype.isAssignable = NO;

	    Base.prototype.unwrap = THIS;

	    Base.prototype.unfoldSoak = NO;

	    Base.prototype.assigns = NO;

	    Base.prototype.updateLocationDataIfMissing = function(locationData) {
	      if (this.locationData) {
	        return this;
	      }
	      this.locationData = locationData;
	      return this.eachChild(function(child) {
	        return child.updateLocationDataIfMissing(locationData);
	      });
	    };

	    Base.prototype.error = function(message) {
	      return throwSyntaxError(message, this.locationData);
	    };

	    Base.prototype.makeCode = function(code) {
	      return new CodeFragment(this, code);
	    };

	    Base.prototype.wrapInBraces = function(fragments) {
	      return [].concat(this.makeCode('('), fragments, this.makeCode(')'));
	    };

	    Base.prototype.joinFragmentArrays = function(fragmentsList, joinStr) {
	      var answer, fragments, i, j, len1;
	      answer = [];
	      for (i = j = 0, len1 = fragmentsList.length; j < len1; i = ++j) {
	        fragments = fragmentsList[i];
	        if (i) {
	          answer.push(this.makeCode(joinStr));
	        }
	        answer = answer.concat(fragments);
	      }
	      return answer;
	    };

	    return Base;

	  })();

	  exports.Block = Block = (function(superClass1) {
	    extend1(Block, superClass1);

	    function Block(nodes) {
	      this.expressions = compact(flatten(nodes || []));
	    }

	    Block.prototype.children = ['expressions'];

	    Block.prototype.push = function(node) {
	      this.expressions.push(node);
	      return this;
	    };

	    Block.prototype.pop = function() {
	      return this.expressions.pop();
	    };

	    Block.prototype.unshift = function(node) {
	      this.expressions.unshift(node);
	      return this;
	    };

	    Block.prototype.unwrap = function() {
	      if (this.expressions.length === 1) {
	        return this.expressions[0];
	      } else {
	        return this;
	      }
	    };

	    Block.prototype.isEmpty = function() {
	      return !this.expressions.length;
	    };

	    Block.prototype.isStatement = function(o) {
	      var exp, j, len1, ref3;
	      ref3 = this.expressions;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        exp = ref3[j];
	        if (exp.isStatement(o)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    Block.prototype.jumps = function(o) {
	      var exp, j, jumpNode, len1, ref3;
	      ref3 = this.expressions;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        exp = ref3[j];
	        if (jumpNode = exp.jumps(o)) {
	          return jumpNode;
	        }
	      }
	    };

	    Block.prototype.makeReturn = function(res) {
	      var expr, len;
	      len = this.expressions.length;
	      while (len--) {
	        expr = this.expressions[len];
	        if (!(expr instanceof Comment)) {
	          this.expressions[len] = expr.makeReturn(res);
	          if (expr instanceof Return && !expr.expression) {
	            this.expressions.splice(len, 1);
	          }
	          break;
	        }
	      }
	      return this;
	    };

	    Block.prototype.compileToFragments = function(o, level) {
	      if (o == null) {
	        o = {};
	      }
	      if (o.scope) {
	        return Block.__super__.compileToFragments.call(this, o, level);
	      } else {
	        return this.compileRoot(o);
	      }
	    };

	    Block.prototype.compileNode = function(o) {
	      var answer, compiledNodes, fragments, index, j, len1, node, ref3, top;
	      this.tab = o.indent;
	      top = o.level === LEVEL_TOP;
	      compiledNodes = [];
	      ref3 = this.expressions;
	      for (index = j = 0, len1 = ref3.length; j < len1; index = ++j) {
	        node = ref3[index];
	        node = node.unwrapAll();
	        node = node.unfoldSoak(o) || node;
	        if (node instanceof Block) {
	          compiledNodes.push(node.compileNode(o));
	        } else if (top) {
	          node.front = true;
	          fragments = node.compileToFragments(o);
	          if (!node.isStatement(o)) {
	            fragments.unshift(this.makeCode("" + this.tab));
	            fragments.push(this.makeCode(";"));
	          }
	          compiledNodes.push(fragments);
	        } else {
	          compiledNodes.push(node.compileToFragments(o, LEVEL_LIST));
	        }
	      }
	      if (top) {
	        if (this.spaced) {
	          return [].concat(this.joinFragmentArrays(compiledNodes, '\n\n'), this.makeCode("\n"));
	        } else {
	          return this.joinFragmentArrays(compiledNodes, '\n');
	        }
	      }
	      if (compiledNodes.length) {
	        answer = this.joinFragmentArrays(compiledNodes, ', ');
	      } else {
	        answer = [this.makeCode("void 0")];
	      }
	      if (compiledNodes.length > 1 && o.level >= LEVEL_LIST) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Block.prototype.compileRoot = function(o) {
	      var exp, fragments, i, j, len1, name, prelude, preludeExps, ref3, ref4, rest;
	      o.indent = o.bare ? '' : TAB;
	      o.level = LEVEL_TOP;
	      this.spaced = true;
	      o.scope = new Scope(null, this, null, (ref3 = o.referencedVars) != null ? ref3 : []);
	      ref4 = o.locals || [];
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        name = ref4[j];
	        o.scope.parameter(name);
	      }
	      prelude = [];
	      if (!o.bare) {
	        preludeExps = (function() {
	          var k, len2, ref5, results;
	          ref5 = this.expressions;
	          results = [];
	          for (i = k = 0, len2 = ref5.length; k < len2; i = ++k) {
	            exp = ref5[i];
	            if (!(exp.unwrap() instanceof Comment)) {
	              break;
	            }
	            results.push(exp);
	          }
	          return results;
	        }).call(this);
	        rest = this.expressions.slice(preludeExps.length);
	        this.expressions = preludeExps;
	        if (preludeExps.length) {
	          prelude = this.compileNode(merge(o, {
	            indent: ''
	          }));
	          prelude.push(this.makeCode("\n"));
	        }
	        this.expressions = rest;
	      }
	      fragments = this.compileWithDeclarations(o);
	      if (o.bare) {
	        return fragments;
	      }
	      return [].concat(prelude, this.makeCode("(function() {\n"), fragments, this.makeCode("\n}).call(this);\n"));
	    };

	    Block.prototype.compileWithDeclarations = function(o) {
	      var assigns, declars, exp, fragments, i, j, len1, post, ref3, ref4, ref5, rest, scope, spaced;
	      fragments = [];
	      post = [];
	      ref3 = this.expressions;
	      for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	        exp = ref3[i];
	        exp = exp.unwrap();
	        if (!(exp instanceof Comment || exp instanceof Literal)) {
	          break;
	        }
	      }
	      o = merge(o, {
	        level: LEVEL_TOP
	      });
	      if (i) {
	        rest = this.expressions.splice(i, 9e9);
	        ref4 = [this.spaced, false], spaced = ref4[0], this.spaced = ref4[1];
	        ref5 = [this.compileNode(o), spaced], fragments = ref5[0], this.spaced = ref5[1];
	        this.expressions = rest;
	      }
	      post = this.compileNode(o);
	      scope = o.scope;
	      if (scope.expressions === this) {
	        declars = o.scope.hasDeclarations();
	        assigns = scope.hasAssignments;
	        if (declars || assigns) {
	          if (i) {
	            fragments.push(this.makeCode('\n'));
	          }
	          fragments.push(this.makeCode(this.tab + "var "));
	          if (declars) {
	            fragments.push(this.makeCode(scope.declaredVariables().join(', ')));
	          }
	          if (assigns) {
	            if (declars) {
	              fragments.push(this.makeCode(",\n" + (this.tab + TAB)));
	            }
	            fragments.push(this.makeCode(scope.assignedVariables().join(",\n" + (this.tab + TAB))));
	          }
	          fragments.push(this.makeCode(";\n" + (this.spaced ? '\n' : '')));
	        } else if (fragments.length && post.length) {
	          fragments.push(this.makeCode("\n"));
	        }
	      }
	      return fragments.concat(post);
	    };

	    Block.wrap = function(nodes) {
	      if (nodes.length === 1 && nodes[0] instanceof Block) {
	        return nodes[0];
	      }
	      return new Block(nodes);
	    };

	    return Block;

	  })(Base);

	  exports.Literal = Literal = (function(superClass1) {
	    extend1(Literal, superClass1);

	    function Literal(value1) {
	      this.value = value1;
	    }

	    Literal.prototype.makeReturn = function() {
	      if (this.isStatement()) {
	        return this;
	      } else {
	        return Literal.__super__.makeReturn.apply(this, arguments);
	      }
	    };

	    Literal.prototype.isAssignable = function() {
	      return IDENTIFIER.test(this.value);
	    };

	    Literal.prototype.isStatement = function() {
	      var ref3;
	      return (ref3 = this.value) === 'break' || ref3 === 'continue' || ref3 === 'debugger';
	    };

	    Literal.prototype.isComplex = NO;

	    Literal.prototype.assigns = function(name) {
	      return name === this.value;
	    };

	    Literal.prototype.jumps = function(o) {
	      if (this.value === 'break' && !((o != null ? o.loop : void 0) || (o != null ? o.block : void 0))) {
	        return this;
	      }
	      if (this.value === 'continue' && !(o != null ? o.loop : void 0)) {
	        return this;
	      }
	    };

	    Literal.prototype.compileNode = function(o) {
	      var answer, code, ref3;
	      code = this.value === 'this' ? ((ref3 = o.scope.method) != null ? ref3.bound : void 0) ? o.scope.method.context : this.value : this.value.reserved ? "\"" + this.value + "\"" : this.value;
	      answer = this.isStatement() ? "" + this.tab + code + ";" : code;
	      return [this.makeCode(answer)];
	    };

	    Literal.prototype.toString = function() {
	      return ' "' + this.value + '"';
	    };

	    return Literal;

	  })(Base);

	  exports.Undefined = (function(superClass1) {
	    extend1(Undefined, superClass1);

	    function Undefined() {
	      return Undefined.__super__.constructor.apply(this, arguments);
	    }

	    Undefined.prototype.isAssignable = NO;

	    Undefined.prototype.isComplex = NO;

	    Undefined.prototype.compileNode = function(o) {
	      return [this.makeCode(o.level >= LEVEL_ACCESS ? '(void 0)' : 'void 0')];
	    };

	    return Undefined;

	  })(Base);

	  exports.Null = (function(superClass1) {
	    extend1(Null, superClass1);

	    function Null() {
	      return Null.__super__.constructor.apply(this, arguments);
	    }

	    Null.prototype.isAssignable = NO;

	    Null.prototype.isComplex = NO;

	    Null.prototype.compileNode = function() {
	      return [this.makeCode("null")];
	    };

	    return Null;

	  })(Base);

	  exports.Bool = (function(superClass1) {
	    extend1(Bool, superClass1);

	    Bool.prototype.isAssignable = NO;

	    Bool.prototype.isComplex = NO;

	    Bool.prototype.compileNode = function() {
	      return [this.makeCode(this.val)];
	    };

	    function Bool(val1) {
	      this.val = val1;
	    }

	    return Bool;

	  })(Base);

	  exports.Return = Return = (function(superClass1) {
	    extend1(Return, superClass1);

	    function Return(expression) {
	      this.expression = expression;
	    }

	    Return.prototype.children = ['expression'];

	    Return.prototype.isStatement = YES;

	    Return.prototype.makeReturn = THIS;

	    Return.prototype.jumps = THIS;

	    Return.prototype.compileToFragments = function(o, level) {
	      var expr, ref3;
	      expr = (ref3 = this.expression) != null ? ref3.makeReturn() : void 0;
	      if (expr && !(expr instanceof Return)) {
	        return expr.compileToFragments(o, level);
	      } else {
	        return Return.__super__.compileToFragments.call(this, o, level);
	      }
	    };

	    Return.prototype.compileNode = function(o) {
	      var answer, exprIsYieldReturn, ref3;
	      answer = [];
	      exprIsYieldReturn = (ref3 = this.expression) != null ? typeof ref3.isYieldReturn === "function" ? ref3.isYieldReturn() : void 0 : void 0;
	      if (!exprIsYieldReturn) {
	        answer.push(this.makeCode(this.tab + ("return" + (this.expression ? " " : ""))));
	      }
	      if (this.expression) {
	        answer = answer.concat(this.expression.compileToFragments(o, LEVEL_PAREN));
	      }
	      if (!exprIsYieldReturn) {
	        answer.push(this.makeCode(";"));
	      }
	      return answer;
	    };

	    return Return;

	  })(Base);

	  exports.Value = Value = (function(superClass1) {
	    extend1(Value, superClass1);

	    function Value(base, props, tag) {
	      if (!props && base instanceof Value) {
	        return base;
	      }
	      this.base = base;
	      this.properties = props || [];
	      if (tag) {
	        this[tag] = true;
	      }
	      return this;
	    }

	    Value.prototype.children = ['base', 'properties'];

	    Value.prototype.add = function(props) {
	      this.properties = this.properties.concat(props);
	      return this;
	    };

	    Value.prototype.hasProperties = function() {
	      return !!this.properties.length;
	    };

	    Value.prototype.bareLiteral = function(type) {
	      return !this.properties.length && this.base instanceof type;
	    };

	    Value.prototype.isArray = function() {
	      return this.bareLiteral(Arr);
	    };

	    Value.prototype.isRange = function() {
	      return this.bareLiteral(Range);
	    };

	    Value.prototype.isComplex = function() {
	      return this.hasProperties() || this.base.isComplex();
	    };

	    Value.prototype.isAssignable = function() {
	      return this.hasProperties() || this.base.isAssignable();
	    };

	    Value.prototype.isSimpleNumber = function() {
	      return this.bareLiteral(Literal) && SIMPLENUM.test(this.base.value);
	    };

	    Value.prototype.isString = function() {
	      return this.bareLiteral(Literal) && IS_STRING.test(this.base.value);
	    };

	    Value.prototype.isRegex = function() {
	      return this.bareLiteral(Literal) && IS_REGEX.test(this.base.value);
	    };

	    Value.prototype.isAtomic = function() {
	      var j, len1, node, ref3;
	      ref3 = this.properties.concat(this.base);
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        node = ref3[j];
	        if (node.soak || node instanceof Call) {
	          return false;
	        }
	      }
	      return true;
	    };

	    Value.prototype.isNotCallable = function() {
	      return this.isSimpleNumber() || this.isString() || this.isRegex() || this.isArray() || this.isRange() || this.isSplice() || this.isObject();
	    };

	    Value.prototype.isStatement = function(o) {
	      return !this.properties.length && this.base.isStatement(o);
	    };

	    Value.prototype.assigns = function(name) {
	      return !this.properties.length && this.base.assigns(name);
	    };

	    Value.prototype.jumps = function(o) {
	      return !this.properties.length && this.base.jumps(o);
	    };

	    Value.prototype.isObject = function(onlyGenerated) {
	      if (this.properties.length) {
	        return false;
	      }
	      return (this.base instanceof Obj) && (!onlyGenerated || this.base.generated);
	    };

	    Value.prototype.isSplice = function() {
	      var lastProp, ref3;
	      ref3 = this.properties, lastProp = ref3[ref3.length - 1];
	      return lastProp instanceof Slice;
	    };

	    Value.prototype.looksStatic = function(className) {
	      var ref3;
	      return this.base.value === className && this.properties.length === 1 && ((ref3 = this.properties[0].name) != null ? ref3.value : void 0) !== 'prototype';
	    };

	    Value.prototype.unwrap = function() {
	      if (this.properties.length) {
	        return this;
	      } else {
	        return this.base;
	      }
	    };

	    Value.prototype.cacheReference = function(o) {
	      var base, bref, name, nref, ref3;
	      ref3 = this.properties, name = ref3[ref3.length - 1];
	      if (this.properties.length < 2 && !this.base.isComplex() && !(name != null ? name.isComplex() : void 0)) {
	        return [this, this];
	      }
	      base = new Value(this.base, this.properties.slice(0, -1));
	      if (base.isComplex()) {
	        bref = new Literal(o.scope.freeVariable('base'));
	        base = new Value(new Parens(new Assign(bref, base)));
	      }
	      if (!name) {
	        return [base, bref];
	      }
	      if (name.isComplex()) {
	        nref = new Literal(o.scope.freeVariable('name'));
	        name = new Index(new Assign(nref, name.index));
	        nref = new Index(nref);
	      }
	      return [base.add(name), new Value(bref || base.base, [nref || name])];
	    };

	    Value.prototype.compileNode = function(o) {
	      var fragments, j, len1, prop, props;
	      this.base.front = this.front;
	      props = this.properties;
	      fragments = this.base.compileToFragments(o, (props.length ? LEVEL_ACCESS : null));
	      if ((this.base instanceof Parens || props.length) && SIMPLENUM.test(fragmentsToText(fragments))) {
	        fragments.push(this.makeCode('.'));
	      }
	      for (j = 0, len1 = props.length; j < len1; j++) {
	        prop = props[j];
	        fragments.push.apply(fragments, prop.compileToFragments(o));
	      }
	      return fragments;
	    };

	    Value.prototype.unfoldSoak = function(o) {
	      return this.unfoldedSoak != null ? this.unfoldedSoak : this.unfoldedSoak = (function(_this) {
	        return function() {
	          var fst, i, ifn, j, len1, prop, ref, ref3, ref4, snd;
	          if (ifn = _this.base.unfoldSoak(o)) {
	            (ref3 = ifn.body.properties).push.apply(ref3, _this.properties);
	            return ifn;
	          }
	          ref4 = _this.properties;
	          for (i = j = 0, len1 = ref4.length; j < len1; i = ++j) {
	            prop = ref4[i];
	            if (!prop.soak) {
	              continue;
	            }
	            prop.soak = false;
	            fst = new Value(_this.base, _this.properties.slice(0, i));
	            snd = new Value(_this.base, _this.properties.slice(i));
	            if (fst.isComplex()) {
	              ref = new Literal(o.scope.freeVariable('ref'));
	              fst = new Parens(new Assign(ref, fst));
	              snd.base = ref;
	            }
	            return new If(new Existence(fst), snd, {
	              soak: true
	            });
	          }
	          return false;
	        };
	      })(this)();
	    };

	    return Value;

	  })(Base);

	  exports.Comment = Comment = (function(superClass1) {
	    extend1(Comment, superClass1);

	    function Comment(comment1) {
	      this.comment = comment1;
	    }

	    Comment.prototype.isStatement = YES;

	    Comment.prototype.makeReturn = THIS;

	    Comment.prototype.compileNode = function(o, level) {
	      var code, comment;
	      comment = this.comment.replace(/^(\s*)#(?=\s)/gm, "$1 *");
	      code = "/*" + (multident(comment, this.tab)) + (indexOf.call(comment, '\n') >= 0 ? "\n" + this.tab : '') + " */";
	      if ((level || o.level) === LEVEL_TOP) {
	        code = o.indent + code;
	      }
	      return [this.makeCode("\n"), this.makeCode(code)];
	    };

	    return Comment;

	  })(Base);

	  exports.Call = Call = (function(superClass1) {
	    extend1(Call, superClass1);

	    function Call(variable, args1, soak) {
	      this.args = args1 != null ? args1 : [];
	      this.soak = soak;
	      this.isNew = false;
	      this.isSuper = variable === 'super';
	      this.variable = this.isSuper ? null : variable;
	      if (variable instanceof Value && variable.isNotCallable()) {
	        variable.error("literal is not a function");
	      }
	    }

	    Call.prototype.children = ['variable', 'args'];

	    Call.prototype.newInstance = function() {
	      var base, ref3;
	      base = ((ref3 = this.variable) != null ? ref3.base : void 0) || this.variable;
	      if (base instanceof Call && !base.isNew) {
	        base.newInstance();
	      } else {
	        this.isNew = true;
	      }
	      return this;
	    };

	    Call.prototype.superReference = function(o) {
	      var accesses, base, bref, klass, method, name, nref, variable;
	      method = o.scope.namedMethod();
	      if (method != null ? method.klass : void 0) {
	        klass = method.klass, name = method.name, variable = method.variable;
	        if (klass.isComplex()) {
	          bref = new Literal(o.scope.parent.freeVariable('base'));
	          base = new Value(new Parens(new Assign(bref, klass)));
	          variable.base = base;
	          variable.properties.splice(0, klass.properties.length);
	        }
	        if (name.isComplex() || (name instanceof Index && name.index.isAssignable())) {
	          nref = new Literal(o.scope.parent.freeVariable('name'));
	          name = new Index(new Assign(nref, name.index));
	          variable.properties.pop();
	          variable.properties.push(name);
	        }
	        accesses = [new Access(new Literal('__super__'))];
	        if (method["static"]) {
	          accesses.push(new Access(new Literal('constructor')));
	        }
	        accesses.push(nref != null ? new Index(nref) : name);
	        return (new Value(bref != null ? bref : klass, accesses)).compile(o);
	      } else if (method != null ? method.ctor : void 0) {
	        return method.name + ".__super__.constructor";
	      } else {
	        return this.error('cannot call super outside of an instance method.');
	      }
	    };

	    Call.prototype.superThis = function(o) {
	      var method;
	      method = o.scope.method;
	      return (method && !method.klass && method.context) || "this";
	    };

	    Call.prototype.unfoldSoak = function(o) {
	      var call, ifn, j, left, len1, list, ref3, ref4, rite;
	      if (this.soak) {
	        if (this.variable) {
	          if (ifn = unfoldSoak(o, this, 'variable')) {
	            return ifn;
	          }
	          ref3 = new Value(this.variable).cacheReference(o), left = ref3[0], rite = ref3[1];
	        } else {
	          left = new Literal(this.superReference(o));
	          rite = new Value(left);
	        }
	        rite = new Call(rite, this.args);
	        rite.isNew = this.isNew;
	        left = new Literal("typeof " + (left.compile(o)) + " === \"function\"");
	        return new If(left, new Value(rite), {
	          soak: true
	        });
	      }
	      call = this;
	      list = [];
	      while (true) {
	        if (call.variable instanceof Call) {
	          list.push(call);
	          call = call.variable;
	          continue;
	        }
	        if (!(call.variable instanceof Value)) {
	          break;
	        }
	        list.push(call);
	        if (!((call = call.variable.base) instanceof Call)) {
	          break;
	        }
	      }
	      ref4 = list.reverse();
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        call = ref4[j];
	        if (ifn) {
	          if (call.variable instanceof Call) {
	            call.variable = ifn;
	          } else {
	            call.variable.base = ifn;
	          }
	        }
	        ifn = unfoldSoak(o, call, 'variable');
	      }
	      return ifn;
	    };

	    Call.prototype.compileNode = function(o) {
	      var arg, argIndex, compiledArgs, compiledArray, fragments, j, len1, preface, ref3, ref4;
	      if ((ref3 = this.variable) != null) {
	        ref3.front = this.front;
	      }
	      compiledArray = Splat.compileSplattedArray(o, this.args, true);
	      if (compiledArray.length) {
	        return this.compileSplat(o, compiledArray);
	      }
	      compiledArgs = [];
	      ref4 = this.args;
	      for (argIndex = j = 0, len1 = ref4.length; j < len1; argIndex = ++j) {
	        arg = ref4[argIndex];
	        if (argIndex) {
	          compiledArgs.push(this.makeCode(", "));
	        }
	        compiledArgs.push.apply(compiledArgs, arg.compileToFragments(o, LEVEL_LIST));
	      }
	      fragments = [];
	      if (this.isSuper) {
	        preface = this.superReference(o) + (".call(" + (this.superThis(o)));
	        if (compiledArgs.length) {
	          preface += ", ";
	        }
	        fragments.push(this.makeCode(preface));
	      } else {
	        if (this.isNew) {
	          fragments.push(this.makeCode('new '));
	        }
	        fragments.push.apply(fragments, this.variable.compileToFragments(o, LEVEL_ACCESS));
	        fragments.push(this.makeCode("("));
	      }
	      fragments.push.apply(fragments, compiledArgs);
	      fragments.push(this.makeCode(")"));
	      return fragments;
	    };

	    Call.prototype.compileSplat = function(o, splatArgs) {
	      var answer, base, fun, idt, name, ref;
	      if (this.isSuper) {
	        return [].concat(this.makeCode((this.superReference(o)) + ".apply(" + (this.superThis(o)) + ", "), splatArgs, this.makeCode(")"));
	      }
	      if (this.isNew) {
	        idt = this.tab + TAB;
	        return [].concat(this.makeCode("(function(func, args, ctor) {\n" + idt + "ctor.prototype = func.prototype;\n" + idt + "var child = new ctor, result = func.apply(child, args);\n" + idt + "return Object(result) === result ? result : child;\n" + this.tab + "})("), this.variable.compileToFragments(o, LEVEL_LIST), this.makeCode(", "), splatArgs, this.makeCode(", function(){})"));
	      }
	      answer = [];
	      base = new Value(this.variable);
	      if ((name = base.properties.pop()) && base.isComplex()) {
	        ref = o.scope.freeVariable('ref');
	        answer = answer.concat(this.makeCode("(" + ref + " = "), base.compileToFragments(o, LEVEL_LIST), this.makeCode(")"), name.compileToFragments(o));
	      } else {
	        fun = base.compileToFragments(o, LEVEL_ACCESS);
	        if (SIMPLENUM.test(fragmentsToText(fun))) {
	          fun = this.wrapInBraces(fun);
	        }
	        if (name) {
	          ref = fragmentsToText(fun);
	          fun.push.apply(fun, name.compileToFragments(o));
	        } else {
	          ref = 'null';
	        }
	        answer = answer.concat(fun);
	      }
	      return answer = answer.concat(this.makeCode(".apply(" + ref + ", "), splatArgs, this.makeCode(")"));
	    };

	    return Call;

	  })(Base);

	  exports.Extends = Extends = (function(superClass1) {
	    extend1(Extends, superClass1);

	    function Extends(child1, parent1) {
	      this.child = child1;
	      this.parent = parent1;
	    }

	    Extends.prototype.children = ['child', 'parent'];

	    Extends.prototype.compileToFragments = function(o) {
	      return new Call(new Value(new Literal(utility('extend', o))), [this.child, this.parent]).compileToFragments(o);
	    };

	    return Extends;

	  })(Base);

	  exports.Access = Access = (function(superClass1) {
	    extend1(Access, superClass1);

	    function Access(name1, tag) {
	      this.name = name1;
	      this.name.asKey = true;
	      this.soak = tag === 'soak';
	    }

	    Access.prototype.children = ['name'];

	    Access.prototype.compileToFragments = function(o) {
	      var name;
	      name = this.name.compileToFragments(o);
	      if (IDENTIFIER.test(fragmentsToText(name))) {
	        name.unshift(this.makeCode("."));
	      } else {
	        name.unshift(this.makeCode("["));
	        name.push(this.makeCode("]"));
	      }
	      return name;
	    };

	    Access.prototype.isComplex = NO;

	    return Access;

	  })(Base);

	  exports.Index = Index = (function(superClass1) {
	    extend1(Index, superClass1);

	    function Index(index1) {
	      this.index = index1;
	    }

	    Index.prototype.children = ['index'];

	    Index.prototype.compileToFragments = function(o) {
	      return [].concat(this.makeCode("["), this.index.compileToFragments(o, LEVEL_PAREN), this.makeCode("]"));
	    };

	    Index.prototype.isComplex = function() {
	      return this.index.isComplex();
	    };

	    return Index;

	  })(Base);

	  exports.Range = Range = (function(superClass1) {
	    extend1(Range, superClass1);

	    Range.prototype.children = ['from', 'to'];

	    function Range(from1, to1, tag) {
	      this.from = from1;
	      this.to = to1;
	      this.exclusive = tag === 'exclusive';
	      this.equals = this.exclusive ? '' : '=';
	    }

	    Range.prototype.compileVariables = function(o) {
	      var isComplex, ref3, ref4, ref5, ref6, step;
	      o = merge(o, {
	        top: true
	      });
	      isComplex = del(o, 'isComplex');
	      ref3 = this.cacheToCodeFragments(this.from.cache(o, LEVEL_LIST, isComplex)), this.fromC = ref3[0], this.fromVar = ref3[1];
	      ref4 = this.cacheToCodeFragments(this.to.cache(o, LEVEL_LIST, isComplex)), this.toC = ref4[0], this.toVar = ref4[1];
	      if (step = del(o, 'step')) {
	        ref5 = this.cacheToCodeFragments(step.cache(o, LEVEL_LIST, isComplex)), this.step = ref5[0], this.stepVar = ref5[1];
	      }
	      ref6 = [this.fromVar.match(NUMBER), this.toVar.match(NUMBER)], this.fromNum = ref6[0], this.toNum = ref6[1];
	      if (this.stepVar) {
	        return this.stepNum = this.stepVar.match(NUMBER);
	      }
	    };

	    Range.prototype.compileNode = function(o) {
	      var cond, condPart, from, gt, idx, idxName, known, lt, namedIndex, ref3, ref4, stepPart, to, varPart;
	      if (!this.fromVar) {
	        this.compileVariables(o);
	      }
	      if (!o.index) {
	        return this.compileArray(o);
	      }
	      known = this.fromNum && this.toNum;
	      idx = del(o, 'index');
	      idxName = del(o, 'name');
	      namedIndex = idxName && idxName !== idx;
	      varPart = idx + " = " + this.fromC;
	      if (this.toC !== this.toVar) {
	        varPart += ", " + this.toC;
	      }
	      if (this.step !== this.stepVar) {
	        varPart += ", " + this.step;
	      }
	      ref3 = [idx + " <" + this.equals, idx + " >" + this.equals], lt = ref3[0], gt = ref3[1];
	      condPart = this.stepNum ? parseNum(this.stepNum[0]) > 0 ? lt + " " + this.toVar : gt + " " + this.toVar : known ? ((ref4 = [parseNum(this.fromNum[0]), parseNum(this.toNum[0])], from = ref4[0], to = ref4[1], ref4), from <= to ? lt + " " + to : gt + " " + to) : (cond = this.stepVar ? this.stepVar + " > 0" : this.fromVar + " <= " + this.toVar, cond + " ? " + lt + " " + this.toVar + " : " + gt + " " + this.toVar);
	      stepPart = this.stepVar ? idx + " += " + this.stepVar : known ? namedIndex ? from <= to ? "++" + idx : "--" + idx : from <= to ? idx + "++" : idx + "--" : namedIndex ? cond + " ? ++" + idx + " : --" + idx : cond + " ? " + idx + "++ : " + idx + "--";
	      if (namedIndex) {
	        varPart = idxName + " = " + varPart;
	      }
	      if (namedIndex) {
	        stepPart = idxName + " = " + stepPart;
	      }
	      return [this.makeCode(varPart + "; " + condPart + "; " + stepPart)];
	    };

	    Range.prototype.compileArray = function(o) {
	      var args, body, cond, hasArgs, i, idt, j, post, pre, range, ref3, ref4, result, results, vars;
	      if (this.fromNum && this.toNum && Math.abs(this.fromNum - this.toNum) <= 20) {
	        range = (function() {
	          results = [];
	          for (var j = ref3 = +this.fromNum, ref4 = +this.toNum; ref3 <= ref4 ? j <= ref4 : j >= ref4; ref3 <= ref4 ? j++ : j--){ results.push(j); }
	          return results;
	        }).apply(this);
	        if (this.exclusive) {
	          range.pop();
	        }
	        return [this.makeCode("[" + (range.join(', ')) + "]")];
	      }
	      idt = this.tab + TAB;
	      i = o.scope.freeVariable('i', {
	        single: true
	      });
	      result = o.scope.freeVariable('results');
	      pre = "\n" + idt + result + " = [];";
	      if (this.fromNum && this.toNum) {
	        o.index = i;
	        body = fragmentsToText(this.compileNode(o));
	      } else {
	        vars = (i + " = " + this.fromC) + (this.toC !== this.toVar ? ", " + this.toC : '');
	        cond = this.fromVar + " <= " + this.toVar;
	        body = "var " + vars + "; " + cond + " ? " + i + " <" + this.equals + " " + this.toVar + " : " + i + " >" + this.equals + " " + this.toVar + "; " + cond + " ? " + i + "++ : " + i + "--";
	      }
	      post = "{ " + result + ".push(" + i + "); }\n" + idt + "return " + result + ";\n" + o.indent;
	      hasArgs = function(node) {
	        return node != null ? node.contains(isLiteralArguments) : void 0;
	      };
	      if (hasArgs(this.from) || hasArgs(this.to)) {
	        args = ', arguments';
	      }
	      return [this.makeCode("(function() {" + pre + "\n" + idt + "for (" + body + ")" + post + "}).apply(this" + (args != null ? args : '') + ")")];
	    };

	    return Range;

	  })(Base);

	  exports.Slice = Slice = (function(superClass1) {
	    extend1(Slice, superClass1);

	    Slice.prototype.children = ['range'];

	    function Slice(range1) {
	      this.range = range1;
	      Slice.__super__.constructor.call(this);
	    }

	    Slice.prototype.compileNode = function(o) {
	      var compiled, compiledText, from, fromCompiled, ref3, to, toStr;
	      ref3 = this.range, to = ref3.to, from = ref3.from;
	      fromCompiled = from && from.compileToFragments(o, LEVEL_PAREN) || [this.makeCode('0')];
	      if (to) {
	        compiled = to.compileToFragments(o, LEVEL_PAREN);
	        compiledText = fragmentsToText(compiled);
	        if (!(!this.range.exclusive && +compiledText === -1)) {
	          toStr = ', ' + (this.range.exclusive ? compiledText : SIMPLENUM.test(compiledText) ? "" + (+compiledText + 1) : (compiled = to.compileToFragments(o, LEVEL_ACCESS), "+" + (fragmentsToText(compiled)) + " + 1 || 9e9"));
	        }
	      }
	      return [this.makeCode(".slice(" + (fragmentsToText(fromCompiled)) + (toStr || '') + ")")];
	    };

	    return Slice;

	  })(Base);

	  exports.Obj = Obj = (function(superClass1) {
	    extend1(Obj, superClass1);

	    function Obj(props, generated) {
	      this.generated = generated != null ? generated : false;
	      this.objects = this.properties = props || [];
	    }

	    Obj.prototype.children = ['properties'];

	    Obj.prototype.compileNode = function(o) {
	      var answer, dynamicIndex, hasDynamic, i, idt, indent, j, join, k, key, l, lastNoncom, len1, len2, len3, node, oref, prop, props, ref3, value;
	      props = this.properties;
	      if (this.generated) {
	        for (j = 0, len1 = props.length; j < len1; j++) {
	          node = props[j];
	          if (node instanceof Value) {
	            node.error('cannot have an implicit value in an implicit object');
	          }
	        }
	      }
	      for (dynamicIndex = k = 0, len2 = props.length; k < len2; dynamicIndex = ++k) {
	        prop = props[dynamicIndex];
	        if ((prop.variable || prop).base instanceof Parens) {
	          break;
	        }
	      }
	      hasDynamic = dynamicIndex < props.length;
	      idt = o.indent += TAB;
	      lastNoncom = this.lastNonComment(this.properties);
	      answer = [];
	      if (hasDynamic) {
	        oref = o.scope.freeVariable('obj');
	        answer.push(this.makeCode("(\n" + idt + oref + " = "));
	      }
	      answer.push(this.makeCode("{" + (props.length === 0 || dynamicIndex === 0 ? '}' : '\n')));
	      for (i = l = 0, len3 = props.length; l < len3; i = ++l) {
	        prop = props[i];
	        if (i === dynamicIndex) {
	          if (i !== 0) {
	            answer.push(this.makeCode("\n" + idt + "}"));
	          }
	          answer.push(this.makeCode(',\n'));
	        }
	        join = i === props.length - 1 || i === dynamicIndex - 1 ? '' : prop === lastNoncom || prop instanceof Comment ? '\n' : ',\n';
	        indent = prop instanceof Comment ? '' : idt;
	        if (hasDynamic && i < dynamicIndex) {
	          indent += TAB;
	        }
	        if (prop instanceof Assign) {
	          if (prop.context !== 'object') {
	            prop.operatorToken.error("unexpected " + prop.operatorToken.value);
	          }
	          if (prop.variable instanceof Value && prop.variable.hasProperties()) {
	            prop.variable.error('invalid object key');
	          }
	        }
	        if (prop instanceof Value && prop["this"]) {
	          prop = new Assign(prop.properties[0].name, prop, 'object');
	        }
	        if (!(prop instanceof Comment)) {
	          if (i < dynamicIndex) {
	            if (!(prop instanceof Assign)) {
	              prop = new Assign(prop, prop, 'object');
	            }
	            (prop.variable.base || prop.variable).asKey = true;
	          } else {
	            if (prop instanceof Assign) {
	              key = prop.variable;
	              value = prop.value;
	            } else {
	              ref3 = prop.base.cache(o), key = ref3[0], value = ref3[1];
	            }
	            prop = new Assign(new Value(new Literal(oref), [new Access(key)]), value);
	          }
	        }
	        if (indent) {
	          answer.push(this.makeCode(indent));
	        }
	        answer.push.apply(answer, prop.compileToFragments(o, LEVEL_TOP));
	        if (join) {
	          answer.push(this.makeCode(join));
	        }
	      }
	      if (hasDynamic) {
	        answer.push(this.makeCode(",\n" + idt + oref + "\n" + this.tab + ")"));
	      } else {
	        if (props.length !== 0) {
	          answer.push(this.makeCode("\n" + this.tab + "}"));
	        }
	      }
	      if (this.front && !hasDynamic) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Obj.prototype.assigns = function(name) {
	      var j, len1, prop, ref3;
	      ref3 = this.properties;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        prop = ref3[j];
	        if (prop.assigns(name)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    return Obj;

	  })(Base);

	  exports.Arr = Arr = (function(superClass1) {
	    extend1(Arr, superClass1);

	    function Arr(objs) {
	      this.objects = objs || [];
	    }

	    Arr.prototype.children = ['objects'];

	    Arr.prototype.compileNode = function(o) {
	      var answer, compiledObjs, fragments, index, j, len1, obj;
	      if (!this.objects.length) {
	        return [this.makeCode('[]')];
	      }
	      o.indent += TAB;
	      answer = Splat.compileSplattedArray(o, this.objects);
	      if (answer.length) {
	        return answer;
	      }
	      answer = [];
	      compiledObjs = (function() {
	        var j, len1, ref3, results;
	        ref3 = this.objects;
	        results = [];
	        for (j = 0, len1 = ref3.length; j < len1; j++) {
	          obj = ref3[j];
	          results.push(obj.compileToFragments(o, LEVEL_LIST));
	        }
	        return results;
	      }).call(this);
	      for (index = j = 0, len1 = compiledObjs.length; j < len1; index = ++j) {
	        fragments = compiledObjs[index];
	        if (index) {
	          answer.push(this.makeCode(", "));
	        }
	        answer.push.apply(answer, fragments);
	      }
	      if (fragmentsToText(answer).indexOf('\n') >= 0) {
	        answer.unshift(this.makeCode("[\n" + o.indent));
	        answer.push(this.makeCode("\n" + this.tab + "]"));
	      } else {
	        answer.unshift(this.makeCode("["));
	        answer.push(this.makeCode("]"));
	      }
	      return answer;
	    };

	    Arr.prototype.assigns = function(name) {
	      var j, len1, obj, ref3;
	      ref3 = this.objects;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        obj = ref3[j];
	        if (obj.assigns(name)) {
	          return true;
	        }
	      }
	      return false;
	    };

	    return Arr;

	  })(Base);

	  exports.Class = Class = (function(superClass1) {
	    extend1(Class, superClass1);

	    function Class(variable1, parent1, body1) {
	      this.variable = variable1;
	      this.parent = parent1;
	      this.body = body1 != null ? body1 : new Block;
	      this.boundFuncs = [];
	      this.body.classBody = true;
	    }

	    Class.prototype.children = ['variable', 'parent', 'body'];

	    Class.prototype.determineName = function() {
	      var decl, ref3, tail;
	      if (!this.variable) {
	        return null;
	      }
	      ref3 = this.variable.properties, tail = ref3[ref3.length - 1];
	      decl = tail ? tail instanceof Access && tail.name.value : this.variable.base.value;
	      if (indexOf.call(STRICT_PROSCRIBED, decl) >= 0) {
	        this.variable.error("class variable name may not be " + decl);
	      }
	      return decl && (decl = IDENTIFIER.test(decl) && decl);
	    };

	    Class.prototype.setContext = function(name) {
	      return this.body.traverseChildren(false, function(node) {
	        if (node.classBody) {
	          return false;
	        }
	        if (node instanceof Literal && node.value === 'this') {
	          return node.value = name;
	        } else if (node instanceof Code) {
	          if (node.bound) {
	            return node.context = name;
	          }
	        }
	      });
	    };

	    Class.prototype.addBoundFunctions = function(o) {
	      var bvar, j, len1, lhs, ref3;
	      ref3 = this.boundFuncs;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        bvar = ref3[j];
	        lhs = (new Value(new Literal("this"), [new Access(bvar)])).compile(o);
	        this.ctor.body.unshift(new Literal(lhs + " = " + (utility('bind', o)) + "(" + lhs + ", this)"));
	      }
	    };

	    Class.prototype.addProperties = function(node, name, o) {
	      var acc, assign, base, exprs, func, props;
	      props = node.base.properties.slice(0);
	      exprs = (function() {
	        var results;
	        results = [];
	        while (assign = props.shift()) {
	          if (assign instanceof Assign) {
	            base = assign.variable.base;
	            delete assign.context;
	            func = assign.value;
	            if (base.value === 'constructor') {
	              if (this.ctor) {
	                assign.error('cannot define more than one constructor in a class');
	              }
	              if (func.bound) {
	                assign.error('cannot define a constructor as a bound function');
	              }
	              if (func instanceof Code) {
	                assign = this.ctor = func;
	              } else {
	                this.externalCtor = o.classScope.freeVariable('class');
	                assign = new Assign(new Literal(this.externalCtor), func);
	              }
	            } else {
	              if (assign.variable["this"]) {
	                func["static"] = true;
	              } else {
	                acc = base.isComplex() ? new Index(base) : new Access(base);
	                assign.variable = new Value(new Literal(name), [new Access(new Literal('prototype')), acc]);
	                if (func instanceof Code && func.bound) {
	                  this.boundFuncs.push(base);
	                  func.bound = false;
	                }
	              }
	            }
	          }
	          results.push(assign);
	        }
	        return results;
	      }).call(this);
	      return compact(exprs);
	    };

	    Class.prototype.walkBody = function(name, o) {
	      return this.traverseChildren(false, (function(_this) {
	        return function(child) {
	          var cont, exps, i, j, len1, node, ref3;
	          cont = true;
	          if (child instanceof Class) {
	            return false;
	          }
	          if (child instanceof Block) {
	            ref3 = exps = child.expressions;
	            for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	              node = ref3[i];
	              if (node instanceof Assign && node.variable.looksStatic(name)) {
	                node.value["static"] = true;
	              } else if (node instanceof Value && node.isObject(true)) {
	                cont = false;
	                exps[i] = _this.addProperties(node, name, o);
	              }
	            }
	            child.expressions = exps = flatten(exps);
	          }
	          return cont && !(child instanceof Class);
	        };
	      })(this));
	    };

	    Class.prototype.hoistDirectivePrologue = function() {
	      var expressions, index, node;
	      index = 0;
	      expressions = this.body.expressions;
	      while ((node = expressions[index]) && node instanceof Comment || node instanceof Value && node.isString()) {
	        ++index;
	      }
	      return this.directives = expressions.splice(0, index);
	    };

	    Class.prototype.ensureConstructor = function(name) {
	      if (!this.ctor) {
	        this.ctor = new Code;
	        if (this.externalCtor) {
	          this.ctor.body.push(new Literal(this.externalCtor + ".apply(this, arguments)"));
	        } else if (this.parent) {
	          this.ctor.body.push(new Literal(name + ".__super__.constructor.apply(this, arguments)"));
	        }
	        this.ctor.body.makeReturn();
	        this.body.expressions.unshift(this.ctor);
	      }
	      this.ctor.ctor = this.ctor.name = name;
	      this.ctor.klass = null;
	      return this.ctor.noReturn = true;
	    };

	    Class.prototype.compileNode = function(o) {
	      var args, argumentsNode, func, jumpNode, klass, lname, name, ref3, superClass;
	      if (jumpNode = this.body.jumps()) {
	        jumpNode.error('Class bodies cannot contain pure statements');
	      }
	      if (argumentsNode = this.body.contains(isLiteralArguments)) {
	        argumentsNode.error("Class bodies shouldn't reference arguments");
	      }
	      name = this.determineName() || '_Class';
	      if (name.reserved) {
	        name = "_" + name;
	      }
	      lname = new Literal(name);
	      func = new Code([], Block.wrap([this.body]));
	      args = [];
	      o.classScope = func.makeScope(o.scope);
	      this.hoistDirectivePrologue();
	      this.setContext(name);
	      this.walkBody(name, o);
	      this.ensureConstructor(name);
	      this.addBoundFunctions(o);
	      this.body.spaced = true;
	      this.body.expressions.push(lname);
	      if (this.parent) {
	        superClass = new Literal(o.classScope.freeVariable('superClass', {
	          reserve: false
	        }));
	        this.body.expressions.unshift(new Extends(lname, superClass));
	        func.params.push(new Param(superClass));
	        args.push(this.parent);
	      }
	      (ref3 = this.body.expressions).unshift.apply(ref3, this.directives);
	      klass = new Parens(new Call(func, args));
	      if (this.variable) {
	        klass = new Assign(this.variable, klass);
	      }
	      return klass.compileToFragments(o);
	    };

	    return Class;

	  })(Base);

	  exports.Assign = Assign = (function(superClass1) {
	    extend1(Assign, superClass1);

	    function Assign(variable1, value1, context, options) {
	      var forbidden, name, ref3;
	      this.variable = variable1;
	      this.value = value1;
	      this.context = context;
	      if (options == null) {
	        options = {};
	      }
	      this.param = options.param, this.subpattern = options.subpattern, this.operatorToken = options.operatorToken;
	      forbidden = (ref3 = (name = this.variable.unwrapAll().value), indexOf.call(STRICT_PROSCRIBED, ref3) >= 0);
	      if (forbidden && this.context !== 'object') {
	        this.variable.error("variable name may not be \"" + name + "\"");
	      }
	    }

	    Assign.prototype.children = ['variable', 'value'];

	    Assign.prototype.isStatement = function(o) {
	      return (o != null ? o.level : void 0) === LEVEL_TOP && (this.context != null) && indexOf.call(this.context, "?") >= 0;
	    };

	    Assign.prototype.assigns = function(name) {
	      return this[this.context === 'object' ? 'value' : 'variable'].assigns(name);
	    };

	    Assign.prototype.unfoldSoak = function(o) {
	      return unfoldSoak(o, this, 'variable');
	    };

	    Assign.prototype.compileNode = function(o) {
	      var answer, compiledName, isValue, j, name, properties, prototype, ref3, ref4, ref5, ref6, ref7, val, varBase;
	      if (isValue = this.variable instanceof Value) {
	        if (this.variable.isArray() || this.variable.isObject()) {
	          return this.compilePatternMatch(o);
	        }
	        if (this.variable.isSplice()) {
	          return this.compileSplice(o);
	        }
	        if ((ref3 = this.context) === '||=' || ref3 === '&&=' || ref3 === '?=') {
	          return this.compileConditional(o);
	        }
	        if ((ref4 = this.context) === '**=' || ref4 === '//=' || ref4 === '%%=') {
	          return this.compileSpecialMath(o);
	        }
	      }
	      if (this.value instanceof Code) {
	        if (this.value["static"]) {
	          this.value.klass = this.variable.base;
	          this.value.name = this.variable.properties[0];
	          this.value.variable = this.variable;
	        } else if (((ref5 = this.variable.properties) != null ? ref5.length : void 0) >= 2) {
	          ref6 = this.variable.properties, properties = 3 <= ref6.length ? slice.call(ref6, 0, j = ref6.length - 2) : (j = 0, []), prototype = ref6[j++], name = ref6[j++];
	          if (((ref7 = prototype.name) != null ? ref7.value : void 0) === 'prototype') {
	            this.value.klass = new Value(this.variable.base, properties);
	            this.value.name = name;
	            this.value.variable = this.variable;
	          }
	        }
	      }
	      if (!this.context) {
	        varBase = this.variable.unwrapAll();
	        if (!varBase.isAssignable()) {
	          this.variable.error("\"" + (this.variable.compile(o)) + "\" cannot be assigned");
	        }
	        if (!(typeof varBase.hasProperties === "function" ? varBase.hasProperties() : void 0)) {
	          if (this.param) {
	            o.scope.add(varBase.value, 'var');
	          } else {
	            o.scope.find(varBase.value);
	          }
	        }
	      }
	      val = this.value.compileToFragments(o, LEVEL_LIST);
	      if (isValue && this.variable.base instanceof Obj) {
	        this.variable.front = true;
	      }
	      compiledName = this.variable.compileToFragments(o, LEVEL_LIST);
	      if (this.context === 'object') {
	        return compiledName.concat(this.makeCode(": "), val);
	      }
	      answer = compiledName.concat(this.makeCode(" " + (this.context || '=') + " "), val);
	      if (o.level <= LEVEL_LIST) {
	        return answer;
	      } else {
	        return this.wrapInBraces(answer);
	      }
	    };

	    Assign.prototype.compilePatternMatch = function(o) {
	      var acc, assigns, code, defaultValue, expandedIdx, fragments, i, idx, isObject, ivar, j, len1, name, obj, objects, olen, ref, ref3, ref4, ref5, ref6, ref7, rest, top, val, value, vvar, vvarText;
	      top = o.level === LEVEL_TOP;
	      value = this.value;
	      objects = this.variable.base.objects;
	      if (!(olen = objects.length)) {
	        code = value.compileToFragments(o);
	        if (o.level >= LEVEL_OP) {
	          return this.wrapInBraces(code);
	        } else {
	          return code;
	        }
	      }
	      obj = objects[0];
	      if (olen === 1 && obj instanceof Expansion) {
	        obj.error('Destructuring assignment has no target');
	      }
	      isObject = this.variable.isObject();
	      if (top && olen === 1 && !(obj instanceof Splat)) {
	        defaultValue = null;
	        if (obj instanceof Assign && obj.context === 'object') {
	          ref3 = obj, (ref4 = ref3.variable, idx = ref4.base), obj = ref3.value;
	          if (obj instanceof Assign) {
	            defaultValue = obj.value;
	            obj = obj.variable;
	          }
	        } else {
	          if (obj instanceof Assign) {
	            defaultValue = obj.value;
	            obj = obj.variable;
	          }
	          idx = isObject ? obj["this"] ? obj.properties[0].name : obj : new Literal(0);
	        }
	        acc = IDENTIFIER.test(idx.unwrap().value);
	        value = new Value(value);
	        value.properties.push(new (acc ? Access : Index)(idx));
	        if (ref5 = obj.unwrap().value, indexOf.call(RESERVED, ref5) >= 0) {
	          obj.error("assignment to a reserved word: " + (obj.compile(o)));
	        }
	        if (defaultValue) {
	          value = new Op('?', value, defaultValue);
	        }
	        return new Assign(obj, value, null, {
	          param: this.param
	        }).compileToFragments(o, LEVEL_TOP);
	      }
	      vvar = value.compileToFragments(o, LEVEL_LIST);
	      vvarText = fragmentsToText(vvar);
	      assigns = [];
	      expandedIdx = false;
	      if (!IDENTIFIER.test(vvarText) || this.variable.assigns(vvarText)) {
	        assigns.push([this.makeCode((ref = o.scope.freeVariable('ref')) + " = ")].concat(slice.call(vvar)));
	        vvar = [this.makeCode(ref)];
	        vvarText = ref;
	      }
	      for (i = j = 0, len1 = objects.length; j < len1; i = ++j) {
	        obj = objects[i];
	        idx = i;
	        if (!expandedIdx && obj instanceof Splat) {
	          name = obj.name.unwrap().value;
	          obj = obj.unwrap();
	          val = olen + " <= " + vvarText + ".length ? " + (utility('slice', o)) + ".call(" + vvarText + ", " + i;
	          if (rest = olen - i - 1) {
	            ivar = o.scope.freeVariable('i', {
	              single: true
	            });
	            val += ", " + ivar + " = " + vvarText + ".length - " + rest + ") : (" + ivar + " = " + i + ", [])";
	          } else {
	            val += ") : []";
	          }
	          val = new Literal(val);
	          expandedIdx = ivar + "++";
	        } else if (!expandedIdx && obj instanceof Expansion) {
	          if (rest = olen - i - 1) {
	            if (rest === 1) {
	              expandedIdx = vvarText + ".length - 1";
	            } else {
	              ivar = o.scope.freeVariable('i', {
	                single: true
	              });
	              val = new Literal(ivar + " = " + vvarText + ".length - " + rest);
	              expandedIdx = ivar + "++";
	              assigns.push(val.compileToFragments(o, LEVEL_LIST));
	            }
	          }
	          continue;
	        } else {
	          if (obj instanceof Splat || obj instanceof Expansion) {
	            obj.error("multiple splats/expansions are disallowed in an assignment");
	          }
	          defaultValue = null;
	          if (obj instanceof Assign && obj.context === 'object') {
	            ref6 = obj, (ref7 = ref6.variable, idx = ref7.base), obj = ref6.value;
	            if (obj instanceof Assign) {
	              defaultValue = obj.value;
	              obj = obj.variable;
	            }
	          } else {
	            if (obj instanceof Assign) {
	              defaultValue = obj.value;
	              obj = obj.variable;
	            }
	            idx = isObject ? obj["this"] ? obj.properties[0].name : obj : new Literal(expandedIdx || idx);
	          }
	          name = obj.unwrap().value;
	          acc = IDENTIFIER.test(idx.unwrap().value);
	          val = new Value(new Literal(vvarText), [new (acc ? Access : Index)(idx)]);
	          if (defaultValue) {
	            val = new Op('?', val, defaultValue);
	          }
	        }
	        if ((name != null) && indexOf.call(RESERVED, name) >= 0) {
	          obj.error("assignment to a reserved word: " + (obj.compile(o)));
	        }
	        assigns.push(new Assign(obj, val, null, {
	          param: this.param,
	          subpattern: true
	        }).compileToFragments(o, LEVEL_LIST));
	      }
	      if (!(top || this.subpattern)) {
	        assigns.push(vvar);
	      }
	      fragments = this.joinFragmentArrays(assigns, ', ');
	      if (o.level < LEVEL_LIST) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    Assign.prototype.compileConditional = function(o) {
	      var fragments, left, ref3, right;
	      ref3 = this.variable.cacheReference(o), left = ref3[0], right = ref3[1];
	      if (!left.properties.length && left.base instanceof Literal && left.base.value !== "this" && !o.scope.check(left.base.value)) {
	        this.variable.error("the variable \"" + left.base.value + "\" can't be assigned with " + this.context + " because it has not been declared before");
	      }
	      if (indexOf.call(this.context, "?") >= 0) {
	        o.isExistentialEquals = true;
	        return new If(new Existence(left), right, {
	          type: 'if'
	        }).addElse(new Assign(right, this.value, '=')).compileToFragments(o);
	      } else {
	        fragments = new Op(this.context.slice(0, -1), left, new Assign(right, this.value, '=')).compileToFragments(o);
	        if (o.level <= LEVEL_LIST) {
	          return fragments;
	        } else {
	          return this.wrapInBraces(fragments);
	        }
	      }
	    };

	    Assign.prototype.compileSpecialMath = function(o) {
	      var left, ref3, right;
	      ref3 = this.variable.cacheReference(o), left = ref3[0], right = ref3[1];
	      return new Assign(left, new Op(this.context.slice(0, -1), right, this.value)).compileToFragments(o);
	    };

	    Assign.prototype.compileSplice = function(o) {
	      var answer, exclusive, from, fromDecl, fromRef, name, ref3, ref4, ref5, to, valDef, valRef;
	      ref3 = this.variable.properties.pop().range, from = ref3.from, to = ref3.to, exclusive = ref3.exclusive;
	      name = this.variable.compile(o);
	      if (from) {
	        ref4 = this.cacheToCodeFragments(from.cache(o, LEVEL_OP)), fromDecl = ref4[0], fromRef = ref4[1];
	      } else {
	        fromDecl = fromRef = '0';
	      }
	      if (to) {
	        if (from instanceof Value && from.isSimpleNumber() && to instanceof Value && to.isSimpleNumber()) {
	          to = to.compile(o) - fromRef;
	          if (!exclusive) {
	            to += 1;
	          }
	        } else {
	          to = to.compile(o, LEVEL_ACCESS) + ' - ' + fromRef;
	          if (!exclusive) {
	            to += ' + 1';
	          }
	        }
	      } else {
	        to = "9e9";
	      }
	      ref5 = this.value.cache(o, LEVEL_LIST), valDef = ref5[0], valRef = ref5[1];
	      answer = [].concat(this.makeCode("[].splice.apply(" + name + ", [" + fromDecl + ", " + to + "].concat("), valDef, this.makeCode(")), "), valRef);
	      if (o.level > LEVEL_TOP) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    return Assign;

	  })(Base);

	  exports.Code = Code = (function(superClass1) {
	    extend1(Code, superClass1);

	    function Code(params, body, tag) {
	      this.params = params || [];
	      this.body = body || new Block;
	      this.bound = tag === 'boundfunc';
	      this.isGenerator = !!this.body.contains(function(node) {
	        var ref3;
	        return node instanceof Op && ((ref3 = node.operator) === 'yield' || ref3 === 'yield*');
	      });
	    }

	    Code.prototype.children = ['params', 'body'];

	    Code.prototype.isStatement = function() {
	      return !!this.ctor;
	    };

	    Code.prototype.jumps = NO;

	    Code.prototype.makeScope = function(parentScope) {
	      return new Scope(parentScope, this.body, this);
	    };

	    Code.prototype.compileNode = function(o) {
	      var answer, boundfunc, code, exprs, i, j, k, l, len1, len2, len3, len4, len5, len6, lit, m, p, param, params, q, r, ref, ref3, ref4, ref5, ref6, ref7, ref8, splats, uniqs, val, wasEmpty, wrapper;
	      if (this.bound && ((ref3 = o.scope.method) != null ? ref3.bound : void 0)) {
	        this.context = o.scope.method.context;
	      }
	      if (this.bound && !this.context) {
	        this.context = '_this';
	        wrapper = new Code([new Param(new Literal(this.context))], new Block([this]));
	        boundfunc = new Call(wrapper, [new Literal('this')]);
	        boundfunc.updateLocationDataIfMissing(this.locationData);
	        return boundfunc.compileNode(o);
	      }
	      o.scope = del(o, 'classScope') || this.makeScope(o.scope);
	      o.scope.shared = del(o, 'sharedScope');
	      o.indent += TAB;
	      delete o.bare;
	      delete o.isExistentialEquals;
	      params = [];
	      exprs = [];
	      ref4 = this.params;
	      for (j = 0, len1 = ref4.length; j < len1; j++) {
	        param = ref4[j];
	        if (!(param instanceof Expansion)) {
	          o.scope.parameter(param.asReference(o));
	        }
	      }
	      ref5 = this.params;
	      for (k = 0, len2 = ref5.length; k < len2; k++) {
	        param = ref5[k];
	        if (!(param.splat || param instanceof Expansion)) {
	          continue;
	        }
	        ref6 = this.params;
	        for (l = 0, len3 = ref6.length; l < len3; l++) {
	          p = ref6[l];
	          if (!(p instanceof Expansion) && p.name.value) {
	            o.scope.add(p.name.value, 'var', true);
	          }
	        }
	        splats = new Assign(new Value(new Arr((function() {
	          var len4, m, ref7, results;
	          ref7 = this.params;
	          results = [];
	          for (m = 0, len4 = ref7.length; m < len4; m++) {
	            p = ref7[m];
	            results.push(p.asReference(o));
	          }
	          return results;
	        }).call(this))), new Value(new Literal('arguments')));
	        break;
	      }
	      ref7 = this.params;
	      for (m = 0, len4 = ref7.length; m < len4; m++) {
	        param = ref7[m];
	        if (param.isComplex()) {
	          val = ref = param.asReference(o);
	          if (param.value) {
	            val = new Op('?', ref, param.value);
	          }
	          exprs.push(new Assign(new Value(param.name), val, '=', {
	            param: true
	          }));
	        } else {
	          ref = param;
	          if (param.value) {
	            lit = new Literal(ref.name.value + ' == null');
	            val = new Assign(new Value(param.name), param.value, '=');
	            exprs.push(new If(lit, val));
	          }
	        }
	        if (!splats) {
	          params.push(ref);
	        }
	      }
	      wasEmpty = this.body.isEmpty();
	      if (splats) {
	        exprs.unshift(splats);
	      }
	      if (exprs.length) {
	        (ref8 = this.body.expressions).unshift.apply(ref8, exprs);
	      }
	      for (i = q = 0, len5 = params.length; q < len5; i = ++q) {
	        p = params[i];
	        params[i] = p.compileToFragments(o);
	        o.scope.parameter(fragmentsToText(params[i]));
	      }
	      uniqs = [];
	      this.eachParamName(function(name, node) {
	        if (indexOf.call(uniqs, name) >= 0) {
	          node.error("multiple parameters named " + name);
	        }
	        return uniqs.push(name);
	      });
	      if (!(wasEmpty || this.noReturn)) {
	        this.body.makeReturn();
	      }
	      code = 'function';
	      if (this.isGenerator) {
	        code += '*';
	      }
	      if (this.ctor) {
	        code += ' ' + this.name;
	      }
	      code += '(';
	      answer = [this.makeCode(code)];
	      for (i = r = 0, len6 = params.length; r < len6; i = ++r) {
	        p = params[i];
	        if (i) {
	          answer.push(this.makeCode(", "));
	        }
	        answer.push.apply(answer, p);
	      }
	      answer.push(this.makeCode(') {'));
	      if (!this.body.isEmpty()) {
	        answer = answer.concat(this.makeCode("\n"), this.body.compileWithDeclarations(o), this.makeCode("\n" + this.tab));
	      }
	      answer.push(this.makeCode('}'));
	      if (this.ctor) {
	        return [this.makeCode(this.tab)].concat(slice.call(answer));
	      }
	      if (this.front || (o.level >= LEVEL_ACCESS)) {
	        return this.wrapInBraces(answer);
	      } else {
	        return answer;
	      }
	    };

	    Code.prototype.eachParamName = function(iterator) {
	      var j, len1, param, ref3, results;
	      ref3 = this.params;
	      results = [];
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        param = ref3[j];
	        results.push(param.eachName(iterator));
	      }
	      return results;
	    };

	    Code.prototype.traverseChildren = function(crossScope, func) {
	      if (crossScope) {
	        return Code.__super__.traverseChildren.call(this, crossScope, func);
	      }
	    };

	    return Code;

	  })(Base);

	  exports.Param = Param = (function(superClass1) {
	    extend1(Param, superClass1);

	    function Param(name1, value1, splat) {
	      var name, ref3, token;
	      this.name = name1;
	      this.value = value1;
	      this.splat = splat;
	      if (ref3 = (name = this.name.unwrapAll().value), indexOf.call(STRICT_PROSCRIBED, ref3) >= 0) {
	        this.name.error("parameter name \"" + name + "\" is not allowed");
	      }
	      if (this.name instanceof Obj && this.name.generated) {
	        token = this.name.objects[0].operatorToken;
	        token.error("unexpected " + token.value);
	      }
	    }

	    Param.prototype.children = ['name', 'value'];

	    Param.prototype.compileToFragments = function(o) {
	      return this.name.compileToFragments(o, LEVEL_LIST);
	    };

	    Param.prototype.asReference = function(o) {
	      var name, node;
	      if (this.reference) {
	        return this.reference;
	      }
	      node = this.name;
	      if (node["this"]) {
	        name = node.properties[0].name.value;
	        if (name.reserved) {
	          name = "_" + name;
	        }
	        node = new Literal(o.scope.freeVariable(name));
	      } else if (node.isComplex()) {
	        node = new Literal(o.scope.freeVariable('arg'));
	      }
	      node = new Value(node);
	      if (this.splat) {
	        node = new Splat(node);
	      }
	      node.updateLocationDataIfMissing(this.locationData);
	      return this.reference = node;
	    };

	    Param.prototype.isComplex = function() {
	      return this.name.isComplex();
	    };

	    Param.prototype.eachName = function(iterator, name) {
	      var atParam, j, len1, node, obj, ref3;
	      if (name == null) {
	        name = this.name;
	      }
	      atParam = function(obj) {
	        return iterator("@" + obj.properties[0].name.value, obj);
	      };
	      if (name instanceof Literal) {
	        return iterator(name.value, name);
	      }
	      if (name instanceof Value) {
	        return atParam(name);
	      }
	      ref3 = name.objects;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        obj = ref3[j];
	        if (obj instanceof Assign && (obj.context == null)) {
	          obj = obj.variable;
	        }
	        if (obj instanceof Assign) {
	          this.eachName(iterator, obj.value.unwrap());
	        } else if (obj instanceof Splat) {
	          node = obj.name.unwrap();
	          iterator(node.value, node);
	        } else if (obj instanceof Value) {
	          if (obj.isArray() || obj.isObject()) {
	            this.eachName(iterator, obj.base);
	          } else if (obj["this"]) {
	            atParam(obj);
	          } else {
	            iterator(obj.base.value, obj.base);
	          }
	        } else if (!(obj instanceof Expansion)) {
	          obj.error("illegal parameter " + (obj.compile()));
	        }
	      }
	    };

	    return Param;

	  })(Base);

	  exports.Splat = Splat = (function(superClass1) {
	    extend1(Splat, superClass1);

	    Splat.prototype.children = ['name'];

	    Splat.prototype.isAssignable = YES;

	    function Splat(name) {
	      this.name = name.compile ? name : new Literal(name);
	    }

	    Splat.prototype.assigns = function(name) {
	      return this.name.assigns(name);
	    };

	    Splat.prototype.compileToFragments = function(o) {
	      return this.name.compileToFragments(o);
	    };

	    Splat.prototype.unwrap = function() {
	      return this.name;
	    };

	    Splat.compileSplattedArray = function(o, list, apply) {
	      var args, base, compiledNode, concatPart, fragments, i, index, j, last, len1, node;
	      index = -1;
	      while ((node = list[++index]) && !(node instanceof Splat)) {
	        continue;
	      }
	      if (index >= list.length) {
	        return [];
	      }
	      if (list.length === 1) {
	        node = list[0];
	        fragments = node.compileToFragments(o, LEVEL_LIST);
	        if (apply) {
	          return fragments;
	        }
	        return [].concat(node.makeCode((utility('slice', o)) + ".call("), fragments, node.makeCode(")"));
	      }
	      args = list.slice(index);
	      for (i = j = 0, len1 = args.length; j < len1; i = ++j) {
	        node = args[i];
	        compiledNode = node.compileToFragments(o, LEVEL_LIST);
	        args[i] = node instanceof Splat ? [].concat(node.makeCode((utility('slice', o)) + ".call("), compiledNode, node.makeCode(")")) : [].concat(node.makeCode("["), compiledNode, node.makeCode("]"));
	      }
	      if (index === 0) {
	        node = list[0];
	        concatPart = node.joinFragmentArrays(args.slice(1), ', ');
	        return args[0].concat(node.makeCode(".concat("), concatPart, node.makeCode(")"));
	      }
	      base = (function() {
	        var k, len2, ref3, results;
	        ref3 = list.slice(0, index);
	        results = [];
	        for (k = 0, len2 = ref3.length; k < len2; k++) {
	          node = ref3[k];
	          results.push(node.compileToFragments(o, LEVEL_LIST));
	        }
	        return results;
	      })();
	      base = list[0].joinFragmentArrays(base, ', ');
	      concatPart = list[index].joinFragmentArrays(args, ', ');
	      last = list[list.length - 1];
	      return [].concat(list[0].makeCode("["), base, list[index].makeCode("].concat("), concatPart, last.makeCode(")"));
	    };

	    return Splat;

	  })(Base);

	  exports.Expansion = Expansion = (function(superClass1) {
	    extend1(Expansion, superClass1);

	    function Expansion() {
	      return Expansion.__super__.constructor.apply(this, arguments);
	    }

	    Expansion.prototype.isComplex = NO;

	    Expansion.prototype.compileNode = function(o) {
	      return this.error('Expansion must be used inside a destructuring assignment or parameter list');
	    };

	    Expansion.prototype.asReference = function(o) {
	      return this;
	    };

	    Expansion.prototype.eachName = function(iterator) {};

	    return Expansion;

	  })(Base);

	  exports.While = While = (function(superClass1) {
	    extend1(While, superClass1);

	    function While(condition, options) {
	      this.condition = (options != null ? options.invert : void 0) ? condition.invert() : condition;
	      this.guard = options != null ? options.guard : void 0;
	    }

	    While.prototype.children = ['condition', 'guard', 'body'];

	    While.prototype.isStatement = YES;

	    While.prototype.makeReturn = function(res) {
	      if (res) {
	        return While.__super__.makeReturn.apply(this, arguments);
	      } else {
	        this.returns = !this.jumps({
	          loop: true
	        });
	        return this;
	      }
	    };

	    While.prototype.addBody = function(body1) {
	      this.body = body1;
	      return this;
	    };

	    While.prototype.jumps = function() {
	      var expressions, j, jumpNode, len1, node;
	      expressions = this.body.expressions;
	      if (!expressions.length) {
	        return false;
	      }
	      for (j = 0, len1 = expressions.length; j < len1; j++) {
	        node = expressions[j];
	        if (jumpNode = node.jumps({
	          loop: true
	        })) {
	          return jumpNode;
	        }
	      }
	      return false;
	    };

	    While.prototype.compileNode = function(o) {
	      var answer, body, rvar, set;
	      o.indent += TAB;
	      set = '';
	      body = this.body;
	      if (body.isEmpty()) {
	        body = this.makeCode('');
	      } else {
	        if (this.returns) {
	          body.makeReturn(rvar = o.scope.freeVariable('results'));
	          set = "" + this.tab + rvar + " = [];\n";
	        }
	        if (this.guard) {
	          if (body.expressions.length > 1) {
	            body.expressions.unshift(new If((new Parens(this.guard)).invert(), new Literal("continue")));
	          } else {
	            if (this.guard) {
	              body = Block.wrap([new If(this.guard, body)]);
	            }
	          }
	        }
	        body = [].concat(this.makeCode("\n"), body.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab));
	      }
	      answer = [].concat(this.makeCode(set + this.tab + "while ("), this.condition.compileToFragments(o, LEVEL_PAREN), this.makeCode(") {"), body, this.makeCode("}"));
	      if (this.returns) {
	        answer.push(this.makeCode("\n" + this.tab + "return " + rvar + ";"));
	      }
	      return answer;
	    };

	    return While;

	  })(Base);

	  exports.Op = Op = (function(superClass1) {
	    var CONVERSIONS, INVERSIONS;

	    extend1(Op, superClass1);

	    function Op(op, first, second, flip) {
	      if (op === 'in') {
	        return new In(first, second);
	      }
	      if (op === 'do') {
	        return this.generateDo(first);
	      }
	      if (op === 'new') {
	        if (first instanceof Call && !first["do"] && !first.isNew) {
	          return first.newInstance();
	        }
	        if (first instanceof Code && first.bound || first["do"]) {
	          first = new Parens(first);
	        }
	      }
	      this.operator = CONVERSIONS[op] || op;
	      this.first = first;
	      this.second = second;
	      this.flip = !!flip;
	      return this;
	    }

	    CONVERSIONS = {
	      '==': '===',
	      '!=': '!==',
	      'of': 'in',
	      'yieldfrom': 'yield*'
	    };

	    INVERSIONS = {
	      '!==': '===',
	      '===': '!=='
	    };

	    Op.prototype.children = ['first', 'second'];

	    Op.prototype.isSimpleNumber = NO;

	    Op.prototype.isYield = function() {
	      var ref3;
	      return (ref3 = this.operator) === 'yield' || ref3 === 'yield*';
	    };

	    Op.prototype.isYieldReturn = function() {
	      return this.isYield() && this.first instanceof Return;
	    };

	    Op.prototype.isUnary = function() {
	      return !this.second;
	    };

	    Op.prototype.isComplex = function() {
	      var ref3;
	      return !(this.isUnary() && ((ref3 = this.operator) === '+' || ref3 === '-') && this.first instanceof Value && this.first.isSimpleNumber());
	    };

	    Op.prototype.isChainable = function() {
	      var ref3;
	      return (ref3 = this.operator) === '<' || ref3 === '>' || ref3 === '>=' || ref3 === '<=' || ref3 === '===' || ref3 === '!==';
	    };

	    Op.prototype.invert = function() {
	      var allInvertable, curr, fst, op, ref3;
	      if (this.isChainable() && this.first.isChainable()) {
	        allInvertable = true;
	        curr = this;
	        while (curr && curr.operator) {
	          allInvertable && (allInvertable = curr.operator in INVERSIONS);
	          curr = curr.first;
	        }
	        if (!allInvertable) {
	          return new Parens(this).invert();
	        }
	        curr = this;
	        while (curr && curr.operator) {
	          curr.invert = !curr.invert;
	          curr.operator = INVERSIONS[curr.operator];
	          curr = curr.first;
	        }
	        return this;
	      } else if (op = INVERSIONS[this.operator]) {
	        this.operator = op;
	        if (this.first.unwrap() instanceof Op) {
	          this.first.invert();
	        }
	        return this;
	      } else if (this.second) {
	        return new Parens(this).invert();
	      } else if (this.operator === '!' && (fst = this.first.unwrap()) instanceof Op && ((ref3 = fst.operator) === '!' || ref3 === 'in' || ref3 === 'instanceof')) {
	        return fst;
	      } else {
	        return new Op('!', this);
	      }
	    };

	    Op.prototype.unfoldSoak = function(o) {
	      var ref3;
	      return ((ref3 = this.operator) === '++' || ref3 === '--' || ref3 === 'delete') && unfoldSoak(o, this, 'first');
	    };

	    Op.prototype.generateDo = function(exp) {
	      var call, func, j, len1, param, passedParams, ref, ref3;
	      passedParams = [];
	      func = exp instanceof Assign && (ref = exp.value.unwrap()) instanceof Code ? ref : exp;
	      ref3 = func.params || [];
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        param = ref3[j];
	        if (param.value) {
	          passedParams.push(param.value);
	          delete param.value;
	        } else {
	          passedParams.push(param);
	        }
	      }
	      call = new Call(exp, passedParams);
	      call["do"] = true;
	      return call;
	    };

	    Op.prototype.compileNode = function(o) {
	      var answer, isChain, lhs, ref3, ref4, rhs;
	      isChain = this.isChainable() && this.first.isChainable();
	      if (!isChain) {
	        this.first.front = this.front;
	      }
	      if (this.operator === 'delete' && o.scope.check(this.first.unwrapAll().value)) {
	        this.error('delete operand may not be argument or var');
	      }
	      if (((ref3 = this.operator) === '--' || ref3 === '++') && (ref4 = this.first.unwrapAll().value, indexOf.call(STRICT_PROSCRIBED, ref4) >= 0)) {
	        this.error("cannot increment/decrement \"" + (this.first.unwrapAll().value) + "\"");
	      }
	      if (this.isYield()) {
	        return this.compileYield(o);
	      }
	      if (this.isUnary()) {
	        return this.compileUnary(o);
	      }
	      if (isChain) {
	        return this.compileChain(o);
	      }
	      switch (this.operator) {
	        case '?':
	          return this.compileExistence(o);
	        case '**':
	          return this.compilePower(o);
	        case '//':
	          return this.compileFloorDivision(o);
	        case '%%':
	          return this.compileModulo(o);
	        default:
	          lhs = this.first.compileToFragments(o, LEVEL_OP);
	          rhs = this.second.compileToFragments(o, LEVEL_OP);
	          answer = [].concat(lhs, this.makeCode(" " + this.operator + " "), rhs);
	          if (o.level <= LEVEL_OP) {
	            return answer;
	          } else {
	            return this.wrapInBraces(answer);
	          }
	      }
	    };

	    Op.prototype.compileChain = function(o) {
	      var fragments, fst, ref3, shared;
	      ref3 = this.first.second.cache(o), this.first.second = ref3[0], shared = ref3[1];
	      fst = this.first.compileToFragments(o, LEVEL_OP);
	      fragments = fst.concat(this.makeCode(" " + (this.invert ? '&&' : '||') + " "), shared.compileToFragments(o), this.makeCode(" " + this.operator + " "), this.second.compileToFragments(o, LEVEL_OP));
	      return this.wrapInBraces(fragments);
	    };

	    Op.prototype.compileExistence = function(o) {
	      var fst, ref;
	      if (this.first.isComplex()) {
	        ref = new Literal(o.scope.freeVariable('ref'));
	        fst = new Parens(new Assign(ref, this.first));
	      } else {
	        fst = this.first;
	        ref = fst;
	      }
	      return new If(new Existence(fst), ref, {
	        type: 'if'
	      }).addElse(this.second).compileToFragments(o);
	    };

	    Op.prototype.compileUnary = function(o) {
	      var op, parts, plusMinus;
	      parts = [];
	      op = this.operator;
	      parts.push([this.makeCode(op)]);
	      if (op === '!' && this.first instanceof Existence) {
	        this.first.negated = !this.first.negated;
	        return this.first.compileToFragments(o);
	      }
	      if (o.level >= LEVEL_ACCESS) {
	        return (new Parens(this)).compileToFragments(o);
	      }
	      plusMinus = op === '+' || op === '-';
	      if ((op === 'new' || op === 'typeof' || op === 'delete') || plusMinus && this.first instanceof Op && this.first.operator === op) {
	        parts.push([this.makeCode(' ')]);
	      }
	      if ((plusMinus && this.first instanceof Op) || (op === 'new' && this.first.isStatement(o))) {
	        this.first = new Parens(this.first);
	      }
	      parts.push(this.first.compileToFragments(o, LEVEL_OP));
	      if (this.flip) {
	        parts.reverse();
	      }
	      return this.joinFragmentArrays(parts, '');
	    };

	    Op.prototype.compileYield = function(o) {
	      var op, parts;
	      parts = [];
	      op = this.operator;
	      if (o.scope.parent == null) {
	        this.error('yield statements must occur within a function generator.');
	      }
	      if (indexOf.call(Object.keys(this.first), 'expression') >= 0 && !(this.first instanceof Throw)) {
	        if (this.isYieldReturn()) {
	          parts.push(this.first.compileToFragments(o, LEVEL_TOP));
	        } else if (this.first.expression != null) {
	          parts.push(this.first.expression.compileToFragments(o, LEVEL_OP));
	        }
	      } else {
	        parts.push([this.makeCode("(" + op + " ")]);
	        parts.push(this.first.compileToFragments(o, LEVEL_OP));
	        parts.push([this.makeCode(")")]);
	      }
	      return this.joinFragmentArrays(parts, '');
	    };

	    Op.prototype.compilePower = function(o) {
	      var pow;
	      pow = new Value(new Literal('Math'), [new Access(new Literal('pow'))]);
	      return new Call(pow, [this.first, this.second]).compileToFragments(o);
	    };

	    Op.prototype.compileFloorDivision = function(o) {
	      var div, floor;
	      floor = new Value(new Literal('Math'), [new Access(new Literal('floor'))]);
	      div = new Op('/', this.first, this.second);
	      return new Call(floor, [div]).compileToFragments(o);
	    };

	    Op.prototype.compileModulo = function(o) {
	      var mod;
	      mod = new Value(new Literal(utility('modulo', o)));
	      return new Call(mod, [this.first, this.second]).compileToFragments(o);
	    };

	    Op.prototype.toString = function(idt) {
	      return Op.__super__.toString.call(this, idt, this.constructor.name + ' ' + this.operator);
	    };

	    return Op;

	  })(Base);

	  exports.In = In = (function(superClass1) {
	    extend1(In, superClass1);

	    function In(object, array) {
	      this.object = object;
	      this.array = array;
	    }

	    In.prototype.children = ['object', 'array'];

	    In.prototype.invert = NEGATE;

	    In.prototype.compileNode = function(o) {
	      var hasSplat, j, len1, obj, ref3;
	      if (this.array instanceof Value && this.array.isArray() && this.array.base.objects.length) {
	        ref3 = this.array.base.objects;
	        for (j = 0, len1 = ref3.length; j < len1; j++) {
	          obj = ref3[j];
	          if (!(obj instanceof Splat)) {
	            continue;
	          }
	          hasSplat = true;
	          break;
	        }
	        if (!hasSplat) {
	          return this.compileOrTest(o);
	        }
	      }
	      return this.compileLoopTest(o);
	    };

	    In.prototype.compileOrTest = function(o) {
	      var cmp, cnj, i, item, j, len1, ref, ref3, ref4, ref5, sub, tests;
	      ref3 = this.object.cache(o, LEVEL_OP), sub = ref3[0], ref = ref3[1];
	      ref4 = this.negated ? [' !== ', ' && '] : [' === ', ' || '], cmp = ref4[0], cnj = ref4[1];
	      tests = [];
	      ref5 = this.array.base.objects;
	      for (i = j = 0, len1 = ref5.length; j < len1; i = ++j) {
	        item = ref5[i];
	        if (i) {
	          tests.push(this.makeCode(cnj));
	        }
	        tests = tests.concat((i ? ref : sub), this.makeCode(cmp), item.compileToFragments(o, LEVEL_ACCESS));
	      }
	      if (o.level < LEVEL_OP) {
	        return tests;
	      } else {
	        return this.wrapInBraces(tests);
	      }
	    };

	    In.prototype.compileLoopTest = function(o) {
	      var fragments, ref, ref3, sub;
	      ref3 = this.object.cache(o, LEVEL_LIST), sub = ref3[0], ref = ref3[1];
	      fragments = [].concat(this.makeCode(utility('indexOf', o) + ".call("), this.array.compileToFragments(o, LEVEL_LIST), this.makeCode(", "), ref, this.makeCode(") " + (this.negated ? '< 0' : '>= 0')));
	      if (fragmentsToText(sub) === fragmentsToText(ref)) {
	        return fragments;
	      }
	      fragments = sub.concat(this.makeCode(', '), fragments);
	      if (o.level < LEVEL_LIST) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    In.prototype.toString = function(idt) {
	      return In.__super__.toString.call(this, idt, this.constructor.name + (this.negated ? '!' : ''));
	    };

	    return In;

	  })(Base);

	  exports.Try = Try = (function(superClass1) {
	    extend1(Try, superClass1);

	    function Try(attempt, errorVariable, recovery, ensure) {
	      this.attempt = attempt;
	      this.errorVariable = errorVariable;
	      this.recovery = recovery;
	      this.ensure = ensure;
	    }

	    Try.prototype.children = ['attempt', 'recovery', 'ensure'];

	    Try.prototype.isStatement = YES;

	    Try.prototype.jumps = function(o) {
	      var ref3;
	      return this.attempt.jumps(o) || ((ref3 = this.recovery) != null ? ref3.jumps(o) : void 0);
	    };

	    Try.prototype.makeReturn = function(res) {
	      if (this.attempt) {
	        this.attempt = this.attempt.makeReturn(res);
	      }
	      if (this.recovery) {
	        this.recovery = this.recovery.makeReturn(res);
	      }
	      return this;
	    };

	    Try.prototype.compileNode = function(o) {
	      var catchPart, ensurePart, generatedErrorVariableName, placeholder, tryPart;
	      o.indent += TAB;
	      tryPart = this.attempt.compileToFragments(o, LEVEL_TOP);
	      catchPart = this.recovery ? (generatedErrorVariableName = o.scope.freeVariable('error'), placeholder = new Literal(generatedErrorVariableName), this.errorVariable ? this.recovery.unshift(new Assign(this.errorVariable, placeholder)) : void 0, [].concat(this.makeCode(" catch ("), placeholder.compileToFragments(o), this.makeCode(") {\n"), this.recovery.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab + "}"))) : !(this.ensure || this.recovery) ? [this.makeCode(" catch (" + generatedErrorVariableName + ") {}")] : [];
	      ensurePart = this.ensure ? [].concat(this.makeCode(" finally {\n"), this.ensure.compileToFragments(o, LEVEL_TOP), this.makeCode("\n" + this.tab + "}")) : [];
	      return [].concat(this.makeCode(this.tab + "try {\n"), tryPart, this.makeCode("\n" + this.tab + "}"), catchPart, ensurePart);
	    };

	    return Try;

	  })(Base);

	  exports.Throw = Throw = (function(superClass1) {
	    extend1(Throw, superClass1);

	    function Throw(expression) {
	      this.expression = expression;
	    }

	    Throw.prototype.children = ['expression'];

	    Throw.prototype.isStatement = YES;

	    Throw.prototype.jumps = NO;

	    Throw.prototype.makeReturn = THIS;

	    Throw.prototype.compileNode = function(o) {
	      return [].concat(this.makeCode(this.tab + "throw "), this.expression.compileToFragments(o), this.makeCode(";"));
	    };

	    return Throw;

	  })(Base);

	  exports.Existence = Existence = (function(superClass1) {
	    extend1(Existence, superClass1);

	    function Existence(expression) {
	      this.expression = expression;
	    }

	    Existence.prototype.children = ['expression'];

	    Existence.prototype.invert = NEGATE;

	    Existence.prototype.compileNode = function(o) {
	      var cmp, cnj, code, ref3;
	      this.expression.front = this.front;
	      code = this.expression.compile(o, LEVEL_OP);
	      if (IDENTIFIER.test(code) && !o.scope.check(code)) {
	        ref3 = this.negated ? ['===', '||'] : ['!==', '&&'], cmp = ref3[0], cnj = ref3[1];
	        code = "typeof " + code + " " + cmp + " \"undefined\" " + cnj + " " + code + " " + cmp + " null";
	      } else {
	        code = code + " " + (this.negated ? '==' : '!=') + " null";
	      }
	      return [this.makeCode(o.level <= LEVEL_COND ? code : "(" + code + ")")];
	    };

	    return Existence;

	  })(Base);

	  exports.Parens = Parens = (function(superClass1) {
	    extend1(Parens, superClass1);

	    function Parens(body1) {
	      this.body = body1;
	    }

	    Parens.prototype.children = ['body'];

	    Parens.prototype.unwrap = function() {
	      return this.body;
	    };

	    Parens.prototype.isComplex = function() {
	      return this.body.isComplex();
	    };

	    Parens.prototype.compileNode = function(o) {
	      var bare, expr, fragments;
	      expr = this.body.unwrap();
	      if (expr instanceof Value && expr.isAtomic()) {
	        expr.front = this.front;
	        return expr.compileToFragments(o);
	      }
	      fragments = expr.compileToFragments(o, LEVEL_PAREN);
	      bare = o.level < LEVEL_OP && (expr instanceof Op || expr instanceof Call || (expr instanceof For && expr.returns));
	      if (bare) {
	        return fragments;
	      } else {
	        return this.wrapInBraces(fragments);
	      }
	    };

	    return Parens;

	  })(Base);

	  exports.For = For = (function(superClass1) {
	    extend1(For, superClass1);

	    function For(body, source) {
	      var ref3;
	      this.source = source.source, this.guard = source.guard, this.step = source.step, this.name = source.name, this.index = source.index;
	      this.body = Block.wrap([body]);
	      this.own = !!source.own;
	      this.object = !!source.object;
	      if (this.object) {
	        ref3 = [this.index, this.name], this.name = ref3[0], this.index = ref3[1];
	      }
	      if (this.index instanceof Value) {
	        this.index.error('index cannot be a pattern matching expression');
	      }
	      this.range = this.source instanceof Value && this.source.base instanceof Range && !this.source.properties.length;
	      this.pattern = this.name instanceof Value;
	      if (this.range && this.index) {
	        this.index.error('indexes do not apply to range loops');
	      }
	      if (this.range && this.pattern) {
	        this.name.error('cannot pattern match over range loops');
	      }
	      if (this.own && !this.object) {
	        this.name.error('cannot use own with for-in');
	      }
	      this.returns = false;
	    }

	    For.prototype.children = ['body', 'source', 'guard', 'step'];

	    For.prototype.compileNode = function(o) {
	      var body, bodyFragments, compare, compareDown, declare, declareDown, defPart, defPartFragments, down, forPartFragments, guardPart, idt1, increment, index, ivar, kvar, kvarAssign, last, lvar, name, namePart, ref, ref3, ref4, resultPart, returnResult, rvar, scope, source, step, stepNum, stepVar, svar, varPart;
	      body = Block.wrap([this.body]);
	      ref3 = body.expressions, last = ref3[ref3.length - 1];
	      if ((last != null ? last.jumps() : void 0) instanceof Return) {
	        this.returns = false;
	      }
	      source = this.range ? this.source.base : this.source;
	      scope = o.scope;
	      if (!this.pattern) {
	        name = this.name && (this.name.compile(o, LEVEL_LIST));
	      }
	      index = this.index && (this.index.compile(o, LEVEL_LIST));
	      if (name && !this.pattern) {
	        scope.find(name);
	      }
	      if (index) {
	        scope.find(index);
	      }
	      if (this.returns) {
	        rvar = scope.freeVariable('results');
	      }
	      ivar = (this.object && index) || scope.freeVariable('i', {
	        single: true
	      });
	      kvar = (this.range && name) || index || ivar;
	      kvarAssign = kvar !== ivar ? kvar + " = " : "";
	      if (this.step && !this.range) {
	        ref4 = this.cacheToCodeFragments(this.step.cache(o, LEVEL_LIST, isComplexOrAssignable)), step = ref4[0], stepVar = ref4[1];
	        stepNum = stepVar.match(NUMBER);
	      }
	      if (this.pattern) {
	        name = ivar;
	      }
	      varPart = '';
	      guardPart = '';
	      defPart = '';
	      idt1 = this.tab + TAB;
	      if (this.range) {
	        forPartFragments = source.compileToFragments(merge(o, {
	          index: ivar,
	          name: name,
	          step: this.step,
	          isComplex: isComplexOrAssignable
	        }));
	      } else {
	        svar = this.source.compile(o, LEVEL_LIST);
	        if ((name || this.own) && !IDENTIFIER.test(svar)) {
	          defPart += "" + this.tab + (ref = scope.freeVariable('ref')) + " = " + svar + ";\n";
	          svar = ref;
	        }
	        if (name && !this.pattern) {
	          namePart = name + " = " + svar + "[" + kvar + "]";
	        }
	        if (!this.object) {
	          if (step !== stepVar) {
	            defPart += "" + this.tab + step + ";\n";
	          }
	          if (!(this.step && stepNum && (down = parseNum(stepNum[0]) < 0))) {
	            lvar = scope.freeVariable('len');
	          }
	          declare = "" + kvarAssign + ivar + " = 0, " + lvar + " = " + svar + ".length";
	          declareDown = "" + kvarAssign + ivar + " = " + svar + ".length - 1";
	          compare = ivar + " < " + lvar;
	          compareDown = ivar + " >= 0";
	          if (this.step) {
	            if (stepNum) {
	              if (down) {
	                compare = compareDown;
	                declare = declareDown;
	              }
	            } else {
	              compare = stepVar + " > 0 ? " + compare + " : " + compareDown;
	              declare = "(" + stepVar + " > 0 ? (" + declare + ") : " + declareDown + ")";
	            }
	            increment = ivar + " += " + stepVar;
	          } else {
	            increment = "" + (kvar !== ivar ? "++" + ivar : ivar + "++");
	          }
	          forPartFragments = [this.makeCode(declare + "; " + compare + "; " + kvarAssign + increment)];
	        }
	      }
	      if (this.returns) {
	        resultPart = "" + this.tab + rvar + " = [];\n";
	        returnResult = "\n" + this.tab + "return " + rvar + ";";
	        body.makeReturn(rvar);
	      }
	      if (this.guard) {
	        if (body.expressions.length > 1) {
	          body.expressions.unshift(new If((new Parens(this.guard)).invert(), new Literal("continue")));
	        } else {
	          if (this.guard) {
	            body = Block.wrap([new If(this.guard, body)]);
	          }
	        }
	      }
	      if (this.pattern) {
	        body.expressions.unshift(new Assign(this.name, new Literal(svar + "[" + kvar + "]")));
	      }
	      defPartFragments = [].concat(this.makeCode(defPart), this.pluckDirectCall(o, body));
	      if (namePart) {
	        varPart = "\n" + idt1 + namePart + ";";
	      }
	      if (this.object) {
	        forPartFragments = [this.makeCode(kvar + " in " + svar)];
	        if (this.own) {
	          guardPart = "\n" + idt1 + "if (!" + (utility('hasProp', o)) + ".call(" + svar + ", " + kvar + ")) continue;";
	        }
	      }
	      bodyFragments = body.compileToFragments(merge(o, {
	        indent: idt1
	      }), LEVEL_TOP);
	      if (bodyFragments && (bodyFragments.length > 0)) {
	        bodyFragments = [].concat(this.makeCode("\n"), bodyFragments, this.makeCode("\n"));
	      }
	      return [].concat(defPartFragments, this.makeCode("" + (resultPart || '') + this.tab + "for ("), forPartFragments, this.makeCode(") {" + guardPart + varPart), bodyFragments, this.makeCode(this.tab + "}" + (returnResult || '')));
	    };

	    For.prototype.pluckDirectCall = function(o, body) {
	      var base, defs, expr, fn, idx, j, len1, ref, ref3, ref4, ref5, ref6, ref7, ref8, ref9, val;
	      defs = [];
	      ref3 = body.expressions;
	      for (idx = j = 0, len1 = ref3.length; j < len1; idx = ++j) {
	        expr = ref3[idx];
	        expr = expr.unwrapAll();
	        if (!(expr instanceof Call)) {
	          continue;
	        }
	        val = (ref4 = expr.variable) != null ? ref4.unwrapAll() : void 0;
	        if (!((val instanceof Code) || (val instanceof Value && ((ref5 = val.base) != null ? ref5.unwrapAll() : void 0) instanceof Code && val.properties.length === 1 && ((ref6 = (ref7 = val.properties[0].name) != null ? ref7.value : void 0) === 'call' || ref6 === 'apply')))) {
	          continue;
	        }
	        fn = ((ref8 = val.base) != null ? ref8.unwrapAll() : void 0) || val;
	        ref = new Literal(o.scope.freeVariable('fn'));
	        base = new Value(ref);
	        if (val.base) {
	          ref9 = [base, val], val.base = ref9[0], base = ref9[1];
	        }
	        body.expressions[idx] = new Call(base, expr.args);
	        defs = defs.concat(this.makeCode(this.tab), new Assign(ref, fn).compileToFragments(o, LEVEL_TOP), this.makeCode(';\n'));
	      }
	      return defs;
	    };

	    return For;

	  })(While);

	  exports.Switch = Switch = (function(superClass1) {
	    extend1(Switch, superClass1);

	    function Switch(subject, cases, otherwise) {
	      this.subject = subject;
	      this.cases = cases;
	      this.otherwise = otherwise;
	    }

	    Switch.prototype.children = ['subject', 'cases', 'otherwise'];

	    Switch.prototype.isStatement = YES;

	    Switch.prototype.jumps = function(o) {
	      var block, conds, j, jumpNode, len1, ref3, ref4, ref5;
	      if (o == null) {
	        o = {
	          block: true
	        };
	      }
	      ref3 = this.cases;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        ref4 = ref3[j], conds = ref4[0], block = ref4[1];
	        if (jumpNode = block.jumps(o)) {
	          return jumpNode;
	        }
	      }
	      return (ref5 = this.otherwise) != null ? ref5.jumps(o) : void 0;
	    };

	    Switch.prototype.makeReturn = function(res) {
	      var j, len1, pair, ref3, ref4;
	      ref3 = this.cases;
	      for (j = 0, len1 = ref3.length; j < len1; j++) {
	        pair = ref3[j];
	        pair[1].makeReturn(res);
	      }
	      if (res) {
	        this.otherwise || (this.otherwise = new Block([new Literal('void 0')]));
	      }
	      if ((ref4 = this.otherwise) != null) {
	        ref4.makeReturn(res);
	      }
	      return this;
	    };

	    Switch.prototype.compileNode = function(o) {
	      var block, body, cond, conditions, expr, fragments, i, idt1, idt2, j, k, len1, len2, ref3, ref4, ref5;
	      idt1 = o.indent + TAB;
	      idt2 = o.indent = idt1 + TAB;
	      fragments = [].concat(this.makeCode(this.tab + "switch ("), (this.subject ? this.subject.compileToFragments(o, LEVEL_PAREN) : this.makeCode("false")), this.makeCode(") {\n"));
	      ref3 = this.cases;
	      for (i = j = 0, len1 = ref3.length; j < len1; i = ++j) {
	        ref4 = ref3[i], conditions = ref4[0], block = ref4[1];
	        ref5 = flatten([conditions]);
	        for (k = 0, len2 = ref5.length; k < len2; k++) {
	          cond = ref5[k];
	          if (!this.subject) {
	            cond = cond.invert();
	          }
	          fragments = fragments.concat(this.makeCode(idt1 + "case "), cond.compileToFragments(o, LEVEL_PAREN), this.makeCode(":\n"));
	        }
	        if ((body = block.compileToFragments(o, LEVEL_TOP)).length > 0) {
	          fragments = fragments.concat(body, this.makeCode('\n'));
	        }
	        if (i === this.cases.length - 1 && !this.otherwise) {
	          break;
	        }
	        expr = this.lastNonComment(block.expressions);
	        if (expr instanceof Return || (expr instanceof Literal && expr.jumps() && expr.value !== 'debugger')) {
	          continue;
	        }
	        fragments.push(cond.makeCode(idt2 + 'break;\n'));
	      }
	      if (this.otherwise && this.otherwise.expressions.length) {
	        fragments.push.apply(fragments, [this.makeCode(idt1 + "default:\n")].concat(slice.call(this.otherwise.compileToFragments(o, LEVEL_TOP)), [this.makeCode("\n")]));
	      }
	      fragments.push(this.makeCode(this.tab + '}'));
	      return fragments;
	    };

	    return Switch;

	  })(Base);

	  exports.If = If = (function(superClass1) {
	    extend1(If, superClass1);

	    function If(condition, body1, options) {
	      this.body = body1;
	      if (options == null) {
	        options = {};
	      }
	      this.condition = options.type === 'unless' ? condition.invert() : condition;
	      this.elseBody = null;
	      this.isChain = false;
	      this.soak = options.soak;
	    }

	    If.prototype.children = ['condition', 'body', 'elseBody'];

	    If.prototype.bodyNode = function() {
	      var ref3;
	      return (ref3 = this.body) != null ? ref3.unwrap() : void 0;
	    };

	    If.prototype.elseBodyNode = function() {
	      var ref3;
	      return (ref3 = this.elseBody) != null ? ref3.unwrap() : void 0;
	    };

	    If.prototype.addElse = function(elseBody) {
	      if (this.isChain) {
	        this.elseBodyNode().addElse(elseBody);
	      } else {
	        this.isChain = elseBody instanceof If;
	        this.elseBody = this.ensureBlock(elseBody);
	        this.elseBody.updateLocationDataIfMissing(elseBody.locationData);
	      }
	      return this;
	    };

	    If.prototype.isStatement = function(o) {
	      var ref3;
	      return (o != null ? o.level : void 0) === LEVEL_TOP || this.bodyNode().isStatement(o) || ((ref3 = this.elseBodyNode()) != null ? ref3.isStatement(o) : void 0);
	    };

	    If.prototype.jumps = function(o) {
	      var ref3;
	      return this.body.jumps(o) || ((ref3 = this.elseBody) != null ? ref3.jumps(o) : void 0);
	    };

	    If.prototype.compileNode = function(o) {
	      if (this.isStatement(o)) {
	        return this.compileStatement(o);
	      } else {
	        return this.compileExpression(o);
	      }
	    };

	    If.prototype.makeReturn = function(res) {
	      if (res) {
	        this.elseBody || (this.elseBody = new Block([new Literal('void 0')]));
	      }
	      this.body && (this.body = new Block([this.body.makeReturn(res)]));
	      this.elseBody && (this.elseBody = new Block([this.elseBody.makeReturn(res)]));
	      return this;
	    };

	    If.prototype.ensureBlock = function(node) {
	      if (node instanceof Block) {
	        return node;
	      } else {
	        return new Block([node]);
	      }
	    };

	    If.prototype.compileStatement = function(o) {
	      var answer, body, child, cond, exeq, ifPart, indent;
	      child = del(o, 'chainChild');
	      exeq = del(o, 'isExistentialEquals');
	      if (exeq) {
	        return new If(this.condition.invert(), this.elseBodyNode(), {
	          type: 'if'
	        }).compileToFragments(o);
	      }
	      indent = o.indent + TAB;
	      cond = this.condition.compileToFragments(o, LEVEL_PAREN);
	      body = this.ensureBlock(this.body).compileToFragments(merge(o, {
	        indent: indent
	      }));
	      ifPart = [].concat(this.makeCode("if ("), cond, this.makeCode(") {\n"), body, this.makeCode("\n" + this.tab + "}"));
	      if (!child) {
	        ifPart.unshift(this.makeCode(this.tab));
	      }
	      if (!this.elseBody) {
	        return ifPart;
	      }
	      answer = ifPart.concat(this.makeCode(' else '));
	      if (this.isChain) {
	        o.chainChild = true;
	        answer = answer.concat(this.elseBody.unwrap().compileToFragments(o, LEVEL_TOP));
	      } else {
	        answer = answer.concat(this.makeCode("{\n"), this.elseBody.compileToFragments(merge(o, {
	          indent: indent
	        }), LEVEL_TOP), this.makeCode("\n" + this.tab + "}"));
	      }
	      return answer;
	    };

	    If.prototype.compileExpression = function(o) {
	      var alt, body, cond, fragments;
	      cond = this.condition.compileToFragments(o, LEVEL_COND);
	      body = this.bodyNode().compileToFragments(o, LEVEL_LIST);
	      alt = this.elseBodyNode() ? this.elseBodyNode().compileToFragments(o, LEVEL_LIST) : [this.makeCode('void 0')];
	      fragments = cond.concat(this.makeCode(" ? "), body, this.makeCode(" : "), alt);
	      if (o.level >= LEVEL_COND) {
	        return this.wrapInBraces(fragments);
	      } else {
	        return fragments;
	      }
	    };

	    If.prototype.unfoldSoak = function() {
	      return this.soak && this;
	    };

	    return If;

	  })(Base);

	  UTILITIES = {
	    extend: function(o) {
	      return "function(child, parent) { for (var key in parent) { if (" + (utility('hasProp', o)) + ".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }";
	    },
	    bind: function() {
	      return 'function(fn, me){ return function(){ return fn.apply(me, arguments); }; }';
	    },
	    indexOf: function() {
	      return "[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }";
	    },
	    modulo: function() {
	      return "function(a, b) { return (+a % (b = +b) + b) % b; }";
	    },
	    hasProp: function() {
	      return '{}.hasOwnProperty';
	    },
	    slice: function() {
	      return '[].slice';
	    }
	  };

	  LEVEL_TOP = 1;

	  LEVEL_PAREN = 2;

	  LEVEL_LIST = 3;

	  LEVEL_COND = 4;

	  LEVEL_OP = 5;

	  LEVEL_ACCESS = 6;

	  TAB = '  ';

	  IDENTIFIER = /^(?!\d)[$\w\x7f-\uffff]+$/;

	  SIMPLENUM = /^[+-]?\d+$/;

	  HEXNUM = /^[+-]?0x[\da-f]+/i;

	  NUMBER = /^[+-]?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)$/i;

	  IS_STRING = /^['"]/;

	  IS_REGEX = /^\//;

	  utility = function(name, o) {
	    var ref, root;
	    root = o.scope.root;
	    if (name in root.utilities) {
	      return root.utilities[name];
	    } else {
	      ref = root.freeVariable(name);
	      root.assign(ref, UTILITIES[name](o));
	      return root.utilities[name] = ref;
	    }
	  };

	  multident = function(code, tab) {
	    code = code.replace(/\n/g, '$&' + tab);
	    return code.replace(/\s+$/, '');
	  };

	  parseNum = function(x) {
	    if (x == null) {
	      return 0;
	    } else if (x.match(HEXNUM)) {
	      return parseInt(x, 16);
	    } else {
	      return parseFloat(x);
	    }
	  };

	  isLiteralArguments = function(node) {
	    return node instanceof Literal && node.value === 'arguments' && !node.asKey;
	  };

	  isLiteralThis = function(node) {
	    return (node instanceof Literal && node.value === 'this' && !node.asKey) || (node instanceof Code && node.bound) || (node instanceof Call && node.isSuper);
	  };

	  isComplexOrAssignable = function(node) {
	    return node.isComplex() || (typeof node.isAssignable === "function" ? node.isAssignable() : void 0);
	  };

	  unfoldSoak = function(o, parent, name) {
	    var ifn;
	    if (!(ifn = parent[name].unfoldSoak(o))) {
	      return;
	    }
	    parent[name] = ifn.body;
	    ifn.body = new Value(parent);
	    return ifn;
	  };

	}).call(this);


/***/ },
/* 92 */
/***/ function(module, exports) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Scope,
	    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  exports.Scope = Scope = (function() {
	    function Scope(parent, expressions, method, referencedVars) {
	      var ref, ref1;
	      this.parent = parent;
	      this.expressions = expressions;
	      this.method = method;
	      this.referencedVars = referencedVars;
	      this.variables = [
	        {
	          name: 'arguments',
	          type: 'arguments'
	        }
	      ];
	      this.positions = {};
	      if (!this.parent) {
	        this.utilities = {};
	      }
	      this.root = (ref = (ref1 = this.parent) != null ? ref1.root : void 0) != null ? ref : this;
	    }

	    Scope.prototype.add = function(name, type, immediate) {
	      if (this.shared && !immediate) {
	        return this.parent.add(name, type, immediate);
	      }
	      if (Object.prototype.hasOwnProperty.call(this.positions, name)) {
	        return this.variables[this.positions[name]].type = type;
	      } else {
	        return this.positions[name] = this.variables.push({
	          name: name,
	          type: type
	        }) - 1;
	      }
	    };

	    Scope.prototype.namedMethod = function() {
	      var ref;
	      if (((ref = this.method) != null ? ref.name : void 0) || !this.parent) {
	        return this.method;
	      }
	      return this.parent.namedMethod();
	    };

	    Scope.prototype.find = function(name) {
	      if (this.check(name)) {
	        return true;
	      }
	      this.add(name, 'var');
	      return false;
	    };

	    Scope.prototype.parameter = function(name) {
	      if (this.shared && this.parent.check(name, true)) {
	        return;
	      }
	      return this.add(name, 'param');
	    };

	    Scope.prototype.check = function(name) {
	      var ref;
	      return !!(this.type(name) || ((ref = this.parent) != null ? ref.check(name) : void 0));
	    };

	    Scope.prototype.temporary = function(name, index, single) {
	      if (single == null) {
	        single = false;
	      }
	      if (single) {
	        return (index + parseInt(name, 36)).toString(36).replace(/\d/g, 'a');
	      } else {
	        return name + (index || '');
	      }
	    };

	    Scope.prototype.type = function(name) {
	      var i, len, ref, v;
	      ref = this.variables;
	      for (i = 0, len = ref.length; i < len; i++) {
	        v = ref[i];
	        if (v.name === name) {
	          return v.type;
	        }
	      }
	      return null;
	    };

	    Scope.prototype.freeVariable = function(name, options) {
	      var index, ref, temp;
	      if (options == null) {
	        options = {};
	      }
	      index = 0;
	      while (true) {
	        temp = this.temporary(name, index, options.single);
	        if (!(this.check(temp) || indexOf.call(this.root.referencedVars, temp) >= 0)) {
	          break;
	        }
	        index++;
	      }
	      if ((ref = options.reserve) != null ? ref : true) {
	        this.add(temp, 'var', true);
	      }
	      return temp;
	    };

	    Scope.prototype.assign = function(name, value) {
	      this.add(name, {
	        value: value,
	        assigned: true
	      }, true);
	      return this.hasAssignments = true;
	    };

	    Scope.prototype.hasDeclarations = function() {
	      return !!this.declaredVariables().length;
	    };

	    Scope.prototype.declaredVariables = function() {
	      var v;
	      return ((function() {
	        var i, len, ref, results;
	        ref = this.variables;
	        results = [];
	        for (i = 0, len = ref.length; i < len; i++) {
	          v = ref[i];
	          if (v.type === 'var') {
	            results.push(v.name);
	          }
	        }
	        return results;
	      }).call(this)).sort();
	    };

	    Scope.prototype.assignedVariables = function() {
	      var i, len, ref, results, v;
	      ref = this.variables;
	      results = [];
	      for (i = 0, len = ref.length; i < len; i++) {
	        v = ref[i];
	        if (v.type.assigned) {
	          results.push(v.name + " = " + v.type.value);
	        }
	      }
	      return results;
	    };

	    return Scope;

	  })();

	}).call(this);


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var Parser, alt, alternatives, grammar, name, o, operators, token, tokens, unwrap;

	  Parser = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"jison\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).Parser;

	  unwrap = /^function\s*\(\)\s*\{\s*return\s*([\s\S]*);\s*\}/;

	  o = function(patternString, action, options) {
	    var addLocationDataFn, match, patternCount;
	    patternString = patternString.replace(/\s{2,}/g, ' ');
	    patternCount = patternString.split(' ').length;
	    if (!action) {
	      return [patternString, '$$ = $1;', options];
	    }
	    action = (match = unwrap.exec(action)) ? match[1] : "(" + action + "())";
	    action = action.replace(/\bnew /g, '$&yy.');
	    action = action.replace(/\b(?:Block\.wrap|extend)\b/g, 'yy.$&');
	    addLocationDataFn = function(first, last) {
	      if (!last) {
	        return "yy.addLocationDataFn(@" + first + ")";
	      } else {
	        return "yy.addLocationDataFn(@" + first + ", @" + last + ")";
	      }
	    };
	    action = action.replace(/LOC\(([0-9]*)\)/g, addLocationDataFn('$1'));
	    action = action.replace(/LOC\(([0-9]*),\s*([0-9]*)\)/g, addLocationDataFn('$1', '$2'));
	    return [patternString, "$$ = " + (addLocationDataFn(1, patternCount)) + "(" + action + ");", options];
	  };

	  grammar = {
	    Root: [
	      o('', function() {
	        return new Block;
	      }), o('Body')
	    ],
	    Body: [
	      o('Line', function() {
	        return Block.wrap([$1]);
	      }), o('Body TERMINATOR Line', function() {
	        return $1.push($3);
	      }), o('Body TERMINATOR')
	    ],
	    Line: [o('Expression'), o('Statement')],
	    Statement: [
	      o('Return'), o('Comment'), o('STATEMENT', function() {
	        return new Literal($1);
	      })
	    ],
	    Expression: [o('Value'), o('Invocation'), o('Code'), o('Operation'), o('Assign'), o('If'), o('Try'), o('While'), o('For'), o('Switch'), o('Class'), o('Throw')],
	    Block: [
	      o('INDENT OUTDENT', function() {
	        return new Block;
	      }), o('INDENT Body OUTDENT', function() {
	        return $2;
	      })
	    ],
	    Identifier: [
	      o('IDENTIFIER', function() {
	        return new Literal($1);
	      })
	    ],
	    AlphaNumeric: [
	      o('NUMBER', function() {
	        return new Literal($1);
	      }), o('String')
	    ],
	    String: [
	      o('STRING', function() {
	        return new Literal($1);
	      }), o('STRING_START Body STRING_END', function() {
	        return new Parens($2);
	      })
	    ],
	    Regex: [
	      o('REGEX', function() {
	        return new Literal($1);
	      }), o('REGEX_START Invocation REGEX_END', function() {
	        return $2;
	      })
	    ],
	    Literal: [
	      o('AlphaNumeric'), o('JS', function() {
	        return new Literal($1);
	      }), o('Regex'), o('DEBUGGER', function() {
	        return new Literal($1);
	      }), o('UNDEFINED', function() {
	        return new Undefined;
	      }), o('NULL', function() {
	        return new Null;
	      }), o('BOOL', function() {
	        return new Bool($1);
	      })
	    ],
	    Assign: [
	      o('Assignable = Expression', function() {
	        return new Assign($1, $3);
	      }), o('Assignable = TERMINATOR Expression', function() {
	        return new Assign($1, $4);
	      }), o('Assignable = INDENT Expression OUTDENT', function() {
	        return new Assign($1, $4);
	      })
	    ],
	    AssignObj: [
	      o('ObjAssignable', function() {
	        return new Value($1);
	      }), o('ObjAssignable : Expression', function() {
	        return new Assign(LOC(1)(new Value($1)), $3, 'object', {
	          operatorToken: LOC(2)(new Literal($2))
	        });
	      }), o('ObjAssignable : INDENT Expression OUTDENT', function() {
	        return new Assign(LOC(1)(new Value($1)), $4, 'object', {
	          operatorToken: LOC(2)(new Literal($2))
	        });
	      }), o('SimpleObjAssignable = Expression', function() {
	        return new Assign(LOC(1)(new Value($1)), $3, null, {
	          operatorToken: LOC(2)(new Literal($2))
	        });
	      }), o('SimpleObjAssignable = INDENT Expression OUTDENT', function() {
	        return new Assign(LOC(1)(new Value($1)), $4, null, {
	          operatorToken: LOC(2)(new Literal($2))
	        });
	      }), o('Comment')
	    ],
	    SimpleObjAssignable: [o('Identifier'), o('ThisProperty')],
	    ObjAssignable: [o('SimpleObjAssignable'), o('AlphaNumeric')],
	    Return: [
	      o('RETURN Expression', function() {
	        return new Return($2);
	      }), o('RETURN', function() {
	        return new Return;
	      })
	    ],
	    Comment: [
	      o('HERECOMMENT', function() {
	        return new Comment($1);
	      })
	    ],
	    Code: [
	      o('PARAM_START ParamList PARAM_END FuncGlyph Block', function() {
	        return new Code($2, $5, $4);
	      }), o('FuncGlyph Block', function() {
	        return new Code([], $2, $1);
	      })
	    ],
	    FuncGlyph: [
	      o('->', function() {
	        return 'func';
	      }), o('=>', function() {
	        return 'boundfunc';
	      })
	    ],
	    OptComma: [o(''), o(',')],
	    ParamList: [
	      o('', function() {
	        return [];
	      }), o('Param', function() {
	        return [$1];
	      }), o('ParamList , Param', function() {
	        return $1.concat($3);
	      }), o('ParamList OptComma TERMINATOR Param', function() {
	        return $1.concat($4);
	      }), o('ParamList OptComma INDENT ParamList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Param: [
	      o('ParamVar', function() {
	        return new Param($1);
	      }), o('ParamVar ...', function() {
	        return new Param($1, null, true);
	      }), o('ParamVar = Expression', function() {
	        return new Param($1, $3);
	      }), o('...', function() {
	        return new Expansion;
	      })
	    ],
	    ParamVar: [o('Identifier'), o('ThisProperty'), o('Array'), o('Object')],
	    Splat: [
	      o('Expression ...', function() {
	        return new Splat($1);
	      })
	    ],
	    SimpleAssignable: [
	      o('Identifier', function() {
	        return new Value($1);
	      }), o('Value Accessor', function() {
	        return $1.add($2);
	      }), o('Invocation Accessor', function() {
	        return new Value($1, [].concat($2));
	      }), o('ThisProperty')
	    ],
	    Assignable: [
	      o('SimpleAssignable'), o('Array', function() {
	        return new Value($1);
	      }), o('Object', function() {
	        return new Value($1);
	      })
	    ],
	    Value: [
	      o('Assignable'), o('Literal', function() {
	        return new Value($1);
	      }), o('Parenthetical', function() {
	        return new Value($1);
	      }), o('Range', function() {
	        return new Value($1);
	      }), o('This')
	    ],
	    Accessor: [
	      o('.  Identifier', function() {
	        return new Access($2);
	      }), o('?. Identifier', function() {
	        return new Access($2, 'soak');
	      }), o(':: Identifier', function() {
	        return [LOC(1)(new Access(new Literal('prototype'))), LOC(2)(new Access($2))];
	      }), o('?:: Identifier', function() {
	        return [LOC(1)(new Access(new Literal('prototype'), 'soak')), LOC(2)(new Access($2))];
	      }), o('::', function() {
	        return new Access(new Literal('prototype'));
	      }), o('Index')
	    ],
	    Index: [
	      o('INDEX_START IndexValue INDEX_END', function() {
	        return $2;
	      }), o('INDEX_SOAK  Index', function() {
	        return extend($2, {
	          soak: true
	        });
	      })
	    ],
	    IndexValue: [
	      o('Expression', function() {
	        return new Index($1);
	      }), o('Slice', function() {
	        return new Slice($1);
	      })
	    ],
	    Object: [
	      o('{ AssignList OptComma }', function() {
	        return new Obj($2, $1.generated);
	      })
	    ],
	    AssignList: [
	      o('', function() {
	        return [];
	      }), o('AssignObj', function() {
	        return [$1];
	      }), o('AssignList , AssignObj', function() {
	        return $1.concat($3);
	      }), o('AssignList OptComma TERMINATOR AssignObj', function() {
	        return $1.concat($4);
	      }), o('AssignList OptComma INDENT AssignList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Class: [
	      o('CLASS', function() {
	        return new Class;
	      }), o('CLASS Block', function() {
	        return new Class(null, null, $2);
	      }), o('CLASS EXTENDS Expression', function() {
	        return new Class(null, $3);
	      }), o('CLASS EXTENDS Expression Block', function() {
	        return new Class(null, $3, $4);
	      }), o('CLASS SimpleAssignable', function() {
	        return new Class($2);
	      }), o('CLASS SimpleAssignable Block', function() {
	        return new Class($2, null, $3);
	      }), o('CLASS SimpleAssignable EXTENDS Expression', function() {
	        return new Class($2, $4);
	      }), o('CLASS SimpleAssignable EXTENDS Expression Block', function() {
	        return new Class($2, $4, $5);
	      })
	    ],
	    Invocation: [
	      o('Value OptFuncExist Arguments', function() {
	        return new Call($1, $3, $2);
	      }), o('Invocation OptFuncExist Arguments', function() {
	        return new Call($1, $3, $2);
	      }), o('SUPER', function() {
	        return new Call('super', [new Splat(new Literal('arguments'))]);
	      }), o('SUPER Arguments', function() {
	        return new Call('super', $2);
	      })
	    ],
	    OptFuncExist: [
	      o('', function() {
	        return false;
	      }), o('FUNC_EXIST', function() {
	        return true;
	      })
	    ],
	    Arguments: [
	      o('CALL_START CALL_END', function() {
	        return [];
	      }), o('CALL_START ArgList OptComma CALL_END', function() {
	        return $2;
	      })
	    ],
	    This: [
	      o('THIS', function() {
	        return new Value(new Literal('this'));
	      }), o('@', function() {
	        return new Value(new Literal('this'));
	      })
	    ],
	    ThisProperty: [
	      o('@ Identifier', function() {
	        return new Value(LOC(1)(new Literal('this')), [LOC(2)(new Access($2))], 'this');
	      })
	    ],
	    Array: [
	      o('[ ]', function() {
	        return new Arr([]);
	      }), o('[ ArgList OptComma ]', function() {
	        return new Arr($2);
	      })
	    ],
	    RangeDots: [
	      o('..', function() {
	        return 'inclusive';
	      }), o('...', function() {
	        return 'exclusive';
	      })
	    ],
	    Range: [
	      o('[ Expression RangeDots Expression ]', function() {
	        return new Range($2, $4, $3);
	      })
	    ],
	    Slice: [
	      o('Expression RangeDots Expression', function() {
	        return new Range($1, $3, $2);
	      }), o('Expression RangeDots', function() {
	        return new Range($1, null, $2);
	      }), o('RangeDots Expression', function() {
	        return new Range(null, $2, $1);
	      }), o('RangeDots', function() {
	        return new Range(null, null, $1);
	      })
	    ],
	    ArgList: [
	      o('Arg', function() {
	        return [$1];
	      }), o('ArgList , Arg', function() {
	        return $1.concat($3);
	      }), o('ArgList OptComma TERMINATOR Arg', function() {
	        return $1.concat($4);
	      }), o('INDENT ArgList OptComma OUTDENT', function() {
	        return $2;
	      }), o('ArgList OptComma INDENT ArgList OptComma OUTDENT', function() {
	        return $1.concat($4);
	      })
	    ],
	    Arg: [
	      o('Expression'), o('Splat'), o('...', function() {
	        return new Expansion;
	      })
	    ],
	    SimpleArgs: [
	      o('Expression'), o('SimpleArgs , Expression', function() {
	        return [].concat($1, $3);
	      })
	    ],
	    Try: [
	      o('TRY Block', function() {
	        return new Try($2);
	      }), o('TRY Block Catch', function() {
	        return new Try($2, $3[0], $3[1]);
	      }), o('TRY Block FINALLY Block', function() {
	        return new Try($2, null, null, $4);
	      }), o('TRY Block Catch FINALLY Block', function() {
	        return new Try($2, $3[0], $3[1], $5);
	      })
	    ],
	    Catch: [
	      o('CATCH Identifier Block', function() {
	        return [$2, $3];
	      }), o('CATCH Object Block', function() {
	        return [LOC(2)(new Value($2)), $3];
	      }), o('CATCH Block', function() {
	        return [null, $2];
	      })
	    ],
	    Throw: [
	      o('THROW Expression', function() {
	        return new Throw($2);
	      })
	    ],
	    Parenthetical: [
	      o('( Body )', function() {
	        return new Parens($2);
	      }), o('( INDENT Body OUTDENT )', function() {
	        return new Parens($3);
	      })
	    ],
	    WhileSource: [
	      o('WHILE Expression', function() {
	        return new While($2);
	      }), o('WHILE Expression WHEN Expression', function() {
	        return new While($2, {
	          guard: $4
	        });
	      }), o('UNTIL Expression', function() {
	        return new While($2, {
	          invert: true
	        });
	      }), o('UNTIL Expression WHEN Expression', function() {
	        return new While($2, {
	          invert: true,
	          guard: $4
	        });
	      })
	    ],
	    While: [
	      o('WhileSource Block', function() {
	        return $1.addBody($2);
	      }), o('Statement  WhileSource', function() {
	        return $2.addBody(LOC(1)(Block.wrap([$1])));
	      }), o('Expression WhileSource', function() {
	        return $2.addBody(LOC(1)(Block.wrap([$1])));
	      }), o('Loop', function() {
	        return $1;
	      })
	    ],
	    Loop: [
	      o('LOOP Block', function() {
	        return new While(LOC(1)(new Literal('true'))).addBody($2);
	      }), o('LOOP Expression', function() {
	        return new While(LOC(1)(new Literal('true'))).addBody(LOC(2)(Block.wrap([$2])));
	      })
	    ],
	    For: [
	      o('Statement  ForBody', function() {
	        return new For($1, $2);
	      }), o('Expression ForBody', function() {
	        return new For($1, $2);
	      }), o('ForBody    Block', function() {
	        return new For($2, $1);
	      })
	    ],
	    ForBody: [
	      o('FOR Range', function() {
	        return {
	          source: LOC(2)(new Value($2))
	        };
	      }), o('FOR Range BY Expression', function() {
	        return {
	          source: LOC(2)(new Value($2)),
	          step: $4
	        };
	      }), o('ForStart ForSource', function() {
	        $2.own = $1.own;
	        $2.name = $1[0];
	        $2.index = $1[1];
	        return $2;
	      })
	    ],
	    ForStart: [
	      o('FOR ForVariables', function() {
	        return $2;
	      }), o('FOR OWN ForVariables', function() {
	        $3.own = true;
	        return $3;
	      })
	    ],
	    ForValue: [
	      o('Identifier'), o('ThisProperty'), o('Array', function() {
	        return new Value($1);
	      }), o('Object', function() {
	        return new Value($1);
	      })
	    ],
	    ForVariables: [
	      o('ForValue', function() {
	        return [$1];
	      }), o('ForValue , ForValue', function() {
	        return [$1, $3];
	      })
	    ],
	    ForSource: [
	      o('FORIN Expression', function() {
	        return {
	          source: $2
	        };
	      }), o('FOROF Expression', function() {
	        return {
	          source: $2,
	          object: true
	        };
	      }), o('FORIN Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          guard: $4
	        };
	      }), o('FOROF Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          guard: $4,
	          object: true
	        };
	      }), o('FORIN Expression BY Expression', function() {
	        return {
	          source: $2,
	          step: $4
	        };
	      }), o('FORIN Expression WHEN Expression BY Expression', function() {
	        return {
	          source: $2,
	          guard: $4,
	          step: $6
	        };
	      }), o('FORIN Expression BY Expression WHEN Expression', function() {
	        return {
	          source: $2,
	          step: $4,
	          guard: $6
	        };
	      })
	    ],
	    Switch: [
	      o('SWITCH Expression INDENT Whens OUTDENT', function() {
	        return new Switch($2, $4);
	      }), o('SWITCH Expression INDENT Whens ELSE Block OUTDENT', function() {
	        return new Switch($2, $4, $6);
	      }), o('SWITCH INDENT Whens OUTDENT', function() {
	        return new Switch(null, $3);
	      }), o('SWITCH INDENT Whens ELSE Block OUTDENT', function() {
	        return new Switch(null, $3, $5);
	      })
	    ],
	    Whens: [
	      o('When'), o('Whens When', function() {
	        return $1.concat($2);
	      })
	    ],
	    When: [
	      o('LEADING_WHEN SimpleArgs Block', function() {
	        return [[$2, $3]];
	      }), o('LEADING_WHEN SimpleArgs Block TERMINATOR', function() {
	        return [[$2, $3]];
	      })
	    ],
	    IfBlock: [
	      o('IF Expression Block', function() {
	        return new If($2, $3, {
	          type: $1
	        });
	      }), o('IfBlock ELSE IF Expression Block', function() {
	        return $1.addElse(LOC(3, 5)(new If($4, $5, {
	          type: $3
	        })));
	      })
	    ],
	    If: [
	      o('IfBlock'), o('IfBlock ELSE Block', function() {
	        return $1.addElse($3);
	      }), o('Statement  POST_IF Expression', function() {
	        return new If($3, LOC(1)(Block.wrap([$1])), {
	          type: $2,
	          statement: true
	        });
	      }), o('Expression POST_IF Expression', function() {
	        return new If($3, LOC(1)(Block.wrap([$1])), {
	          type: $2,
	          statement: true
	        });
	      })
	    ],
	    Operation: [
	      o('UNARY Expression', function() {
	        return new Op($1, $2);
	      }), o('UNARY_MATH Expression', function() {
	        return new Op($1, $2);
	      }), o('-     Expression', (function() {
	        return new Op('-', $2);
	      }), {
	        prec: 'UNARY_MATH'
	      }), o('+     Expression', (function() {
	        return new Op('+', $2);
	      }), {
	        prec: 'UNARY_MATH'
	      }), o('YIELD Statement', function() {
	        return new Op($1, $2);
	      }), o('YIELD Expression', function() {
	        return new Op($1, $2);
	      }), o('YIELD FROM Expression', function() {
	        return new Op($1.concat($2), $3);
	      }), o('-- SimpleAssignable', function() {
	        return new Op('--', $2);
	      }), o('++ SimpleAssignable', function() {
	        return new Op('++', $2);
	      }), o('SimpleAssignable --', function() {
	        return new Op('--', $1, null, true);
	      }), o('SimpleAssignable ++', function() {
	        return new Op('++', $1, null, true);
	      }), o('Expression ?', function() {
	        return new Existence($1);
	      }), o('Expression +  Expression', function() {
	        return new Op('+', $1, $3);
	      }), o('Expression -  Expression', function() {
	        return new Op('-', $1, $3);
	      }), o('Expression MATH     Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression **       Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression SHIFT    Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression COMPARE  Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression LOGIC    Expression', function() {
	        return new Op($2, $1, $3);
	      }), o('Expression RELATION Expression', function() {
	        if ($2.charAt(0) === '!') {
	          return new Op($2.slice(1), $1, $3).invert();
	        } else {
	          return new Op($2, $1, $3);
	        }
	      }), o('SimpleAssignable COMPOUND_ASSIGN Expression', function() {
	        return new Assign($1, $3, $2);
	      }), o('SimpleAssignable COMPOUND_ASSIGN INDENT Expression OUTDENT', function() {
	        return new Assign($1, $4, $2);
	      }), o('SimpleAssignable COMPOUND_ASSIGN TERMINATOR Expression', function() {
	        return new Assign($1, $4, $2);
	      }), o('SimpleAssignable EXTENDS Expression', function() {
	        return new Extends($1, $3);
	      })
	    ]
	  };

	  operators = [['left', '.', '?.', '::', '?::'], ['left', 'CALL_START', 'CALL_END'], ['nonassoc', '++', '--'], ['left', '?'], ['right', 'UNARY'], ['right', '**'], ['right', 'UNARY_MATH'], ['left', 'MATH'], ['left', '+', '-'], ['left', 'SHIFT'], ['left', 'RELATION'], ['left', 'COMPARE'], ['left', 'LOGIC'], ['nonassoc', 'INDENT', 'OUTDENT'], ['right', 'YIELD'], ['right', '=', ':', 'COMPOUND_ASSIGN', 'RETURN', 'THROW', 'EXTENDS'], ['right', 'FORIN', 'FOROF', 'BY', 'WHEN'], ['right', 'IF', 'ELSE', 'FOR', 'WHILE', 'UNTIL', 'LOOP', 'SUPER', 'CLASS'], ['left', 'POST_IF']];

	  tokens = [];

	  for (name in grammar) {
	    alternatives = grammar[name];
	    grammar[name] = (function() {
	      var i, j, len, len1, ref, results;
	      results = [];
	      for (i = 0, len = alternatives.length; i < len; i++) {
	        alt = alternatives[i];
	        ref = alt[0].split(' ');
	        for (j = 0, len1 = ref.length; j < len1; j++) {
	          token = ref[j];
	          if (!grammar[token]) {
	            tokens.push(token);
	          }
	        }
	        if (name === 'Root') {
	          alt[1] = "return " + alt[1];
	        }
	        results.push(alt);
	      }
	      return results;
	    })();
	  }

	  exports.parser = new Parser({
	    tokens: tokens.join(' '),
	    bnf: grammar,
	    operators: operators.reverse(),
	    startSymbol: 'Root'
	  });

	}).call(this);


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var key, ref, val;

	  ref = __webpack_require__(77);
	  for (key in ref) {
	    val = ref[key];
	    exports[key] = val;
	  }

	}).call(this);


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	// Generated by CoffeeScript 1.10.0
	(function() {
	  var CoffeeScript, Module, binary, child_process, ext, findExtension, fork, helpers, i, len, loadFile, path, ref;

	  CoffeeScript = __webpack_require__(77);

	  child_process = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	  helpers = __webpack_require__(82);

	  path = __webpack_require__(5);

	  loadFile = function(module, filename) {
	    var answer;
	    answer = CoffeeScript._compileFile(filename, false);
	    return module._compile(answer, filename);
	  };

	  if ((void 0)) {
	    ref = CoffeeScript.FILE_EXTENSIONS;
	    for (i = 0, len = ref.length; i < len; i++) {
	      ext = ref[i];
	      (void 0)[ext] = loadFile;
	    }
	    Module = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"module\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    findExtension = function(filename) {
	      var curExtension, extensions;
	      extensions = path.basename(filename).split('.');
	      if (extensions[0] === '') {
	        extensions.shift();
	      }
	      while (extensions.shift()) {
	        curExtension = '.' + extensions.join('.');
	        if (Module._extensions[curExtension]) {
	          return curExtension;
	        }
	      }
	      return '.js';
	    };
	    Module.prototype.load = function(filename) {
	      var extension;
	      this.filename = filename;
	      this.paths = Module._nodeModulePaths(path.dirname(filename));
	      extension = findExtension(filename);
	      Module._extensions[extension](this, filename);
	      return this.loaded = true;
	    };
	  }

	  if (child_process) {
	    fork = child_process.fork;
	    binary = /*require.resolve*/(!(function webpackMissingModule() { var e = new Error("Cannot find module \"../../bin/coffee\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	    child_process.fork = function(path, args, options) {
	      if (helpers.isCoffee(path)) {
	        if (!Array.isArray(args)) {
	          options = args || {};
	          args = [];
	        }
	        args = [path].concat(args);
	        path = binary;
	      }
	      return fork(path, args, options);
	    };
	  }

	}).call(this);


/***/ },
/* 96 */,
/* 97 */
/***/ function(module, exports) {

	
	/*!
	 * Jade - doctypes
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	module.exports = {
	    '5': '<!DOCTYPE html>'
	  , 'default': '<!DOCTYPE html>'
	  , 'xml': '<?xml version="1.0" encoding="utf-8" ?>'
	  , 'transitional': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
	  , 'strict': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">'
	  , 'frameset': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">'
	  , '1.1': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'
	  , 'basic': '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML Basic 1.1//EN" "http://www.w3.org/TR/xhtml-basic/xhtml-basic11.dtd">'
	  , 'mobile': '<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.2//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile12.dtd">'
	};

/***/ },
/* 98 */
/***/ function(module, exports) {

	
	/*!
	 * Jade - self closing tags
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	module.exports = [
	    'meta'
	  , 'img'
	  , 'link'
	  , 'input'
	  , 'source'
	  , 'area'
	  , 'base'
	  , 'col'
	  , 'br'
	  , 'hr'
	];

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	
	/*!
	 * Jade - runtime
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Lame Array.isArray() polyfill for now.
	 */

	if (!Array.isArray) {
	  Array.isArray = function(arr){
	    return '[object Array]' == Object.prototype.toString.call(arr);
	  };
	}

	/**
	 * Lame Object.keys() polyfill for now.
	 */

	if (!Object.keys) {
	  Object.keys = function(obj){
	    var arr = [];
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        arr.push(key);
	      }
	    }
	    return arr;
	  }
	}

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	exports.merge = function merge(a, b) {
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    ac = ac.filter(nulls);
	    bc = bc.filter(nulls);
	    a['class'] = ac.concat(bc).join(' ');
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function nulls(val) {
	  return val != null;
	}

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 * @api private
	 */

	exports.attrs = function attrs(obj, escaped){
	  var buf = []
	    , terse = obj.terse;

	  delete obj.terse;
	  var keys = Object.keys(obj)
	    , len = keys.length;

	  if (len) {
	    buf.push('');
	    for (var i = 0; i < len; ++i) {
	      var key = keys[i]
	        , val = obj[key];

	      if ('boolean' == typeof val || null == val) {
	        if (val) {
	          terse
	            ? buf.push(key)
	            : buf.push(key + '="' + key + '"');
	        }
	      } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	        buf.push(key + "='" + JSON.stringify(val) + "'");
	      } else if ('class' == key && Array.isArray(val)) {
	        buf.push(key + '="' + exports.escape(val.join(' ')) + '"');
	      } else if (escaped && escaped[key]) {
	        buf.push(key + '="' + exports.escape(val) + '"');
	      } else {
	        buf.push(key + '="' + val + '"');
	      }
	    }
	  }

	  return buf.join(' ');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	exports.escape = function escape(html){
	  return String(html)
	    .replace(/&(?!(\w+|\#\d+);)/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/"/g, '&quot;');
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno){
	  if (!filename) throw err;

	  var context = 3
	    , str = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).readFileSync(filename, 'utf8')
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};


/***/ },
/* 100 */
/***/ function(module, exports) {

	
	/*!
	 * Jade - utils
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Convert interpolation in the given string to JavaScript.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	var interpolate = exports.interpolate = function(str){
	  return str.replace(/(\\)?([#!]){(.*?)}/g, function(str, escape, flag, code){
	    return escape
	      ? str
	      : "' + "
	        + ('!' == flag ? '' : 'escape')
	        + "((interp = " + code.replace(/\\'/g, "'")
	        + ") == null ? '' : interp) + '";
	  });
	};

	/**
	 * Escape single quotes in `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	var escape = exports.escape = function(str) {
	  return str.replace(/'/g, "\\'");
	};

	/**
	 * Interpolate, and escape the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	exports.text = function(str){
	  return interpolate(escape(str));
	};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/**
	 * Module dependencies.
	 */

	var Base = __webpack_require__(7);

	/**
	 * Expose `List`.
	 */

	exports = module.exports = List;

	/**
	 * Initialize a new `List` test reporter.
	 *
	 * @api public
	 * @param {Runner} runner
	 */
	function List(runner) {
	  Base.call(this, runner);

	  var self = this;
	  var total = runner.total;

	  runner.on('start', function() {
	    console.log(JSON.stringify(['start', { total: total }]));
	  });

	  runner.on('pass', function(test) {
	    console.log(JSON.stringify(['pass', clean(test)]));
	  });

	  runner.on('fail', function(test, err) {
	    test = clean(test);
	    test.err = err.message;
	    test.stack = err.stack || null;
	    console.log(JSON.stringify(['fail', test]));
	  });

	  runner.on('end', function() {
	    process.stdout.write(JSON.stringify(['end', self.stats]));
	  });
	}

	/**
	 * Return a plain-object representation of `test`
	 * free of cyclic properties etc.
	 *
	 * @api private
	 * @param {Object} test
	 * @return {Object}
	 */
	function clean(test) {
	  return {
	    title: test.title,
	    fullTitle: test.fullTitle(),
	    duration: test.duration,
	    currentRetry: test.currentRetry()
	  };
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	exports.bdd = __webpack_require__(103);
	exports.tdd = __webpack_require__(111);
	exports.qunit = __webpack_require__(112);
	exports.exports = __webpack_require__(113);


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Suite = __webpack_require__(104);
	var Test = __webpack_require__(109);
	var escapeRe = __webpack_require__(4);

	/**
	 * BDD-style interface:
	 *
	 *      describe('Array', function() {
	 *        describe('#indexOf()', function() {
	 *          it('should return -1 when not present', function() {
	 *            // ...
	 *          });
	 *
	 *          it('should return the index when present', function() {
	 *            // ...
	 *          });
	 *        });
	 *      });
	 *
	 * @param {Suite} suite Root suite.
	 */
	module.exports = function(suite) {
	  var suites = [suite];

	  suite.on('pre-require', function(context, file, mocha) {
	    var common = __webpack_require__(110)(suites, context);

	    context.before = common.before;
	    context.after = common.after;
	    context.beforeEach = common.beforeEach;
	    context.afterEach = common.afterEach;
	    context.run = mocha.options.delay && common.runWithSuite(suite);
	    /**
	     * Describe a "suite" with the given `title`
	     * and callback `fn` containing nested suites
	     * and/or tests.
	     */

	    context.describe = context.context = function(title, fn) {
	      var suite = Suite.create(suites[0], title);
	      suite.file = file;
	      suites.unshift(suite);
	      fn.call(suite);
	      suites.shift();
	      return suite;
	    };

	    /**
	     * Pending describe.
	     */

	    context.xdescribe = context.xcontext = context.describe.skip = function(title, fn) {
	      var suite = Suite.create(suites[0], title);
	      suite.pending = true;
	      suites.unshift(suite);
	      fn.call(suite);
	      suites.shift();
	    };

	    /**
	     * Exclusive suite.
	     */

	    context.describe.only = function(title, fn) {
	      var suite = context.describe(title, fn);
	      mocha.grep(suite.fullTitle());
	      return suite;
	    };

	    /**
	     * Describe a specification or test-case
	     * with the given `title` and callback `fn`
	     * acting as a thunk.
	     */

	    var it = context.it = context.specify = function(title, fn) {
	      var suite = suites[0];
	      if (suite.pending) {
	        fn = null;
	      }
	      var test = new Test(title, fn);
	      test.file = file;
	      suite.addTest(test);
	      return test;
	    };

	    /**
	     * Exclusive test-case.
	     */

	    context.it.only = function(title, fn) {
	      var test = it(title, fn);
	      var reString = '^' + escapeRe(test.fullTitle()) + '$';
	      mocha.grep(new RegExp(reString));
	      return test;
	    };

	    /**
	     * Pending test case.
	     */

	    context.xit = context.xspecify = context.it.skip = function(title) {
	      context.it(title);
	    };

	    /**
	     * Number of attempts to retry.
	     */
	    context.it.retries = function(n) {
	      context.retries(n);
	    };
	  });
	};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var EventEmitter = __webpack_require__(105).EventEmitter;
	var Hook = __webpack_require__(106);
	var utils = __webpack_require__(11);
	var inherits = utils.inherits;
	var debug = __webpack_require__(16)('mocha:suite');
	var milliseconds = __webpack_require__(10);

	/**
	 * Expose `Suite`.
	 */

	exports = module.exports = Suite;

	/**
	 * Create a new `Suite` with the given `title` and parent `Suite`. When a suite
	 * with the same title is already present, that suite is returned to provide
	 * nicer reporter and more flexible meta-testing.
	 *
	 * @api public
	 * @param {Suite} parent
	 * @param {string} title
	 * @return {Suite}
	 */
	exports.create = function(parent, title) {
	  var suite = new Suite(title, parent.ctx);
	  suite.parent = parent;
	  if (parent.pending) {
	    suite.pending = true;
	  }
	  title = suite.fullTitle();
	  parent.addSuite(suite);
	  return suite;
	};

	/**
	 * Initialize a new `Suite` with the given `title` and `ctx`.
	 *
	 * @api private
	 * @param {string} title
	 * @param {Context} parentContext
	 */
	function Suite(title, parentContext) {
	  this.title = title;
	  function Context() {}
	  Context.prototype = parentContext;
	  this.ctx = new Context();
	  this.suites = [];
	  this.tests = [];
	  this.pending = false;
	  this._beforeEach = [];
	  this._beforeAll = [];
	  this._afterEach = [];
	  this._afterAll = [];
	  this.root = !title;
	  this._timeout = 2000;
	  this._enableTimeouts = true;
	  this._slow = 75;
	  this._bail = false;
	  this._retries = -1;
	  this.delayed = false;
	}

	/**
	 * Inherit from `EventEmitter.prototype`.
	 */
	inherits(Suite, EventEmitter);

	/**
	 * Return a clone of this `Suite`.
	 *
	 * @api private
	 * @return {Suite}
	 */
	Suite.prototype.clone = function() {
	  var suite = new Suite(this.title);
	  debug('clone');
	  suite.ctx = this.ctx;
	  suite.timeout(this.timeout());
	  suite.retries(this.retries());
	  suite.enableTimeouts(this.enableTimeouts());
	  suite.slow(this.slow());
	  suite.bail(this.bail());
	  return suite;
	};

	/**
	 * Set timeout `ms` or short-hand such as "2s".
	 *
	 * @api private
	 * @param {number|string} ms
	 * @return {Suite|number} for chaining
	 */
	Suite.prototype.timeout = function(ms) {
	  if (!arguments.length) {
	    return this._timeout;
	  }
	  if (ms.toString() === '0') {
	    this._enableTimeouts = false;
	  }
	  if (typeof ms === 'string') {
	    ms = milliseconds(ms);
	  }
	  debug('timeout %d', ms);
	  this._timeout = parseInt(ms, 10);
	  return this;
	};

	/**
	 * Set number of times to retry a failed test.
	 *
	 * @api private
	 * @param {number|string} n
	 * @return {Suite|number} for chaining
	 */
	Suite.prototype.retries = function(n) {
	  if (!arguments.length) {
	    return this._retries;
	  }
	  debug('retries %d', n);
	  this._retries = parseInt(n, 10) || 0;
	  return this;
	};

	/**
	  * Set timeout to `enabled`.
	  *
	  * @api private
	  * @param {boolean} enabled
	  * @return {Suite|boolean} self or enabled
	  */
	Suite.prototype.enableTimeouts = function(enabled) {
	  if (!arguments.length) {
	    return this._enableTimeouts;
	  }
	  debug('enableTimeouts %s', enabled);
	  this._enableTimeouts = enabled;
	  return this;
	};

	/**
	 * Set slow `ms` or short-hand such as "2s".
	 *
	 * @api private
	 * @param {number|string} ms
	 * @return {Suite|number} for chaining
	 */
	Suite.prototype.slow = function(ms) {
	  if (!arguments.length) {
	    return this._slow;
	  }
	  if (typeof ms === 'string') {
	    ms = milliseconds(ms);
	  }
	  debug('slow %d', ms);
	  this._slow = ms;
	  return this;
	};

	/**
	 * Sets whether to bail after first error.
	 *
	 * @api private
	 * @param {boolean} bail
	 * @return {Suite|number} for chaining
	 */
	Suite.prototype.bail = function(bail) {
	  if (!arguments.length) {
	    return this._bail;
	  }
	  debug('bail %s', bail);
	  this._bail = bail;
	  return this;
	};

	/**
	 * Run `fn(test[, done])` before running tests.
	 *
	 * @api private
	 * @param {string} title
	 * @param {Function} fn
	 * @return {Suite} for chaining
	 */
	Suite.prototype.beforeAll = function(title, fn) {
	  if (this.pending) {
	    return this;
	  }
	  if (typeof title === 'function') {
	    fn = title;
	    title = fn.name;
	  }
	  title = '"before all" hook' + (title ? ': ' + title : '');

	  var hook = new Hook(title, fn);
	  hook.parent = this;
	  hook.timeout(this.timeout());
	  hook.retries(this.retries());
	  hook.enableTimeouts(this.enableTimeouts());
	  hook.slow(this.slow());
	  hook.ctx = this.ctx;
	  this._beforeAll.push(hook);
	  this.emit('beforeAll', hook);
	  return this;
	};

	/**
	 * Run `fn(test[, done])` after running tests.
	 *
	 * @api private
	 * @param {string} title
	 * @param {Function} fn
	 * @return {Suite} for chaining
	 */
	Suite.prototype.afterAll = function(title, fn) {
	  if (this.pending) {
	    return this;
	  }
	  if (typeof title === 'function') {
	    fn = title;
	    title = fn.name;
	  }
	  title = '"after all" hook' + (title ? ': ' + title : '');

	  var hook = new Hook(title, fn);
	  hook.parent = this;
	  hook.timeout(this.timeout());
	  hook.retries(this.retries());
	  hook.enableTimeouts(this.enableTimeouts());
	  hook.slow(this.slow());
	  hook.ctx = this.ctx;
	  this._afterAll.push(hook);
	  this.emit('afterAll', hook);
	  return this;
	};

	/**
	 * Run `fn(test[, done])` before each test case.
	 *
	 * @api private
	 * @param {string} title
	 * @param {Function} fn
	 * @return {Suite} for chaining
	 */
	Suite.prototype.beforeEach = function(title, fn) {
	  if (this.pending) {
	    return this;
	  }
	  if (typeof title === 'function') {
	    fn = title;
	    title = fn.name;
	  }
	  title = '"before each" hook' + (title ? ': ' + title : '');

	  var hook = new Hook(title, fn);
	  hook.parent = this;
	  hook.timeout(this.timeout());
	  hook.retries(this.retries());
	  hook.enableTimeouts(this.enableTimeouts());
	  hook.slow(this.slow());
	  hook.ctx = this.ctx;
	  this._beforeEach.push(hook);
	  this.emit('beforeEach', hook);
	  return this;
	};

	/**
	 * Run `fn(test[, done])` after each test case.
	 *
	 * @api private
	 * @param {string} title
	 * @param {Function} fn
	 * @return {Suite} for chaining
	 */
	Suite.prototype.afterEach = function(title, fn) {
	  if (this.pending) {
	    return this;
	  }
	  if (typeof title === 'function') {
	    fn = title;
	    title = fn.name;
	  }
	  title = '"after each" hook' + (title ? ': ' + title : '');

	  var hook = new Hook(title, fn);
	  hook.parent = this;
	  hook.timeout(this.timeout());
	  hook.retries(this.retries());
	  hook.enableTimeouts(this.enableTimeouts());
	  hook.slow(this.slow());
	  hook.ctx = this.ctx;
	  this._afterEach.push(hook);
	  this.emit('afterEach', hook);
	  return this;
	};

	/**
	 * Add a test `suite`.
	 *
	 * @api private
	 * @param {Suite} suite
	 * @return {Suite} for chaining
	 */
	Suite.prototype.addSuite = function(suite) {
	  suite.parent = this;
	  suite.timeout(this.timeout());
	  suite.retries(this.retries());
	  suite.enableTimeouts(this.enableTimeouts());
	  suite.slow(this.slow());
	  suite.bail(this.bail());
	  this.suites.push(suite);
	  this.emit('suite', suite);
	  return this;
	};

	/**
	 * Add a `test` to this suite.
	 *
	 * @api private
	 * @param {Test} test
	 * @return {Suite} for chaining
	 */
	Suite.prototype.addTest = function(test) {
	  test.parent = this;
	  test.timeout(this.timeout());
	  test.retries(this.retries());
	  test.enableTimeouts(this.enableTimeouts());
	  test.slow(this.slow());
	  test.ctx = this.ctx;
	  this.tests.push(test);
	  this.emit('test', test);
	  return this;
	};

	/**
	 * Return the full title generated by recursively concatenating the parent's
	 * full title.
	 *
	 * @api public
	 * @return {string}
	 */
	Suite.prototype.fullTitle = function() {
	  if (this.parent) {
	    var full = this.parent.fullTitle();
	    if (full) {
	      return full + ' ' + this.title;
	    }
	  }
	  return this.title;
	};

	/**
	 * Return the total number of tests.
	 *
	 * @api public
	 * @return {number}
	 */
	Suite.prototype.total = function() {
	  return utils.reduce(this.suites, function(sum, suite) {
	    return sum + suite.total();
	  }, 0) + this.tests.length;
	};

	/**
	 * Iterates through each suite recursively to find all tests. Applies a
	 * function in the format `fn(test)`.
	 *
	 * @api private
	 * @param {Function} fn
	 * @return {Suite}
	 */
	Suite.prototype.eachTest = function(fn) {
	  utils.forEach(this.tests, fn);
	  utils.forEach(this.suites, function(suite) {
	    suite.eachTest(fn);
	  });
	  return this;
	};

	/**
	 * This will run the root suite if we happen to be running in delayed mode.
	 */
	Suite.prototype.run = function run() {
	  if (this.root) {
	    this.emit('run');
	  }
	};


/***/ },
/* 105 */
/***/ function(module, exports) {

	/**
	 * Module exports.
	 */

	exports.EventEmitter = EventEmitter;

	/**
	 * Object#hasOwnProperty reference.
	 */
	var objToString = Object.prototype.toString;

	/**
	 * Check if a value is an array.
	 *
	 * @api private
	 * @param {*} val The value to test.
	 * @return {boolean} true if the value is a boolean, otherwise false.
	 */
	function isArray(val) {
	  return objToString.call(val) === '[object Array]';
	}

	/**
	 * Event emitter constructor.
	 *
	 * @api public
	 */
	function EventEmitter() {}

	/**
	 * Add a listener.
	 *
	 * @api public
	 * @param {string} name Event name.
	 * @param {Function} fn Event handler.
	 * @return {EventEmitter} Emitter instance.
	 */
	EventEmitter.prototype.on = function(name, fn) {
	  if (!this.$events) {
	    this.$events = {};
	  }

	  if (!this.$events[name]) {
	    this.$events[name] = fn;
	  } else if (isArray(this.$events[name])) {
	    this.$events[name].push(fn);
	  } else {
	    this.$events[name] = [this.$events[name], fn];
	  }

	  return this;
	};

	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	/**
	 * Adds a volatile listener.
	 *
	 * @api public
	 * @param {string} name Event name.
	 * @param {Function} fn Event handler.
	 * @return {EventEmitter} Emitter instance.
	 */
	EventEmitter.prototype.once = function(name, fn) {
	  var self = this;

	  function on() {
	    self.removeListener(name, on);
	    fn.apply(this, arguments);
	  }

	  on.listener = fn;
	  this.on(name, on);

	  return this;
	};

	/**
	 * Remove a listener.
	 *
	 * @api public
	 * @param {string} name Event name.
	 * @param {Function} fn Event handler.
	 * @return {EventEmitter} Emitter instance.
	 */
	EventEmitter.prototype.removeListener = function(name, fn) {
	  if (this.$events && this.$events[name]) {
	    var list = this.$events[name];

	    if (isArray(list)) {
	      var pos = -1;

	      for (var i = 0, l = list.length; i < l; i++) {
	        if (list[i] === fn || (list[i].listener && list[i].listener === fn)) {
	          pos = i;
	          break;
	        }
	      }

	      if (pos < 0) {
	        return this;
	      }

	      list.splice(pos, 1);

	      if (!list.length) {
	        delete this.$events[name];
	      }
	    } else if (list === fn || (list.listener && list.listener === fn)) {
	      delete this.$events[name];
	    }
	  }

	  return this;
	};

	/**
	 * Remove all listeners for an event.
	 *
	 * @api public
	 * @param {string} name Event name.
	 * @return {EventEmitter} Emitter instance.
	 */
	EventEmitter.prototype.removeAllListeners = function(name) {
	  if (name === undefined) {
	    this.$events = {};
	    return this;
	  }

	  if (this.$events && this.$events[name]) {
	    this.$events[name] = null;
	  }

	  return this;
	};

	/**
	 * Get all listeners for a given event.
	 *
	 * @api public
	 * @param {string} name Event name.
	 * @return {EventEmitter} Emitter instance.
	 */
	EventEmitter.prototype.listeners = function(name) {
	  if (!this.$events) {
	    this.$events = {};
	  }

	  if (!this.$events[name]) {
	    this.$events[name] = [];
	  }

	  if (!isArray(this.$events[name])) {
	    this.$events[name] = [this.$events[name]];
	  }

	  return this.$events[name];
	};

	/**
	 * Emit an event.
	 *
	 * @api public
	 * @param {string} name Event name.
	 * @return {boolean} true if at least one handler was invoked, else false.
	 */
	EventEmitter.prototype.emit = function(name) {
	  if (!this.$events) {
	    return false;
	  }

	  var handler = this.$events[name];

	  if (!handler) {
	    return false;
	  }

	  var args = Array.prototype.slice.call(arguments, 1);

	  if (typeof handler === 'function') {
	    handler.apply(this, args);
	  } else if (isArray(handler)) {
	    var listeners = handler.slice();

	    for (var i = 0, l = listeners.length; i < l; i++) {
	      listeners[i].apply(this, args);
	    }
	  } else {
	    return false;
	  }

	  return true;
	};


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Runnable = __webpack_require__(107);
	var inherits = __webpack_require__(11).inherits;

	/**
	 * Expose `Hook`.
	 */

	module.exports = Hook;

	/**
	 * Initialize a new `Hook` with the given `title` and callback `fn`.
	 *
	 * @param {String} title
	 * @param {Function} fn
	 * @api private
	 */
	function Hook(title, fn) {
	  Runnable.call(this, title, fn);
	  this.type = 'hook';
	}

	/**
	 * Inherit from `Runnable.prototype`.
	 */
	inherits(Hook, Runnable);

	/**
	 * Get or set the test `err`.
	 *
	 * @param {Error} err
	 * @return {Error}
	 * @api public
	 */
	Hook.prototype.error = function(err) {
	  if (!arguments.length) {
	    err = this._error;
	    this._error = null;
	    return err;
	  }

	  this._error = err;
	};


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Module dependencies.
	 */

	var EventEmitter = __webpack_require__(105).EventEmitter;
	var Pending = __webpack_require__(108);
	var debug = __webpack_require__(16)('mocha:runnable');
	var milliseconds = __webpack_require__(10);
	var utils = __webpack_require__(11);
	var inherits = utils.inherits;

	/**
	 * Save timer references to avoid Sinon interfering (see GH-237).
	 */

	/* eslint-disable no-unused-vars, no-native-reassign */
	var Date = global.Date;
	var setTimeout = global.setTimeout;
	var setInterval = global.setInterval;
	var clearTimeout = global.clearTimeout;
	var clearInterval = global.clearInterval;
	/* eslint-enable no-unused-vars, no-native-reassign */

	/**
	 * Object#toString().
	 */

	var toString = Object.prototype.toString;

	/**
	 * Expose `Runnable`.
	 */

	module.exports = Runnable;

	/**
	 * Initialize a new `Runnable` with the given `title` and callback `fn`.
	 *
	 * @param {String} title
	 * @param {Function} fn
	 * @api private
	 * @param {string} title
	 * @param {Function} fn
	 */
	function Runnable(title, fn) {
	  this.title = title;
	  this.fn = fn;
	  this.async = fn && fn.length;
	  this.sync = !this.async;
	  this._timeout = 2000;
	  this._slow = 75;
	  this._enableTimeouts = true;
	  this.timedOut = false;
	  this._trace = new Error('done() called multiple times');
	  this._retries = -1;
	  this._currentRetry = 0;
	}

	/**
	 * Inherit from `EventEmitter.prototype`.
	 */
	inherits(Runnable, EventEmitter);

	/**
	 * Set & get timeout `ms`.
	 *
	 * @api private
	 * @param {number|string} ms
	 * @return {Runnable|number} ms or Runnable instance.
	 */
	Runnable.prototype.timeout = function(ms) {
	  if (!arguments.length) {
	    return this._timeout;
	  }
	  if (ms === 0) {
	    this._enableTimeouts = false;
	  }
	  if (typeof ms === 'string') {
	    ms = milliseconds(ms);
	  }
	  debug('timeout %d', ms);
	  this._timeout = ms;
	  if (this.timer) {
	    this.resetTimeout();
	  }
	  return this;
	};

	/**
	 * Set & get slow `ms`.
	 *
	 * @api private
	 * @param {number|string} ms
	 * @return {Runnable|number} ms or Runnable instance.
	 */
	Runnable.prototype.slow = function(ms) {
	  if (!arguments.length) {
	    return this._slow;
	  }
	  if (typeof ms === 'string') {
	    ms = milliseconds(ms);
	  }
	  debug('timeout %d', ms);
	  this._slow = ms;
	  return this;
	};

	/**
	 * Set and get whether timeout is `enabled`.
	 *
	 * @api private
	 * @param {boolean} enabled
	 * @return {Runnable|boolean} enabled or Runnable instance.
	 */
	Runnable.prototype.enableTimeouts = function(enabled) {
	  if (!arguments.length) {
	    return this._enableTimeouts;
	  }
	  debug('enableTimeouts %s', enabled);
	  this._enableTimeouts = enabled;
	  return this;
	};

	/**
	 * Halt and mark as pending.
	 *
	 * @api private
	 */
	Runnable.prototype.skip = function() {
	  throw new Pending();
	};

	/**
	 * Set number of retries.
	 *
	 * @api private
	 */
	Runnable.prototype.retries = function(n) {
	  if (!arguments.length) {
	    return this._retries;
	  }
	  this._retries = n;
	};

	/**
	 * Get current retry
	 *
	 * @api private
	 */
	Runnable.prototype.currentRetry = function(n) {
	  if (!arguments.length) {
	    return this._currentRetry;
	  }
	  this._currentRetry = n;
	};

	/**
	 * Return the full title generated by recursively concatenating the parent's
	 * full title.
	 *
	 * @api public
	 * @return {string}
	 */
	Runnable.prototype.fullTitle = function() {
	  return this.parent.fullTitle() + ' ' + this.title;
	};

	/**
	 * Clear the timeout.
	 *
	 * @api private
	 */
	Runnable.prototype.clearTimeout = function() {
	  clearTimeout(this.timer);
	};

	/**
	 * Inspect the runnable void of private properties.
	 *
	 * @api private
	 * @return {string}
	 */
	Runnable.prototype.inspect = function() {
	  return JSON.stringify(this, function(key, val) {
	    if (key[0] === '_') {
	      return;
	    }
	    if (key === 'parent') {
	      return '#<Suite>';
	    }
	    if (key === 'ctx') {
	      return '#<Context>';
	    }
	    return val;
	  }, 2);
	};

	/**
	 * Reset the timeout.
	 *
	 * @api private
	 */
	Runnable.prototype.resetTimeout = function() {
	  var self = this;
	  var ms = this.timeout() || 1e9;

	  if (!this._enableTimeouts) {
	    return;
	  }
	  this.clearTimeout();
	  this.timer = setTimeout(function() {
	    if (!self._enableTimeouts) {
	      return;
	    }
	    self.callback(new Error('timeout of ' + ms + 'ms exceeded. Ensure the done() callback is being called in this test.'));
	    self.timedOut = true;
	  }, ms);
	};

	/**
	 * Whitelist a list of globals for this test run.
	 *
	 * @api private
	 * @param {string[]} globals
	 */
	Runnable.prototype.globals = function(globals) {
	  if (!arguments.length) {
	    return this._allowedGlobals;
	  }
	  this._allowedGlobals = globals;
	};

	/**
	 * Run the test and invoke `fn(err)`.
	 *
	 * @param {Function} fn
	 * @api private
	 */
	Runnable.prototype.run = function(fn) {
	  var self = this;
	  var start = new Date();
	  var ctx = this.ctx;
	  var finished;
	  var emitted;

	  // Sometimes the ctx exists, but it is not runnable
	  if (ctx && ctx.runnable) {
	    ctx.runnable(this);
	  }

	  // called multiple times
	  function multiple(err) {
	    if (emitted) {
	      return;
	    }
	    emitted = true;
	    self.emit('error', err || new Error('done() called multiple times; stacktrace may be inaccurate'));
	  }

	  // finished
	  function done(err) {
	    var ms = self.timeout();
	    if (self.timedOut) {
	      return;
	    }
	    if (finished) {
	      return multiple(err || self._trace);
	    }

	    self.clearTimeout();
	    self.duration = new Date() - start;
	    finished = true;
	    if (!err && self.duration > ms && self._enableTimeouts) {
	      err = new Error('timeout of ' + ms + 'ms exceeded. Ensure the done() callback is being called in this test.');
	    }
	    fn(err);
	  }

	  // for .resetTimeout()
	  this.callback = done;

	  // explicit async with `done` argument
	  if (this.async) {
	    this.resetTimeout();

	    if (this.allowUncaught) {
	      return callFnAsync(this.fn);
	    }
	    try {
	      callFnAsync(this.fn);
	    } catch (err) {
	      done(utils.getError(err));
	    }
	    return;
	  }

	  if (this.allowUncaught) {
	    callFn(this.fn);
	    done();
	    return;
	  }

	  // sync or promise-returning
	  try {
	    if (this.pending) {
	      done();
	    } else {
	      callFn(this.fn);
	    }
	  } catch (err) {
	    done(utils.getError(err));
	  }

	  function callFn(fn) {
	    var result = fn.call(ctx);
	    if (result && typeof result.then === 'function') {
	      self.resetTimeout();
	      result
	        .then(function() {
	          done();
	          // Return null so libraries like bluebird do not warn about
	          // subsequently constructed Promises.
	          return null;
	        },
	        function(reason) {
	          done(reason || new Error('Promise rejected with no or falsy reason'));
	        });
	    } else {
	      if (self.asyncOnly) {
	        return done(new Error('--async-only option in use without declaring `done()` or returning a promise'));
	      }

	      done();
	    }
	  }

	  function callFnAsync(fn) {
	    fn.call(ctx, function(err) {
	      if (err instanceof Error || toString.call(err) === '[object Error]') {
	        return done(err);
	      }
	      if (err) {
	        if (Object.prototype.toString.call(err) === '[object Object]') {
	          return done(new Error('done() invoked with non-Error: '
	            + JSON.stringify(err)));
	        }
	        return done(new Error('done() invoked with non-Error: ' + err));
	      }
	      done();
	    });
	  }
	};

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 108 */
/***/ function(module, exports) {

	
	/**
	 * Expose `Pending`.
	 */

	module.exports = Pending;

	/**
	 * Initialize a new `Pending` error with the given message.
	 *
	 * @param {string} message
	 */
	function Pending(message) {
	  this.message = message;
	}


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Runnable = __webpack_require__(107);
	var inherits = __webpack_require__(11).inherits;

	/**
	 * Expose `Test`.
	 */

	module.exports = Test;

	/**
	 * Initialize a new `Test` with the given `title` and callback `fn`.
	 *
	 * @api private
	 * @param {String} title
	 * @param {Function} fn
	 */
	function Test(title, fn) {
	  Runnable.call(this, title, fn);
	  this.pending = !fn;
	  this.type = 'test';
	  this.body = (fn || '').toString();
	}

	/**
	 * Inherit from `Runnable.prototype`.
	 */
	inherits(Test, Runnable);

	Test.prototype.clone = function() {
	  var test = new Test(this.title, this.fn);
	  test.timeout(this.timeout());
	  test.slow(this.slow());
	  test.enableTimeouts(this.enableTimeouts());
	  test.retries(this.retries());
	  test.currentRetry(this.currentRetry());
	  test.globals(this.globals());
	  test.parent = this.parent;
	  test.file = this.file;
	  test.ctx = this.ctx;
	  return test;
	};


/***/ },
/* 110 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * Functions common to more than one interface.
	 *
	 * @param {Suite[]} suites
	 * @param {Context} context
	 * @return {Object} An object containing common functions.
	 */
	module.exports = function(suites, context) {
	  return {
	    /**
	     * This is only present if flag --delay is passed into Mocha. It triggers
	     * root suite execution.
	     *
	     * @param {Suite} suite The root wuite.
	     * @return {Function} A function which runs the root suite
	     */
	    runWithSuite: function runWithSuite(suite) {
	      return function run() {
	        suite.run();
	      };
	    },

	    /**
	     * Execute before running tests.
	     *
	     * @param {string} name
	     * @param {Function} fn
	     */
	    before: function(name, fn) {
	      suites[0].beforeAll(name, fn);
	    },

	    /**
	     * Execute after running tests.
	     *
	     * @param {string} name
	     * @param {Function} fn
	     */
	    after: function(name, fn) {
	      suites[0].afterAll(name, fn);
	    },

	    /**
	     * Execute before each test case.
	     *
	     * @param {string} name
	     * @param {Function} fn
	     */
	    beforeEach: function(name, fn) {
	      suites[0].beforeEach(name, fn);
	    },

	    /**
	     * Execute after each test case.
	     *
	     * @param {string} name
	     * @param {Function} fn
	     */
	    afterEach: function(name, fn) {
	      suites[0].afterEach(name, fn);
	    },

	    test: {
	      /**
	       * Pending test case.
	       *
	       * @param {string} title
	       */
	      skip: function(title) {
	        context.test(title);
	      },

	      /**
	       * Number of retry attempts
	       *
	       * @param {string} n
	       */
	      retries: function(n) {
	        context.retries(n);
	      }
	    }
	  };
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Suite = __webpack_require__(104);
	var Test = __webpack_require__(109);
	var escapeRe = __webpack_require__(4);

	/**
	 * TDD-style interface:
	 *
	 *      suite('Array', function() {
	 *        suite('#indexOf()', function() {
	 *          suiteSetup(function() {
	 *
	 *          });
	 *
	 *          test('should return -1 when not present', function() {
	 *
	 *          });
	 *
	 *          test('should return the index when present', function() {
	 *
	 *          });
	 *
	 *          suiteTeardown(function() {
	 *
	 *          });
	 *        });
	 *      });
	 *
	 * @param {Suite} suite Root suite.
	 */
	module.exports = function(suite) {
	  var suites = [suite];

	  suite.on('pre-require', function(context, file, mocha) {
	    var common = __webpack_require__(110)(suites, context);

	    context.setup = common.beforeEach;
	    context.teardown = common.afterEach;
	    context.suiteSetup = common.before;
	    context.suiteTeardown = common.after;
	    context.run = mocha.options.delay && common.runWithSuite(suite);

	    /**
	     * Describe a "suite" with the given `title` and callback `fn` containing
	     * nested suites and/or tests.
	     */
	    context.suite = function(title, fn) {
	      var suite = Suite.create(suites[0], title);
	      suite.file = file;
	      suites.unshift(suite);
	      fn.call(suite);
	      suites.shift();
	      return suite;
	    };

	    /**
	     * Pending suite.
	     */
	    context.suite.skip = function(title, fn) {
	      var suite = Suite.create(suites[0], title);
	      suite.pending = true;
	      suites.unshift(suite);
	      fn.call(suite);
	      suites.shift();
	    };

	    /**
	     * Exclusive test-case.
	     */
	    context.suite.only = function(title, fn) {
	      var suite = context.suite(title, fn);
	      mocha.grep(suite.fullTitle());
	    };

	    /**
	     * Describe a specification or test-case with the given `title` and
	     * callback `fn` acting as a thunk.
	     */
	    context.test = function(title, fn) {
	      var suite = suites[0];
	      if (suite.pending) {
	        fn = null;
	      }
	      var test = new Test(title, fn);
	      test.file = file;
	      suite.addTest(test);
	      return test;
	    };

	    /**
	     * Exclusive test-case.
	     */

	    context.test.only = function(title, fn) {
	      var test = context.test(title, fn);
	      var reString = '^' + escapeRe(test.fullTitle()) + '$';
	      mocha.grep(new RegExp(reString));
	    };

	    context.test.skip = common.test.skip;
	    context.test.retries = common.test.retries;
	  });
	};


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Suite = __webpack_require__(104);
	var Test = __webpack_require__(109);
	var escapeRe = __webpack_require__(4);

	/**
	 * QUnit-style interface:
	 *
	 *     suite('Array');
	 *
	 *     test('#length', function() {
	 *       var arr = [1,2,3];
	 *       ok(arr.length == 3);
	 *     });
	 *
	 *     test('#indexOf()', function() {
	 *       var arr = [1,2,3];
	 *       ok(arr.indexOf(1) == 0);
	 *       ok(arr.indexOf(2) == 1);
	 *       ok(arr.indexOf(3) == 2);
	 *     });
	 *
	 *     suite('String');
	 *
	 *     test('#length', function() {
	 *       ok('foo'.length == 3);
	 *     });
	 *
	 * @param {Suite} suite Root suite.
	 */
	module.exports = function(suite) {
	  var suites = [suite];

	  suite.on('pre-require', function(context, file, mocha) {
	    var common = __webpack_require__(110)(suites, context);

	    context.before = common.before;
	    context.after = common.after;
	    context.beforeEach = common.beforeEach;
	    context.afterEach = common.afterEach;
	    context.run = mocha.options.delay && common.runWithSuite(suite);
	    /**
	     * Describe a "suite" with the given `title`.
	     */

	    context.suite = function(title) {
	      if (suites.length > 1) {
	        suites.shift();
	      }
	      var suite = Suite.create(suites[0], title);
	      suite.file = file;
	      suites.unshift(suite);
	      return suite;
	    };

	    /**
	     * Exclusive test-case.
	     */

	    context.suite.only = function(title, fn) {
	      var suite = context.suite(title, fn);
	      mocha.grep(suite.fullTitle());
	    };

	    /**
	     * Describe a specification or test-case
	     * with the given `title` and callback `fn`
	     * acting as a thunk.
	     */

	    context.test = function(title, fn) {
	      var test = new Test(title, fn);
	      test.file = file;
	      suites[0].addTest(test);
	      return test;
	    };

	    /**
	     * Exclusive test-case.
	     */

	    context.test.only = function(title, fn) {
	      var test = context.test(title, fn);
	      var reString = '^' + escapeRe(test.fullTitle()) + '$';
	      mocha.grep(new RegExp(reString));
	    };

	    context.test.skip = common.test.skip;
	    context.test.retries = common.test.retries;
	  });
	};


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Suite = __webpack_require__(104);
	var Test = __webpack_require__(109);

	/**
	 * TDD-style interface:
	 *
	 *     exports.Array = {
	 *       '#indexOf()': {
	 *         'should return -1 when the value is not present': function() {
	 *
	 *         },
	 *
	 *         'should return the correct index when the value is present': function() {
	 *
	 *         }
	 *       }
	 *     };
	 *
	 * @param {Suite} suite Root suite.
	 */
	module.exports = function(suite) {
	  var suites = [suite];

	  suite.on('require', visit);

	  function visit(obj, file) {
	    var suite;
	    for (var key in obj) {
	      if (typeof obj[key] === 'function') {
	        var fn = obj[key];
	        switch (key) {
	          case 'before':
	            suites[0].beforeAll(fn);
	            break;
	          case 'after':
	            suites[0].afterAll(fn);
	            break;
	          case 'beforeEach':
	            suites[0].beforeEach(fn);
	            break;
	          case 'afterEach':
	            suites[0].afterEach(fn);
	            break;
	          default:
	            var test = new Test(key, fn);
	            test.file = file;
	            suites[0].addTest(test);
	        }
	      } else {
	        suite = Suite.create(suites[0], key);
	        suites.unshift(suite);
	        visit(obj[key], file);
	        suites.shift();
	      }
	    }
	  }
	};


/***/ },
/* 114 */
/***/ function(module, exports) {

	/**
	 * Expose `Context`.
	 */

	module.exports = Context;

	/**
	 * Initialize a new `Context`.
	 *
	 * @api private
	 */
	function Context() {}

	/**
	 * Set or get the context `Runnable` to `runnable`.
	 *
	 * @api private
	 * @param {Runnable} runnable
	 * @return {Context}
	 */
	Context.prototype.runnable = function(runnable) {
	  if (!arguments.length) {
	    return this._runnable;
	  }
	  this.test = this._runnable = runnable;
	  return this;
	};

	/**
	 * Set test timeout `ms`.
	 *
	 * @api private
	 * @param {number} ms
	 * @return {Context} self
	 */
	Context.prototype.timeout = function(ms) {
	  if (!arguments.length) {
	    return this.runnable().timeout();
	  }
	  this.runnable().timeout(ms);
	  return this;
	};

	/**
	 * Set test timeout `enabled`.
	 *
	 * @api private
	 * @param {boolean} enabled
	 * @return {Context} self
	 */
	Context.prototype.enableTimeouts = function(enabled) {
	  this.runnable().enableTimeouts(enabled);
	  return this;
	};

	/**
	 * Set test slowness threshold `ms`.
	 *
	 * @api private
	 * @param {number} ms
	 * @return {Context} self
	 */
	Context.prototype.slow = function(ms) {
	  this.runnable().slow(ms);
	  return this;
	};

	/**
	 * Mark a test as skipped.
	 *
	 * @api private
	 * @return {Context} self
	 */
	Context.prototype.skip = function() {
	  this.runnable().skip();
	  return this;
	};

	/**
	 * Allow a number of retries on failed tests
	 *
	 * @api private
	 * @param {number} n
	 * @return {Context} self
	 */
	Context.prototype.retries = function(n) {
	  if (!arguments.length) {
	    return this.runnable().retries();
	  }
	  this.runnable().retries(n);
	  return this;
	};

	/**
	 * Inspect the context void of `._runnable`.
	 *
	 * @api private
	 * @return {string}
	 */
	Context.prototype.inspect = function() {
	  return JSON.stringify(this, function(key, val) {
	    return key === 'runnable' || key === 'test' ? undefined : val;
	  }, 2);
	};


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {/**
	 * Module dependencies.
	 */

	var EventEmitter = __webpack_require__(105).EventEmitter;
	var Pending = __webpack_require__(108);
	var utils = __webpack_require__(11);
	var inherits = utils.inherits;
	var debug = __webpack_require__(16)('mocha:runner');
	var Runnable = __webpack_require__(107);
	var filter = utils.filter;
	var indexOf = utils.indexOf;
	var keys = utils.keys;
	var stackFilter = utils.stackTraceFilter();
	var stringify = utils.stringify;
	var type = utils.type;
	var undefinedError = utils.undefinedError;
	var isArray = utils.isArray;

	/**
	 * Non-enumerable globals.
	 */

	var globals = [
	  'setTimeout',
	  'clearTimeout',
	  'setInterval',
	  'clearInterval',
	  'XMLHttpRequest',
	  'Date',
	  'setImmediate',
	  'clearImmediate'
	];

	/**
	 * Expose `Runner`.
	 */

	module.exports = Runner;

	/**
	 * Initialize a `Runner` for the given `suite`.
	 *
	 * Events:
	 *
	 *   - `start`  execution started
	 *   - `end`  execution complete
	 *   - `suite`  (suite) test suite execution started
	 *   - `suite end`  (suite) all tests (and sub-suites) have finished
	 *   - `test`  (test) test execution started
	 *   - `test end`  (test) test completed
	 *   - `hook`  (hook) hook execution started
	 *   - `hook end`  (hook) hook complete
	 *   - `pass`  (test) test passed
	 *   - `fail`  (test, err) test failed
	 *   - `pending`  (test) test pending
	 *
	 * @api public
	 * @param {Suite} suite Root suite
	 * @param {boolean} [delay] Whether or not to delay execution of root suite
	 * until ready.
	 */
	function Runner(suite, delay) {
	  var self = this;
	  this._globals = [];
	  this._abort = false;
	  this._delay = delay;
	  this.suite = suite;
	  this.started = false;
	  this.total = suite.total();
	  this.failures = 0;
	  this.on('test end', function(test) {
	    self.checkGlobals(test);
	  });
	  this.on('hook end', function(hook) {
	    self.checkGlobals(hook);
	  });
	  this._defaultGrep = /.*/;
	  this.grep(this._defaultGrep);
	  this.globals(this.globalProps().concat(extraGlobals()));
	}

	/**
	 * Wrapper for setImmediate, process.nextTick, or browser polyfill.
	 *
	 * @param {Function} fn
	 * @api private
	 */
	Runner.immediately = global.setImmediate || process.nextTick;

	/**
	 * Inherit from `EventEmitter.prototype`.
	 */
	inherits(Runner, EventEmitter);

	/**
	 * Run tests with full titles matching `re`. Updates runner.total
	 * with number of tests matched.
	 *
	 * @param {RegExp} re
	 * @param {Boolean} invert
	 * @return {Runner} for chaining
	 * @api public
	 * @param {RegExp} re
	 * @param {boolean} invert
	 * @return {Runner} Runner instance.
	 */
	Runner.prototype.grep = function(re, invert) {
	  debug('grep %s', re);
	  this._grep = re;
	  this._invert = invert;
	  this.total = this.grepTotal(this.suite);
	  return this;
	};

	/**
	 * Returns the number of tests matching the grep search for the
	 * given suite.
	 *
	 * @param {Suite} suite
	 * @return {Number}
	 * @api public
	 * @param {Suite} suite
	 * @return {number}
	 */
	Runner.prototype.grepTotal = function(suite) {
	  var self = this;
	  var total = 0;

	  suite.eachTest(function(test) {
	    var match = self._grep.test(test.fullTitle());
	    if (self._invert) {
	      match = !match;
	    }
	    if (match) {
	      total++;
	    }
	  });

	  return total;
	};

	/**
	 * Return a list of global properties.
	 *
	 * @return {Array}
	 * @api private
	 */
	Runner.prototype.globalProps = function() {
	  var props = keys(global);

	  // non-enumerables
	  for (var i = 0; i < globals.length; ++i) {
	    if (~indexOf(props, globals[i])) {
	      continue;
	    }
	    props.push(globals[i]);
	  }

	  return props;
	};

	/**
	 * Allow the given `arr` of globals.
	 *
	 * @param {Array} arr
	 * @return {Runner} for chaining
	 * @api public
	 * @param {Array} arr
	 * @return {Runner} Runner instance.
	 */
	Runner.prototype.globals = function(arr) {
	  if (!arguments.length) {
	    return this._globals;
	  }
	  debug('globals %j', arr);
	  this._globals = this._globals.concat(arr);
	  return this;
	};

	/**
	 * Check for global variable leaks.
	 *
	 * @api private
	 */
	Runner.prototype.checkGlobals = function(test) {
	  if (this.ignoreLeaks) {
	    return;
	  }
	  var ok = this._globals;

	  var globals = this.globalProps();
	  var leaks;

	  if (test) {
	    ok = ok.concat(test._allowedGlobals || []);
	  }

	  if (this.prevGlobalsLength === globals.length) {
	    return;
	  }
	  this.prevGlobalsLength = globals.length;

	  leaks = filterLeaks(ok, globals);
	  this._globals = this._globals.concat(leaks);

	  if (leaks.length > 1) {
	    this.fail(test, new Error('global leaks detected: ' + leaks.join(', ') + ''));
	  } else if (leaks.length) {
	    this.fail(test, new Error('global leak detected: ' + leaks[0]));
	  }
	};

	/**
	 * Fail the given `test`.
	 *
	 * @api private
	 * @param {Test} test
	 * @param {Error} err
	 */
	Runner.prototype.fail = function(test, err) {
	  ++this.failures;
	  test.state = 'failed';

	  if (!(err instanceof Error || err && typeof err.message === 'string')) {
	    err = new Error('the ' + type(err) + ' ' + stringify(err) + ' was thrown, throw an Error :)');
	  }

	  err.stack = (this.fullStackTrace || !err.stack)
	    ? err.stack
	    : stackFilter(err.stack);

	  this.emit('fail', test, err);
	};

	/**
	 * Fail the given `hook` with `err`.
	 *
	 * Hook failures work in the following pattern:
	 * - If bail, then exit
	 * - Failed `before` hook skips all tests in a suite and subsuites,
	 *   but jumps to corresponding `after` hook
	 * - Failed `before each` hook skips remaining tests in a
	 *   suite and jumps to corresponding `after each` hook,
	 *   which is run only once
	 * - Failed `after` hook does not alter
	 *   execution order
	 * - Failed `after each` hook skips remaining tests in a
	 *   suite and subsuites, but executes other `after each`
	 *   hooks
	 *
	 * @api private
	 * @param {Hook} hook
	 * @param {Error} err
	 */
	Runner.prototype.failHook = function(hook, err) {
	  if (hook.ctx && hook.ctx.currentTest) {
	    hook.originalTitle = hook.originalTitle || hook.title;
	    hook.title = hook.originalTitle + ' for "' + hook.ctx.currentTest.title + '"';
	  }

	  this.fail(hook, err);
	  if (this.suite.bail()) {
	    this.emit('end');
	  }
	};

	/**
	 * Run hook `name` callbacks and then invoke `fn()`.
	 *
	 * @api private
	 * @param {string} name
	 * @param {Function} fn
	 */

	Runner.prototype.hook = function(name, fn) {
	  var suite = this.suite;
	  var hooks = suite['_' + name];
	  var self = this;

	  function next(i) {
	    var hook = hooks[i];
	    if (!hook) {
	      return fn();
	    }
	    self.currentRunnable = hook;

	    hook.ctx.currentTest = self.test;

	    self.emit('hook', hook);

	    if (!hook.listeners('error').length) {
	      hook.on('error', function(err) {
	        self.failHook(hook, err);
	      });
	    }

	    hook.run(function(err) {
	      var testError = hook.error();
	      if (testError) {
	        self.fail(self.test, testError);
	      }
	      if (err) {
	        if (err instanceof Pending) {
	          suite.pending = true;
	        } else {
	          self.failHook(hook, err);

	          // stop executing hooks, notify callee of hook err
	          return fn(err);
	        }
	      }
	      self.emit('hook end', hook);
	      delete hook.ctx.currentTest;
	      next(++i);
	    });
	  }

	  Runner.immediately(function() {
	    next(0);
	  });
	};

	/**
	 * Run hook `name` for the given array of `suites`
	 * in order, and callback `fn(err, errSuite)`.
	 *
	 * @api private
	 * @param {string} name
	 * @param {Array} suites
	 * @param {Function} fn
	 */
	Runner.prototype.hooks = function(name, suites, fn) {
	  var self = this;
	  var orig = this.suite;

	  function next(suite) {
	    self.suite = suite;

	    if (!suite) {
	      self.suite = orig;
	      return fn();
	    }

	    self.hook(name, function(err) {
	      if (err) {
	        var errSuite = self.suite;
	        self.suite = orig;
	        return fn(err, errSuite);
	      }

	      next(suites.pop());
	    });
	  }

	  next(suites.pop());
	};

	/**
	 * Run hooks from the top level down.
	 *
	 * @param {String} name
	 * @param {Function} fn
	 * @api private
	 */
	Runner.prototype.hookUp = function(name, fn) {
	  var suites = [this.suite].concat(this.parents()).reverse();
	  this.hooks(name, suites, fn);
	};

	/**
	 * Run hooks from the bottom up.
	 *
	 * @param {String} name
	 * @param {Function} fn
	 * @api private
	 */
	Runner.prototype.hookDown = function(name, fn) {
	  var suites = [this.suite].concat(this.parents());
	  this.hooks(name, suites, fn);
	};

	/**
	 * Return an array of parent Suites from
	 * closest to furthest.
	 *
	 * @return {Array}
	 * @api private
	 */
	Runner.prototype.parents = function() {
	  var suite = this.suite;
	  var suites = [];
	  while (suite.parent) {
	    suite = suite.parent;
	    suites.push(suite);
	  }
	  return suites;
	};

	/**
	 * Run the current test and callback `fn(err)`.
	 *
	 * @param {Function} fn
	 * @api private
	 */
	Runner.prototype.runTest = function(fn) {
	  var self = this;
	  var test = this.test;

	  if (this.asyncOnly) {
	    test.asyncOnly = true;
	  }

	  if (this.allowUncaught) {
	    test.allowUncaught = true;
	    return test.run(fn);
	  }
	  try {
	    test.on('error', function(err) {
	      self.fail(test, err);
	    });
	    test.run(fn);
	  } catch (err) {
	    fn(err);
	  }
	};

	/**
	 * Run tests in the given `suite` and invoke the callback `fn()` when complete.
	 *
	 * @api private
	 * @param {Suite} suite
	 * @param {Function} fn
	 */
	Runner.prototype.runTests = function(suite, fn) {
	  var self = this;
	  var tests = suite.tests.slice();
	  var test;

	  function hookErr(_, errSuite, after) {
	    // before/after Each hook for errSuite failed:
	    var orig = self.suite;

	    // for failed 'after each' hook start from errSuite parent,
	    // otherwise start from errSuite itself
	    self.suite = after ? errSuite.parent : errSuite;

	    if (self.suite) {
	      // call hookUp afterEach
	      self.hookUp('afterEach', function(err2, errSuite2) {
	        self.suite = orig;
	        // some hooks may fail even now
	        if (err2) {
	          return hookErr(err2, errSuite2, true);
	        }
	        // report error suite
	        fn(errSuite);
	      });
	    } else {
	      // there is no need calling other 'after each' hooks
	      self.suite = orig;
	      fn(errSuite);
	    }
	  }

	  function next(err, errSuite) {
	    // if we bail after first err
	    if (self.failures && suite._bail) {
	      return fn();
	    }

	    if (self._abort) {
	      return fn();
	    }

	    if (err) {
	      return hookErr(err, errSuite, true);
	    }

	    // next test
	    test = tests.shift();

	    // all done
	    if (!test) {
	      return fn();
	    }

	    // grep
	    var match = self._grep.test(test.fullTitle());
	    if (self._invert) {
	      match = !match;
	    }
	    if (!match) {
	      // Run immediately only if we have defined a grep. When we
	      // define a grep — It can cause maximum callstack error if
	      // the grep is doing a large recursive loop by neglecting
	      // all tests. The run immediately function also comes with
	      // a performance cost. So we don't want to run immediately
	      // if we run the whole test suite, because running the whole
	      // test suite don't do any immediate recursive loops. Thus,
	      // allowing a JS runtime to breathe.
	      if (self._grep !== self._defaultGrep) {
	        Runner.immediately(next);
	      } else {
	        next();
	      }
	      return;
	    }

	    function parentPending(suite) {
	      return suite.pending || (suite.parent && parentPending(suite.parent));
	    }

	    // pending
	    if (test.pending || parentPending(test.parent)) {
	      self.emit('pending', test);
	      self.emit('test end', test);
	      return next();
	    }

	    // execute test and hook(s)
	    self.emit('test', self.test = test);
	    self.hookDown('beforeEach', function(err, errSuite) {
	      if (suite.pending) {
	        self.emit('pending', test);
	        self.emit('test end', test);
	        return next();
	      }
	      if (err) {
	        return hookErr(err, errSuite, false);
	      }
	      self.currentRunnable = self.test;
	      self.runTest(function(err) {
	        test = self.test;
	        if (err) {
	          var retry = test.currentRetry();
	          if (err instanceof Pending) {
	            test.pending = true;
	            self.emit('pending', test);
	          } else if (retry < test.retries()) {
	            var clonedTest = test.clone();
	            clonedTest.currentRetry(retry + 1);
	            tests.unshift(clonedTest);

	            // Early return + hook trigger so that it doesn't
	            // increment the count wrong
	            return self.hookUp('afterEach', next);
	          } else {
	            self.fail(test, err);
	          }
	          self.emit('test end', test);

	          if (err instanceof Pending) {
	            return next();
	          }

	          return self.hookUp('afterEach', next);
	        }

	        test.state = 'passed';
	        self.emit('pass', test);
	        self.emit('test end', test);
	        self.hookUp('afterEach', next);
	      });
	    });
	  }

	  this.next = next;
	  this.hookErr = hookErr;
	  next();
	};

	/**
	 * Run the given `suite` and invoke the callback `fn()` when complete.
	 *
	 * @api private
	 * @param {Suite} suite
	 * @param {Function} fn
	 */
	Runner.prototype.runSuite = function(suite, fn) {
	  var i = 0;
	  var self = this;
	  var total = this.grepTotal(suite);
	  var afterAllHookCalled = false;

	  debug('run suite %s', suite.fullTitle());

	  if (!total || (self.failures && suite._bail)) {
	    return fn();
	  }

	  this.emit('suite', this.suite = suite);

	  function next(errSuite) {
	    if (errSuite) {
	      // current suite failed on a hook from errSuite
	      if (errSuite === suite) {
	        // if errSuite is current suite
	        // continue to the next sibling suite
	        return done();
	      }
	      // errSuite is among the parents of current suite
	      // stop execution of errSuite and all sub-suites
	      return done(errSuite);
	    }

	    if (self._abort) {
	      return done();
	    }

	    var curr = suite.suites[i++];
	    if (!curr) {
	      return done();
	    }

	    // Avoid grep neglecting large number of tests causing a
	    // huge recursive loop and thus a maximum call stack error.
	    // See comment in `this.runTests()` for more information.
	    if (self._grep !== self._defaultGrep) {
	      Runner.immediately(function() {
	        self.runSuite(curr, next);
	      });
	    } else {
	      self.runSuite(curr, next);
	    }
	  }

	  function done(errSuite) {
	    self.suite = suite;
	    self.nextSuite = next;

	    if (afterAllHookCalled) {
	      fn(errSuite);
	    } else {
	      // mark that the afterAll block has been called once
	      // and so can be skipped if there is an error in it.
	      afterAllHookCalled = true;

	      // remove reference to test
	      delete self.test;

	      self.hook('afterAll', function() {
	        self.emit('suite end', suite);
	        fn(errSuite);
	      });
	    }
	  }

	  this.nextSuite = next;

	  this.hook('beforeAll', function(err) {
	    if (err) {
	      return done();
	    }
	    self.runTests(suite, next);
	  });
	};

	/**
	 * Handle uncaught exceptions.
	 *
	 * @param {Error} err
	 * @api private
	 */
	Runner.prototype.uncaught = function(err) {
	  if (err) {
	    debug('uncaught exception %s', err !== function() {
	      return this;
	    }.call(err) ? err : (err.message || err));
	  } else {
	    debug('uncaught undefined exception');
	    err = undefinedError();
	  }
	  err.uncaught = true;

	  var runnable = this.currentRunnable;

	  if (!runnable) {
	    runnable = new Runnable('Uncaught error outside test suite');
	    runnable.parent = this.suite;

	    if (this.started) {
	      this.fail(runnable, err);
	    } else {
	      // Can't recover from this failure
	      this.emit('start');
	      this.fail(runnable, err);
	      this.emit('end');
	    }

	    return;
	  }

	  runnable.clearTimeout();

	  // Ignore errors if complete
	  if (runnable.state) {
	    return;
	  }
	  this.fail(runnable, err);

	  // recover from test
	  if (runnable.type === 'test') {
	    this.emit('test end', runnable);
	    this.hookUp('afterEach', this.next);
	    return;
	  }

	 // recover from hooks
	  if (runnable.type === 'hook') {
	    var errSuite = this.suite;
	    // if hook failure is in afterEach block
	    if (runnable.fullTitle().indexOf('after each') > -1) {
	      return this.hookErr(err, errSuite, true);
	    }
	    // if hook failure is in beforeEach block
	    if (runnable.fullTitle().indexOf('before each') > -1) {
	      return this.hookErr(err, errSuite, false);
	    }
	    // if hook failure is in after or before blocks
	    return this.nextSuite(errSuite);
	  }

	  // bail
	  this.emit('end');
	};

	/**
	 * Cleans up the references to all the deferred functions
	 * (before/after/beforeEach/afterEach) and tests of a Suite.
	 * These must be deleted otherwise a memory leak can happen,
	 * as those functions may reference variables from closures,
	 * thus those variables can never be garbage collected as long
	 * as the deferred functions exist.
	 *
	 * @param {Suite} suite
	 */
	function cleanSuiteReferences(suite) {
	  function cleanArrReferences(arr) {
	    for (var i = 0; i < arr.length; i++) {
	      delete arr[i].fn;
	    }
	  }

	  if (isArray(suite._beforeAll)) {
	    cleanArrReferences(suite._beforeAll);
	  }

	  if (isArray(suite._beforeEach)) {
	    cleanArrReferences(suite._beforeEach);
	  }

	  if (isArray(suite._afterAll)) {
	    cleanArrReferences(suite._afterAll);
	  }

	  if (isArray(suite._afterEach)) {
	    cleanArrReferences(suite._afterEach);
	  }

	  for (var i = 0; i < suite.tests.length; i++) {
	    delete suite.tests[i].fn;
	  }
	}

	/**
	 * Run the root suite and invoke `fn(failures)`
	 * on completion.
	 *
	 * @param {Function} fn
	 * @return {Runner} for chaining
	 * @api public
	 * @param {Function} fn
	 * @return {Runner} Runner instance.
	 */
	Runner.prototype.run = function(fn) {
	  var self = this;
	  var rootSuite = this.suite;

	  fn = fn || function() {};

	  function uncaught(err) {
	    self.uncaught(err);
	  }

	  function start() {
	    self.started = true;
	    self.emit('start');
	    self.runSuite(rootSuite, function() {
	      debug('finished running');
	      self.emit('end');
	    });
	  }

	  debug('start');

	  // references cleanup to avoid memory leaks
	  this.on('suite end', cleanSuiteReferences);

	  // callback
	  this.on('end', function() {
	    debug('end');
	    process.removeListener('uncaughtException', uncaught);
	    fn(self.failures);
	  });

	  // uncaught exception
	  process.on('uncaughtException', uncaught);

	  if (this._delay) {
	    // for reporters, I guess.
	    // might be nice to debounce some dots while we wait.
	    this.emit('waiting', rootSuite);
	    rootSuite.once('run', start);
	  } else {
	    start();
	  }

	  return this;
	};

	/**
	 * Cleanly abort execution.
	 *
	 * @api public
	 * @return {Runner} Runner instance.
	 */
	Runner.prototype.abort = function() {
	  debug('aborting');
	  this._abort = true;

	  return this;
	};

	/**
	 * Filter leaks with the given globals flagged as `ok`.
	 *
	 * @api private
	 * @param {Array} ok
	 * @param {Array} globals
	 * @return {Array}
	 */
	function filterLeaks(ok, globals) {
	  return filter(globals, function(key) {
	    // Firefox and Chrome exposes iframes as index inside the window object
	    if (/^d+/.test(key)) {
	      return false;
	    }

	    // in firefox
	    // if runner runs in an iframe, this iframe's window.getInterface method not init at first
	    // it is assigned in some seconds
	    if (global.navigator && (/^getInterface/).test(key)) {
	      return false;
	    }

	    // an iframe could be approached by window[iframeIndex]
	    // in ie6,7,8 and opera, iframeIndex is enumerable, this could cause leak
	    if (global.navigator && (/^\d+/).test(key)) {
	      return false;
	    }

	    // Opera and IE expose global variables for HTML element IDs (issue #243)
	    if (/^mocha-/.test(key)) {
	      return false;
	    }

	    var matched = filter(ok, function(ok) {
	      if (~ok.indexOf('*')) {
	        return key.indexOf(ok.split('*')[0]) === 0;
	      }
	      return key === ok;
	    });
	    return !matched.length && (!global.navigator || key !== 'onerror');
	  });
	}

	/**
	 * Array of globals dependent on the environment.
	 *
	 * @return {Array}
	 * @api private
	 */
	function extraGlobals() {
	  if (typeof process === 'object' && typeof process.version === 'string') {
	    var parts = process.version.split('.');
	    var nodeVersion = utils.reduce(parts, function(a, v) {
	      return a << 8 | v;
	    });

	    // 'errno' was renamed to process._errno in v0.9.11.

	    if (nodeVersion < 0x00090B) {
	      return ['errno'];
	    }
	  }

	  return [];
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(1)))

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./browser/debug": 16,
		"./browser/debug.js": 16,
		"./browser/events": 105,
		"./browser/events.js": 105,
		"./browser/progress": 43,
		"./browser/progress.js": 43,
		"./browser/tty": 8,
		"./browser/tty.js": 8,
		"./context": 114,
		"./context.js": 114,
		"./hook": 106,
		"./hook.js": 106,
		"./interfaces/bdd": 103,
		"./interfaces/bdd.js": 103,
		"./interfaces/common": 110,
		"./interfaces/common.js": 110,
		"./interfaces/exports": 113,
		"./interfaces/exports.js": 113,
		"./interfaces/index": 102,
		"./interfaces/index.js": 102,
		"./interfaces/qunit": 112,
		"./interfaces/qunit.js": 112,
		"./interfaces/tdd": 111,
		"./interfaces/tdd.js": 111,
		"./mocha": 2,
		"./mocha.js": 2,
		"./ms": 10,
		"./ms.js": 10,
		"./pending": 108,
		"./pending.js": 108,
		"./reporters/base": 7,
		"./reporters/base.js": 7,
		"./reporters/doc": 39,
		"./reporters/doc.js": 39,
		"./reporters/dot": 38,
		"./reporters/dot.js": 38,
		"./reporters/html": 42,
		"./reporters/html-cov": 54,
		"./reporters/html-cov.js": 54,
		"./reporters/html.js": 42,
		"./reporters/index": 6,
		"./reporters/index.js": 6,
		"./reporters/json": 41,
		"./reporters/json-cov": 53,
		"./reporters/json-cov.js": 53,
		"./reporters/json-stream": 101,
		"./reporters/json-stream.js": 101,
		"./reporters/json.js": 41,
		"./reporters/landing": 52,
		"./reporters/landing.js": 52,
		"./reporters/list": 44,
		"./reporters/list.js": 44,
		"./reporters/markdown": 50,
		"./reporters/markdown.js": 50,
		"./reporters/min": 45,
		"./reporters/min.js": 45,
		"./reporters/nyan": 47,
		"./reporters/nyan.js": 47,
		"./reporters/progress": 51,
		"./reporters/progress.js": 51,
		"./reporters/spec": 46,
		"./reporters/spec.js": 46,
		"./reporters/tap": 40,
		"./reporters/tap.js": 40,
		"./reporters/xunit": 48,
		"./reporters/xunit.js": 48,
		"./runnable": 107,
		"./runnable.js": 107,
		"./runner": 115,
		"./runner.js": 115,
		"./suite": 104,
		"./suite.js": 104,
		"./test": 109,
		"./test.js": 109,
		"./utils": 11,
		"./utils.js": 11
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 116;


/***/ },
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Growl - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

	/**
	 * Module dependencies.
	 */

	var exec = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"child_process\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())).exec
	  , fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))
	  , path = __webpack_require__(5)
	  , exists = fs.existsSync || path.existsSync
	  , os = __webpack_require__(123)
	  , quote = JSON.stringify
	  , cmd;

	function which(name) {
	  var paths = process.env.PATH.split(':');
	  var loc;
	  
	  for (var i = 0, len = paths.length; i < len; ++i) {
	    loc = path.join(paths[i], name);
	    if (exists(loc)) return loc;
	  }
	}

	switch(os.type()) {
	  case 'Darwin':
	    if (which('terminal-notifier')) {
	      cmd = {
	          type: "Darwin-NotificationCenter"
	        , pkg: "terminal-notifier"
	        , msg: '-message'
	        , title: '-title'
	        , subtitle: '-subtitle'
	        , priority: {
	              cmd: '-execute'
	            , range: []
	          }
	      };
	    } else {
	      cmd = {
	          type: "Darwin-Growl"
	        , pkg: "growlnotify"
	        , msg: '-m'
	        , sticky: '--sticky'
	        , priority: {
	              cmd: '--priority'
	            , range: [
	                -2
	              , -1
	              , 0
	              , 1
	              , 2
	              , "Very Low"
	              , "Moderate"
	              , "Normal"
	              , "High"
	              , "Emergency"
	            ]
	          }
	      };
	    }
	    break;
	  case 'Linux':
	    cmd = {
	        type: "Linux"
	      , pkg: "notify-send"
	      , msg: ''
	      , sticky: '-t 0'
	      , icon: '-i'
	      , priority: {
	          cmd: '-u'
	        , range: [
	            "low"
	          , "normal"
	          , "critical"
	        ]
	      }
	    };
	    break;
	  case 'Windows_NT':
	    cmd = {
	        type: "Windows"
	      , pkg: "growlnotify"
	      , msg: ''
	      , sticky: '/s:true'
	      , title: '/t:'
	      , icon: '/i:'
	      , priority: {
	            cmd: '/p:'
	          , range: [
	              -2
	            , -1
	            , 0
	            , 1
	            , 2
	          ]
	        }
	    };
	    break;
	}

	/**
	 * Expose `growl`.
	 */

	exports = module.exports = growl;

	/**
	 * Node-growl version.
	 */

	exports.version = '1.4.1'

	/**
	 * Send growl notification _msg_ with _options_.
	 *
	 * Options:
	 *
	 *  - title   Notification title
	 *  - sticky  Make the notification stick (defaults to false)
	 *  - priority  Specify an int or named key (default is 0)
	 *  - name    Application name (defaults to growlnotify)
	 *  - image
	 *    - path to an icon sets --iconpath
	 *    - path to an image sets --image
	 *    - capitalized word sets --appIcon
	 *    - filename uses extname as --icon
	 *    - otherwise treated as --icon
	 *
	 * Examples:
	 *
	 *   growl('New email')
	 *   growl('5 new emails', { title: 'Thunderbird' })
	 *   growl('Email sent', function(){
	 *     // ... notification sent
	 *   })
	 *
	 * @param {string} msg
	 * @param {object} options
	 * @param {function} fn
	 * @api public
	 */

	function growl(msg, options, fn) {
	  var image
	    , args
	    , options = options || {}
	    , fn = fn || function(){};

	  // noop
	  if (!cmd) return fn(new Error('growl not supported on this platform'));
	  args = [cmd.pkg];

	  // image
	  if (image = options.image) {
	    switch(cmd.type) {
	      case 'Darwin-Growl':
	        var flag, ext = path.extname(image).substr(1)
	        flag = flag || ext == 'icns' && 'iconpath'
	        flag = flag || /^[A-Z]/.test(image) && 'appIcon'
	        flag = flag || /^png|gif|jpe?g$/.test(ext) && 'image'
	        flag = flag || ext && (image = ext) && 'icon'
	        flag = flag || 'icon'
	        args.push('--' + flag, quote(image))
	        break;
	      case 'Linux':
	        args.push(cmd.icon, quote(image));
	        // libnotify defaults to sticky, set a hint for transient notifications
	        if (!options.sticky) args.push('--hint=int:transient:1');
	        break;
	      case 'Windows':
	        args.push(cmd.icon + quote(image));
	        break;
	    }
	  }

	  // sticky
	  if (options.sticky) args.push(cmd.sticky);

	  // priority
	  if (options.priority) {
	    var priority = options.priority + '';
	    var checkindexOf = cmd.priority.range.indexOf(priority);
	    if (~cmd.priority.range.indexOf(priority)) {
	      args.push(cmd.priority, options.priority);
	    }
	  }

	  // name
	  if (options.name && cmd.type === "Darwin-Growl") {
	    args.push('--name', options.name);
	  }

	  switch(cmd.type) {
	    case 'Darwin-Growl':
	      args.push(cmd.msg);
	      args.push(quote(msg));
	      if (options.title) args.push(quote(options.title));
	      break;
	    case 'Darwin-NotificationCenter':
	      args.push(cmd.msg);
	      args.push(quote(msg));
	      if (options.title) {
	        args.push(cmd.title);
	        args.push(quote(options.title));
	      }
	      if (options.subtitle) {
	        args.push(cmd.subtitle);
	        args.push(quote(options.subtitle));
	      }
	      break;
	    case 'Darwin-Growl':
	      args.push(cmd.msg);
	      args.push(quote(msg));
	      if (options.title) args.push(quote(options.title));
	      break;
	    case 'Linux':
	      if (options.title) {
	        args.push(quote(options.title));
	        args.push(cmd.msg);
	        args.push(quote(msg));
	      } else {
	        args.push(quote(msg));
	      }
	      break;
	    case 'Windows':
	      args.push(quote(msg));
	      if (options.title) args.push(cmd.title + quote(options.title));
	      break;
	  }

	  // execute
	  exec(args.join(' '), fn);
	};

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ },
/* 123 */
/***/ function(module, exports) {

	exports.endianness = function () { return 'LE' };

	exports.hostname = function () {
	    if (typeof location !== 'undefined') {
	        return location.hostname
	    }
	    else return '';
	};

	exports.loadavg = function () { return [] };

	exports.uptime = function () { return 0 };

	exports.freemem = function () {
	    return Number.MAX_VALUE;
	};

	exports.totalmem = function () {
	    return Number.MAX_VALUE;
	};

	exports.cpus = function () { return [] };

	exports.type = function () { return 'Browser' };

	exports.release = function () {
	    if (typeof navigator !== 'undefined') {
	        return navigator.appVersion;
	    }
	    return '';
	};

	exports.networkInterfaces
	= exports.getNetworkInterfaces
	= function () { return {} };

	exports.arch = function () { return 'javascript' };

	exports.platform = function () { return 'browser' };

	exports.tmpdir = exports.tmpDir = function () {
	    return '/tmp';
	};

	exports.EOL = '\n';


/***/ }
/******/ ]);