# Part 10: Working Session

## Test-Driven-Development of a Service

Let's use what we've learned to add some more features to the
`tasks-service.js`.

Try using a "Test-Driven-Development" approach, in which you define what
the new functions should look like by writing tests first; then you can fill
in the actual implementation as you get the tests to pass.

You can get your tests to automatically run each time you save a file.  Just
type the following command in your terminal:

```bash
gulp karma-watch
```

## Setup:

If you've been following along with the course so far, your
`client/app/task-service.js` file should look like this:

```javascript
angular.module('ngcourse.tasks', ['ngcourse.server'])
.factory('tasks', function(server) {
  var service = {};

  service.getTasks = function () {
    return server.get('/tasks')
  };

  service.getMyTasks = function () {
    return service.getTasks()
    .then(function(tasks) {
      return filterTasks(tasks, {
        owner: user.username
      });
    });
  };

  return service;
});
```

Your `client/app/task-service.test.js` file should look like this:

```javascript
describe('tasks service', function () {
  // Load the angular module. Having smaller modules helps here.
  beforeEach(module('ngcourse.tasks'));
  beforeEach(module(function($provide){
    // Mock 'server'.
    $provide.service('server', function() {
      var service = {};
      var data = [{
        owner: 'bob',
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
});
```

And your `client/app/server/server-service.js` file should look like this after adding the post, put, and delete functions:

```javascript
angular.module('ngcourse.server', [])

.constant('API_BASE_URL', 'http://localhost:3000')

.factory('server', function ($http, API_BASE_URL) {
  var service = {};

  service.get = function (path) {
    return $http.get(API_BASE_URL + path)
    .then(function (response) {
      return response.data;
    });
  };

  service.post = function (path, data) {
    return $http.post(API_BASE_URL + path, data);
  }

  service.put = function (path, id, data) {
    return $http.put(API_BASE_URL + path + '/' + id, data);
  }

  service.delete = function (path, id) {
    return $http.delete(API_BASE_URL + path + '/' + id, data);
  }

  return service;
});
```

# Exercise: Add the Ability to Create a New Task

Let's follow the steps to create an "add task" feature to your application. To
do this, we'll be calling `POST /tasks` on the server.  We've already
defined a `post()` function in `server-service.js` that does this.  So, we need
to:

1. Add a mock version of this method in our mock server in
  `tasks-service.test.js`
2. Define a `createTask` function in `tasks-service.js`.
3. Write some tests in `task-service.test.js` that define what we want this
  new function's behaviour to be.  It should accept an object like

  ```javascript
  {
    owner: 'Alice',
    description: 'A newly-created task.'
  }
  ```

  and cause that task to be 'posted' to the mock server. It should also return a promise.

  Also write some tests for error cases: null parameter, empty `owner` or
  `description` fields, etc. Your `createTask()` function should return a
  rejected promise in these scenarios.
4. Hook the `task-service.js createTask()` function up to a button in `index.html`
  via `task-controller.js`.
