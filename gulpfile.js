var gulp = require('gulp');
var rg = require('rangle-gulp');

var karmaVendorFiles = [
  'client/bower_components/angular/angular.js',
  'client/bower_components/angular-mocks/angular-mocks.js',
  'client/bower_components/sinon-chai/lib/sinon-chai.js',
<<<<<<< HEAD
  'client/bower_components/koast-angular/dist/koast.js',
=======
  'client/bower_components/koast/client/dist/koast.js',
>>>>>>> FETCH_HEAD
  'client/testing/lib/q.js',
  'client/testing/test-utils.js',
  'client/bower_components/lodash/dist/lodash.js'
];

gulp.task('karma', rg.karma({
  // files: specify which folders (optional)
  // karmaConf: specify which karma config file (optional)
  //karmaConf: 'client/testing/karma.conf.js',
  vendor: karmaVendorFiles
}));

gulp.task('karma-watch', rg.karmaWatch({
  // files: specify which folders (optional)
  // karmaConf: specify which karma config file (optional)
  vendor: karmaVendorFiles
}));

gulp.task('api-test', rg.mocha({
<<<<<<< HEAD
  files: 'server/testing/*.js'
=======
  files: 'server/testing/e2e/api-test.js'
>>>>>>> FETCH_HEAD
}));

gulp.task('lint', rg.jshint({
  // files: specify which files (optional)
}));

gulp.task('beautify', rg.beautify({
  // files: specify which files (optional)
}));

gulp.task('concat', rg.concatAndUglify({
  // files: specify which files (optional)
  // name: specify what the result should be called, e.g. 'foo'
  // dist: specify where the output should go, e.g. 'client/dist/'
}));

gulp.task('dev', rg.connectWatch({
  root : 'client',
  port : 8080,
  livereload : true,
  // Files to watch for live re-load
  glob : ['./client/app/**/*.html', './client/app/**/*.js','./client/app/testing/**/*.js']
}));

gulp.task('default', ['lint', 'concat', 'mocha', 'karma']);

gulp.task('protractor', rg.protractor({
  files: [
    'client/testing/scenarios/*.scenario.js'
  ]
<<<<<<< HEAD
}));
=======
}));
>>>>>>> FETCH_HEAD
