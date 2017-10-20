const path = require('path');
const webpackConfig = require(`${__dirname}/./scripts/webpack.tests.config.js`);

const tests = `${process.cwd()}/./src/**/*.spec.js`;

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [
      tests
    ],
    exclude: [],
    preprocessors: {
      [tests]: ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: "errors-only"
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeWithoutSecurity'],
    customLaunchers: {
      ChromeWithoutSecurity: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },
    singleRun: true,
    concurrency: Infinity
  });
};