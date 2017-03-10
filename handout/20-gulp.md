# Part 20: Gulp

Gulp is a task automation and build system based on NodeJS streams. A typical
gulp task reads a collection of files, passes them through a series of
transformations, then finally writes out the results. Gulp supports plugins,
which makes it easy to assemble common tasks.

## Why Use Gulp?

A few features of Gulp make it our preferred automation tool at Rangle.io.

__Chained Tasks__: Gulp makes it easy to chain simple tasks into more complex
workflows. This works well when trying to build a web app for a production
environment where a series of improvements (minification, concatenation, etc.)
and checks (linting, unit tests, etc.) need be performed and then written to a
build folder.

__Lots of Available Plugins__: Simple, chainable tasks make it easy to develop
small, targeted plugins that do one thing well. Such smaller plugins can be
easily reused modules to be added, reordered and removed without affecting
upstream and downstream tasks. This helps grow a healthy ecosystem of plugins.

__JavaScript__: Gulp tasks are written in JavaScript, which means we get to
use the same language as we do throughout the application.

__Development Tasks are Stored Within the Project__: Packages providing gulp
tasks can be (and should be) tracked in `package.json` as "devDependencies".
New developers or CI jobs just need to run `npm install` to have all the
required build/test dependencies installed. (Those dependencies can be skipped
in production by installing with `npm install --production`.)

__Cross Platform__: Runs on Linux, Windows, and OSX.

## Installation

Gulp can be installed with npm:

```bash
  npm install -g gulp
```

After that, you will be able to run `gulp` command from the commandline. Gulp will look for further instructions in a file called `gulpfile.js`.

## Linting

Here is a simple Gulp file that defines one task, linting with JSHint.

```js
  var gulp = require('gulp');
  var jshint = require('gulp-jshint');

  var clientFiles = 'client/app/**/*.js';

  gulp.task('lint', function () {
    return gulp.src(clientFiles)
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(jshint.reporter('fail'));
  });
```

With this code, running `gulp lint` will run JSHint on all files that match
the following pattern: `client/app/**/*.js`.

Note that the files are read with `gulp.src` then piped through tasks defined
by the `jshint` plugin using `.pipe()`. The plugin is installed and loaded as an
NPM package (`gulp-jshint`).

Running JSHint is usually the first step in the build process, which catches
many common errors.

JSHint will look in `.jshintrc` for information about which rules to enforce.

## Beautifying

The following gulp task will beautify the code, that is reformat it according to the rules specified in '.jsbeautifyrc':

```js
  var fs = require('fs');
  var beautify = require('gulp-js-beautify');

  var clientFiles = 'client/app/**/*.js';

  gulp.task('beautify',  function () {
    var jsBeautifyConfig = JSON.parse(fs.readFileSync('.jsbeautifyrc'));
    return gulp.src(clientFiles, { base: '.' })
      .pipe(beautify(jsBeautifyConfig))
      .pipe(gulp.dest('.'));
  });
```

This task uses `gulp.dest()` in addition to `gulp.src()`. In other words, the
last step of this task is to _write_ the files back to the disk. With gulp
this step needs to be done explicitely. Gulp does not write files to disk
unless specifically asked to do so. (Which is great, since it avoids creation
of unnecessary temp files.)

In this example we write files to `.`, which essentially overwrites the files
we loaded from disk.

## Run Tests

This task injects all client app files and external dependencies and runs the client unit tests. This will break the stream if one or more tests fail.

```js

  var karma = require('gulp-karma');

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

  gulp.task('karma', function(){
    return gulp.src(karmaFiles)
      .pipe(karma({
        configFile: 'client/testing/karma.conf.js',
        action: 'run'
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
  });
```

Here we need to inject quite a few files and we cannot capture them with a
single pattern. So, we use the fact that `gulp.src` can take an _array_ of
patterns.

## Minification

Now let's write a task that minifies and concatenates client JavaScript code:

```js
  var gulpFilter = require('gulp-filter');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var ngAnnotate = require('gulp-ng-annotate');

  var clientFiles = 'client/app/**/*.js';

  var skipTestFiles = gulpFilter(function (file) {
    return !/\.test\.js$/.test(file.path);
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
    };
  });
```

This task is a bit more complex than the other ones. First, since we have been
putting our test files together with our application source files, we need to
have a way of picking out just our actual source files, without tests. We
cannot do this with a pattern, but we can use `gulp-filter`, a plugin that
that take a sequence of gulp files and select some of them out with a test
function.

Second, we run our files through Gulp plugin "concat" which concatenates them
into a single file, which we tentatively call "all.js". We then run save this
file to our destination folder.

We are not done, however. In addition to saving concatenating our files into
one `ngcourse.js`, we want to _also_ save a minified version of this file. To
do this, we first tell gulp that our working file will now have a different
name: `ngcourse.min.js`. We do this using a plugin `gulp-rename`.

We then run this file's content through `gulp-ng-annotate` plugin to add
annotations and finally, then through `gulp-uglify` plugin to minify it, then
write the file to disk in the same folder.

## Watching Files

Gulp also allows you to trigger certain tasks when some files change. For
example, let's force the lint task to run whenever we change our JavaScript
source:

```js
  gulp.task('watch', function() {
    return gulp.watch('./client/**/*.js', ['lint']);
  });
```

## Assembling Tasks

Finally, we may want to designate an umbrella task to run a set of other
tasks. This is quite trivial:

```js
  gulp.task('default', ['lint', 'build', 'karma']);
```

Since this task is the default, it will also be run when we simply type
`gulp`.
