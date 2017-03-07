module.exports = function (config) {

  console.log(process.cwd());
  config.set({
    basePath: 'client/',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: [],
    exclude: [],
    reporters: ['progress'],
    port: 9999,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['Chrome'], // Alternatively: 'PhantomJS'
    captureTimeout: 6000,
    singleRun: false
  });
};