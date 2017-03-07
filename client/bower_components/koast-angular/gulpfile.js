'use strict';

var gulp = require('gulp');
var rg = require('rangle-gulp');
var exec = require('child_process').exec;
var watch = require('gulp-watch');
var replace = require('gulp-replace');
var gulpFilter = require('gulp-filter');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat-util');
var ngAnnotate = require('gulp-ng-annotate');


var karmaVendorFiles = [
  'bower_components/angular/angular.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'bower_components/sinon-chai/lib/sinon-chai.js',
  'bower_components/lodash/dist/lodash.js',
  'testing/lib/*.js'
];

var karmaFiles = [
  'src/koast.js',
  'src/**/*.js'
];

rg.setLogLevel('info');

gulp.task('karma-ci', rg.karma({
  files: karmaFiles,
  vendor: karmaVendorFiles,
  karmaConf: 'testing/karma-ci.conf.js'
}));

gulp.task('karma-watch', rg.karmaWatch({
  files: karmaFiles,
  vendor: karmaVendorFiles,
  karmaConf: 'testing/karma.conf.js'
}));

gulp.task('mocha', rg.mocha());

gulp.task('lint', rg.jshint({
  files: [
    'src/**/*.js',
  ]
}));

gulp.task('beautify', rg.beautify({
  files: []
}));

gulp.task('build-peer', function () {
  var peer = require('./package.json').peerDependencies;
  return gulp.src(['./template/koast-peer-dependencies-const.js'])
    .pipe(replace(/\{\}/, JSON.stringify(peer, null, '\t')))
    .pipe(gulp.dest('src/core/koast'));
});

// todo-make part of rangle gulp>
gulp.task('concat', ['build-peer', 'beautify'], function () {
  var options = {
    files: './src/**/*.js',
    name: 'koast',
    dest: 'dist/'
  };

  var koastVersion = '// koast - ' + require('./package.json').version +
    '\n';
  var name = options.name || 'all';
  var distFolder = options.dest || 'client/dist';
  var filter = gulpFilter(function (file) {
    return !/\.test\.js$/.test(file.path);
  });
  return gulp.src(options.files)
    .pipe(filter)
    .pipe(concat(name + '.js', {
      process: function (src) {
        return (src.trim() + '\n').replace(
          /(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'
        );
      }
    }))
    .pipe(concat.header(koastVersion))
    .pipe(concat.header(
      '(function(window, document, undefined) {\n\'use strict\';\n'
    ))

  .pipe(concat.footer('\n})(window, document);\n'))
    .pipe(gulp.dest(distFolder))
    .pipe(rename(name + '.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(distFolder));

});


gulp.task('dev', rg.nodemon({
  // workingDirectory: 'examples/basic-express/',
  script: 'examples/basic-express/server/app.js',
  onChange: ['lint'] // or ['lint', 'karma']
}));

gulp.task('test', ['karma-ci']);

gulp.task('default', ['lint', 'concat', 'test']);