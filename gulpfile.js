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
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');

var karmaFiles = [
  'client/bower_components/angular/angular.js',
  'client/bower_components/angular-mocks/angular-mocks.js',
  'client/bower_components/sinon-chai/lib/sinon-chai.js',
  'client/bower_components/koast-angular/dist/koast.js',
  'client/bower_components/angular-ui-router/release/angular-ui-router.js',
  'client/testing/lib/q.js',
  'client/testing/test-utils.js',
  'client/bower_components/lodash/dist/lodash.js',
  'client/app/**/*.html',
  'client/app/**/*.js'
];

var clientFiles = 'client/app/**/*.js';
var tsClientFiles = 'client/app/**/*.ts';

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
      configFile: 'client/testing/protractor.conf.js'
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
  return gulp.src(tsClientFiles)
    .pipe(skipTestFiles)
    .pipe(sourcemaps.init())
    .pipe(ts({
        typescript: require('typescript'),
        module: 'amd',
        target: 'ES5',
        noImplicitAny: false
      }))
    // .pipe(concat('ngcourse.js'))
    // .pipe(gulp.dest(destinationFolder))
    // .pipe(rename('ngcourse.min.js'))
    // .pipe(ngAnnotate())
    // .pipe(uglify())
    // .pipe(gulp.dest(destinationFolder));
    // .pipe(concat('tsoutput.js')) // You can use other plugins that also support gulp-sourcemaps 
    .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file 
    .pipe(gulp.dest(destinationFolder));
});

gulp.task('watch', function() {
  return gulp.watch('./client/**/*.js', ['lint']);
});

gulp.task('default', ['lint', 'build', 'karma']);