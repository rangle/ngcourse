# Part 18: Unit Testing Controllers and Directives

In part 9, we talked about unit testing services.  Most of your code should live
in services, in part because they are easy to unit test.

However, there may be times when you need to unit test logic that lives in
a controller or a directive;  this is a little more trickier to set up.

## Unit Testing Controllers

Let's try to write some unit tests for `TaskListCtrl` in
`client/sections/task-list`.

```javascript
var expect = chai.expect;

describe('TaskAddCtrl', function() {
  beforeEach(module('ngcourse'));

  var taskAddController;
  var mockTasks = {};
  var mockRouter = {};

  beforeEach(inject(function($controller, $log) {
    taskAddController = $controller('TaskAddCtrl', {
      $log: $log,
      tasks: mockTasks,
      router: mockRouter
    });
  }));

  it('gets instantiated correctly', function() {
    expect(taskAddController).to.be.ok();
  });
});
```

Copy-and-paste the code above to
`client/app/sections/task-add/task-add-controller.test.js` and run the unit
tests with `gulp karma`.

The test above shows an example of how to set up a controller with mock
dependencies in the unit tests.  The main difference with services is that
we need to use Angular's `$controller` service to instantiate our controller.

We can then pass an object containing named mock versions of all
`TaskAddCtrl`'s dependencies.  Here we're using `console` as a stand-in for
`$log` and empty objects as stand-ins for the TasksService and RouterService.

The actual test is trivial - it just checks that we instantiated the controller
successfully.  Let's try writing something more useful.

```javascript
describe('TaskAddCtrl', function() {
  beforeEach(module('ngcourse'));

  var taskAddController;
  var mockTasks;
  var mockRouter;

  beforeEach(inject(function($controller, $log) {
    mockTasks = {
      createTask: sinon.spy(function() {
        return Q.when();
      })
    };

    mockRouter = {
      goToTaskList: sinon.spy()
    };

    taskAddController = $controller('TaskAddCtrl', {
      $log: $log,
      tasks: mockTasks,
      router: mockRouter
    });
  }));

  it('cancel sends you back to the task list', function() {
    taskAddController.cancel();
    mockRouter.goToTaskList.should.have.been.calledOnce;
  });

  it('save adds a task and takes you back to the task list', function() {
    var newTask = {
      owner: 'bob',
      description: 'a new task'
    };

    return taskAddController.save(newTask)
      .then(function() {
        mockTasks.createTask.should.have.been.calledOnce;
        mockRouter.goToTaskList.should.have.been.calledOnce;
      });
  })
});
```

Although we strongly encourage the use of the `Controller As` pattern to keep
`$scope` out of your controllers, if you need to test legacy code it may be
useful to inject  a mock `$scope` into your tests.  It works the same way
as any other dependency:

```javascript
describe('OldStyleController with $scope')
  var $scope, controller;

  beforeEach(function() {
    $scope = {};
    controller = $controller('OldStyleController', { $scope: $scope });
  });

  // ...
```

## Unit Testing Directives

Unit testing directives is trickier, mostly due to the need to handle the
HTML templates.  This is why we so strongly encourage writing directives that
offload most of their logic to services.

However, you may need to know how to unit test legacy directives that contain
lots of code.  Here are some examples.

Consider the following simple directive (go ahead and copy it to
`client/app/sections/examples/ngc-user-directive.js`):

```javascript
angular.module('ngcourse-example-directives')

.directive('ngcUser', function () {
  return {
    restrict: 'E',
    scope: {
      userDisplayName: '='
    },
    template: '<span>Hello, {{ userDisplayName }}.</span>'
  };
});
```

A unit test for it might look like this (copy this to
`client/app/sections/examples/ngc-user-directive-test.js`):

```javascript
var expect = chai.expect;

describe('ngcUser directive', function() {
  beforeEach(module('ngcourse-example-directives'));

  var compile;
  var rootScope;

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    compile = $compile;
    rootScope = $rootScope;
  }));

  it('generates the appropriate HTML', function() {
    var scope = rootScope.$new();
    scope.userDisplayName = 'Alice';

    var element = compile(
      '<ngc-user user-display-name="userDisplayName"></ngc-user-display-name>')(scope);
    scope.$digest();

    expect(element.html()).to.contain('Hello, Alice.');
  });
});
```

There's a lot going on here, so let's break it down a bit.

First, we're using `inject()` to get access to two Angular services:

* $compile - used for evaluating the directive's template HTML.
* $rootScope - used to create a $scope object for passing test data into the directive.

In the test itself, we:

1. Create a `$scope` and assign some data to it.  This represents the scope of the
  page in which the directive would be used.
2. Create the directive using its HTML form, the way it would be used in real code.
3. Tell Angular to evaluate the template HTML based on the $scope we constructed.
4. Manually trigger Angular's digest cycle, which causes any angular expressions
  (`{{ }}` blocks) in the directive's template HTML to be evaluated.
5. Verify that the expected markup was generated by the directive.

## Directives with External Templates

Most directives of any complexity will use the `templateUrl` property to refer
to HTML defined in an external template file.  This is entirely appropriate, but
it means that we need to jump though a couple of extra hoops to unit test them.

Let's try to test such a directive:

```javascript
angular.module('ngcourse-example-directives')

.directive('ngcUserWithTemplateUrl', function () {
  return {
    restrict: 'E',
    scope: {
      userDisplayName: '='
    },
    templateUrl: 'app/sections/examples/ngc-user-directive-with-template-url.html'
  };
});
```

The crux of the issue is that an external template file requires Angular to make
an HTTP request to fetch the actual HTML to be used.  When running the
application, this isn't a problem. But this causes problems when running unit
tests with a mocked `$http`; or with the default `$httpBackend` provided by `angular-mocks.js`.

The solution to this issue is to use the `karma-ng-html2js` preprocessor.

Install it like this:

```bash
npm install karma-ng-html2js-preprocessor --save-dev
```

Add it to your `karma.conf.js` like this:

```javascript
module.exports = function(config) {
  config.set({
    basePath: 'client/',
    frameworks: ['mocha', 'chai', 'sinon'],
    preprocessors: {
      '**/*.html': 'ng-html2js'
    },
    exclude: ['node_modules'],
    reporters: ['progress'],
    port: 9999,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
    browsers: ['Chrome'], // Alternatively: 'PhantomJS'
    captureTimeout: 6000,
    singleRun: false
  });
};
```

Note the inclusion of the `preprocessors` section.

Finally, make sure that your gulp karma task also loads your HTML files by
editing `gulpfile.js`:

```javascript
// ...

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

// ...
```

These changes cause the following things to happen:

* `gulp karma` will now load your template (HTML) files in addition to your
  javascript files.
* Those HTML files will be run through the `ng-html2js` preprocessor, which
  * converts the html into javascript strings
  * registers an angular module, named after the HTML file, which when loaded,
    registers this JavaScript-ified string inside Angular's internal
    `$templateCache`.

Now, in your unit tests, you load this special module along with any other
modules under test in a `beforeEach` block (note line four of the example
below).  The rest of the test proceeds as before, except now `$compile` will
find the HTML inside the `$templateCache` instead of trying to fetch it over
HTTP.

```javascript
var expect = chai.expect;

describe('ngcUser directive', function() {
  beforeEach(module('app/sections/examples/ngc-user-directive-with-template-url.html'));
  beforeEach(module('ngcourse-example-directives'));

  var compile;
  var rootScope;

  beforeEach(inject(function($compile, $rootScope, $templateCache) {
    compile = $compile;
    rootScope = $rootScope;
  }));

  it('generates the appropriate HTML', function() {
    var scope = rootScope.$new();
    scope.userDisplayName = 'Alice';

    var element = compile(
      '<ngc-user-with-template-url user-display-name="userDisplayName"></ngc-user-with-template-url>')(scope);
    scope.$digest();

    expect(element.html()).to.contain('Hello, Alice.');
    expect(element.html()).to.contain('external-template');
  });
});
```
