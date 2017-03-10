var gulp = require('gulp');
var gulpFilter = require('gulp-filter');
var jshint = require('gulp-jshint');
var fs = require('fs');
var beautify = require('gulp-js-beautify');
var karma = require('gulp-karma');
var mocha = require('gulp-mocha');
var protractor = require('gulp-protractor').protractor;
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var watch = require('gulp-watch');
var connect = require('gulp-connect');

var karmaFiles = [
  'client/node_modules/angular/angular.js',
  'client/node_modules/angular-mocks/angular-mocks.js',
  'client/node_modules/sinon-chai/lib/sinon-chai.js',
  'client/node_modules/angular-ui-router/release/angular-ui-router.js',
  'client/testing/lib/q.js',
  'client/testing/test-utils.js',
  'client/app/**/*.html',
  'client/app/**/*.js'
];

var clientFiles = 'client/app/**/*.js';

var skipTestFiles = gulpFilter(function (file) {
  return !/\.test\.js$/.test(file.path) && !/testing/.test(file.path);
});

gulp.task('lint', function () {
  return gulp.src(clientFiles)
    .pipe(skipTestFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('beautify',  function () {
  var jsBeautifyConfig = JSON.parse(fs.readFileSync('.jsbeautifyrc'));
  return gulp.src(clientFiles, { base: '.' })
    .pipe(beautify(jsBeautifyConfig))
    .pipe(gulp.dest('.'));
});

gulp.task('karma', function() {
  return gulp.src(karmaFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('karma-watch', function() {
  return gulp.src(karmaFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }))
    .on('error', function(err) {
      throw err;
    });
});

gulp.task('api-test', function() {
  return gulp.src('server/testing/*.js')
    .pipe(mocha({
      reporter: 'nyan'
    }))
    .on('end', function () {
      console.log('Done');
    });
});

gulp.task('protractor', function() {
  var files = ['client/testing/scenarios/*.scenario.js'];
  return gulp.src(files)
    .pipe(protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      console.log('Done');
    });
});

var destinationFolder = 'client/dist';

gulp.task('build', function () {
  return gulp.src(clientFiles)
    .pipe(skipTestFiles)
    .pipe(concat('ngcourse.js'))
    .pipe(gulp.dest(destinationFolder))
    .pipe(rename('ngcourse.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(destinationFolder));
});

gulp.task('watch', function() {
  return gulp.watch('./client/**/*.js', ['lint']);
});

gulp.task('default', ['lint', 'build', 'karma']);