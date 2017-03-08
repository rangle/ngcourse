# Part 9: Unit Testing

## The Rationale

Why bother with unit tests?

## Unit Tests vs Integration Tests

A **unit test** is used to test individual components of the system. An
**integration test** is a test which tests the system as a whole, and how it
will run in production.

Unit tests should only verify the behavior of a specific unit of code. If
the unit's behavior is modified, then the unit test would be updated as well.
Unit tests should not make assumptions about the behavior of _other_ parts of
your codebase or your dependencies. When other parts of your codebase are
modified, your unit tests **should not fail**. (If they do fail, you have
written a test that relies on other components, it is therefore not a unit
test.) Unit tests are cheap to maintain, and should only be updated when the
individual units are modified.

## The Toolchain

Let's talk about some of the available tools. Our preferred toolchain consists
of:

* Mocha - the actual test framework.
* Chai - an assertion library.
* Sinon - a spy library.
* Karma - a test "runner".
* Gulp - a task automation tool.

## Why Mocha?

While we see this as the best combination of tools, a common alternative is `Jasmine`, a somewhat older tool that combines features of Mocha, Chai and Sinon.

Mocha provides better support for asynchronous testing by adding support for the `done()` function. If you use it, your test doesn't pass until the `done()` function is called. This is a nice to have when testing asynchronous code. Mocha also allows for use of any assertion library that throws exceptions on failure, such as Chai.

## Setup

Gulp and Mocha are the only tools we need to setup globally.

```bash
  npm install -g gulp mocha
  npm install
```

Now we can proceed to writing tests.

## A Basic Mocha Test

First, let's write a simple test and run it just using Mocha. Put this code
into `client/app/simple.test.js`.

```javascript
  // Define a test suite.
  describe('tasks', function () {
    // Define a test.
    it('should have 2*2 be equal to 4', function () {
      var x;
      // Do something.
      x = 2 * 2;
      // Check that the results are what we expect and throw an error if something is off.
      if (x!==4) {
        throw new Error('Failure of basic arithmetics.');
      }
    });
  });
```

We can now run this code with:

```bash
  mocha client/app/simple.test.js
```

## The Importance of Test Documentation

The first argument to `it()` should explain what your test aims to verify.
Beyond that, consider adding additional information through comments.
Well-documented tests can serve as documentation for your code and can simplify
maintenance.

## Mocha with Karma and Gulp

Run Karma via Gulp using:

```bash
  gulp karma
```

This will run **all** tests under client.

See `gulpfile.js` on how to implement the `karma` task code
for more details. Karma configuration is in `client/testing/karma.conf.js`.

## Skipping Tests

You can skip the whole suite:

```javascript
  xdescribe('tasks', function () {
    // ...
  });
```

Or just an individual test:

```javascript
  xit('should have 2*2 be equal to 4', function () {
    // ...
  });
```

Alternatively, we can *only* run a specific test:

```javascript
  it.only('2*2 should equal 4', function () {
    // ...
  });
```

## Mocha with Chai

Chai is an assertion library. It makes it easy to throw errors when things are
not as we expect them to be. Chai has two styles: "[TDD](http://en.wikipedia.org/wiki/Test-driven_development)" and "[BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)". We'll be
using the "[BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)" style.

We have already installed Chai when we ran `npm install` and we are already
loading it when we run Karma via `gulp`. So, now we can go straight to using
it.

```javascript
  // Load Chai's expect library for assertions.
  var expect = chai.expect;
  describe('arithmetics', function () {
    it('should have 2*2 be equal to 4', function () {
      var x = 2 * 2;
      var y = 4;
      // Assert that x is defined.
      expect(x).to.not.be.undefined;
      // Assert that x equals to specific value.
      expect(x).to.equal(4);
      // Assert that x equals to y.
      expect(x).to.equal(y);
      // See http://chaijs.com/api/bdd/ for more assertion options.
    });
  });
```

## Testing Angular Services

For testing Angular code we need to load modules and inject services.

```javascript
  'use strict';

  var expect = chai.expect;
  // We can move expect definition to client/testing/test-utils.js

  describe('tasks service', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('ngcourse.tasks'));
    it('should get loaded', function() {
      // Inject the service.
      inject(function(tasks) {
        // Notice that the service is available inside the closure.
        // We can assert that the service has loaded by calling
        // getTasks().
        expect(tasks.getTasks()).to.not.be.undefined;
      });
    });
  });
```

Let's save this to `client/app/core/tasks/tasks-service.test.js`.

The sad truth, though, is that we have only established that
`tasks.getTasks()` does return a promise. We can't really judge the success of
this test until we know what that promise resolves to.

## An Asynchronous Test

So, we want to check what the promise resolves too, but this only will happen
*later*. One solution is to set up an asynchronous promise.

So, we need to use an asynchronous test that would wait for
the promise to resolve.

```javascript
  describe('tasks service', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('ngcourse.tasks'));
    it('should get tasks', function(done) {
      // Notice that we've specified that our function takes a 'done' argument.
      // This tells Mocha this is an asynchronous test. An asynchronous test will
      // not be considered 'successful' until done() is called without any
      // arguments. If we call done() with an argument the test fails, treating
      // that argument as an error.
      inject(function (tasks) {
        tasks.getTasks()
          // Attach the handler for resolved promise.
          .then(function (tasks) {
            // Assertions thrown here will result to a failed promise downstream.
            expect(tasks).to.be.an.array;
            // Remember to call done(), otherwise the test will time out (and
            // fail).
            done();
          })
          // Attach the error handler. This is very important and easy to forget.
          .then(null, function(error) {
            done(error); // This can be simplified - see below.
          });
      });
    });
  });
```

Let's run. Oh-oh.

## Mocking a Service

Our tests are not really "unit tests" if they make use of many layers of
dependencies - and especially if they make server calls. So, we need to "mock"
our dependencies.

```javascript
  describe('tasks service', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('ngcourse.tasks'));
    beforeEach(module(function($provide){
      // Mock 'server'.
      $provide.service('server', function() {
        var service = {};
        var data = [{
          description: 'Mow the lawn'
        }];

        service.get = function () {
          return Q.when(data);
          // or try this: Q.reject(new Error('Some Error'));
        };
        return service;
      });
      // Mock $q.
      $provide.service('$q', function() {
        return Q;
      });
    }));

    it('should get tasks', function(done) {
      // Notice that we've specified that our function takes a 'done' argument.
      // This tells Mocha this is an asynchronous test. An asynchronous test will
      // not be considered 'successful' until done() is called without any
      // arguments. If we call done() with an argument the test fails, treating
      // that argument as an error.
      inject(function (tasks) {
        tasks.getTasks()
          // Attach the handler for resolved promise.
          .then(function (tasks) {
            // Assertions thrown here will result to a failed promise downstream.
            expect(tasks.length).to.equal(1);
            // Remember to call done(), otherwise the test will time out (and
            // fail).
            done();
          })
          // Attach the error handler. This is very important and easy to forget.
          .then(null, function(error) {
            done(error); // This can be simplified - see below.
          });
      });
    });
  });
```

## Why Mock `$q`?

Angular's `$q` service ties promise resolution to the digest cycle. This
creates some challenges in the context of testing. We can resolve them using
`$rootScope.$apply()`, but this method can be quite fragile and is hard to get
to work right. My approach is to mock $q using Q.

## A Simplified Use of done()

If all we want to do in case of error is to pass it to done, we don't
actually need to define a new function in the handler. We can just provide
`done` as the handler.

```javascript
  .then(null, function(error) {
    done(error);
  });
```

is equivalent to:

```javascript
  .then(null, done);
```

## Mocha's Support for Promises

Mocha's tests can alternatively just accept a promise. In most case this is
what you want to use.

```javascript
  it('should get tasks', function() {
    // Setup a variable to store injected services.
    var injected = {};
    // Run inject() to inject service.
    inject(function (tasks) {
      injected.tasks = tasks;
    });
    // Write a test that returns a promise;
    return injected.tasks.getTasks()
      .then(function (tasks) {
        expect(tasks.length).to.equal(1);
        // We no longer need to call done()
      });
  });
```

## Decompose Tests

Everything you know about decomposition applies to tests too.

```javascript
  // Retrieves an injected service.
  function getService(serviceName) {
    var injectedService;
    inject([serviceName, function(serviceInstance) {
      injectedService = serviceInstance;
    }]);
    return injectedService;
  }

  it('should get tasks', function() {
    var tasks = getService('tasks');
    return tasks.getTasks()
      .then(function (receivedTasks) {
        expect(receivedTasks.length).to.equal(1);
      });
  });
```

You can put this implementation of `getService()` into a separate JavaScript
file, e.g., `client/testing/test-utils.js`. It's ok to be a bit more lax when
it comes to globals for tests.

## Spying with Sinon

A test spy is a function that records arguments, return value, the value of
`this`, and exception thrown (if any) for all its calls. A test spy can be an
anonymous function or it can wrap an existing function. When using Sinon,
we'll wrap the existing function with `sinon.spy()`:

```javascript
  // Mock 'server'.
  $provide.service('server', function() {
    var service = {};
    var data = [{
      description: 'Mow the lawn'
    }];

    service.get = sinon.spy(function () {
      return Q.when(data);
    });
    return service;
  });
```

When spying on existing functions, the original function will behave as
normal, but we will be proxied through the spy, which will collect information
about the calls. For example, we can check if the function has been called:

```javascript
  it('should only call server.get once', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    server.get.reset(); // Reset the spy.
    return tasks.getTasks() // Call getTasks the first time.
      .then(function () {
        return tasks.getTasks(); // Call it again.
      })
      .then(function () {
        server.get.should.have.been.calledOnce; // Check the number of calls.
      });
  });
```

Note that here we created a new test to verify that `server.get` is only
getting called once. We also do not attempt to verify in this test that the
promise returned by `getTasks()` actually resolves to the value we expect, since
this is already being verified by another test. Keeping tests small and
focused greatly facilitates test maintenance.

## Refactor Hard-to-Test Code

As you start writing unit tests, you may find that a lot of your code is hard
to test. For example, if most of your code is in controllers, you would need
to write controller tests, which is more work. The best strategy
is often to refactor your code so as to make it easy to test. For example,
consider refactoring your controller code into services and focusing on
service tests.
