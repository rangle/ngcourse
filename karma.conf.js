module.exports = function(config) {

  config.set({
    basePath: 'client/',
    frameworks: ['mocha', 'chai', 'sinon'],
    preprocessors: {
      '**/*.html': 'ng-html2js'
    },
    exclude: ['node_modules'],
    reporters: ['spec'],
    port: 9999,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['Chrome'], // Alternatively: 'PhantomJS'
    captureTimeout: 6000,
    singleRun: false
  });
};
