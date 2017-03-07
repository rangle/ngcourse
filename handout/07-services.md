# Part 7: Services

In Part 6 we wrote functions that call `$http` methods and process resulting
promises. We started by putting those functions in our controller. This,
however, is a poor practice. Those functions are working with business logic
and they should be kept out of controllers.

## Services

Instead, we'll put those functions in an AngularJS service:

```javascript
'use strict';

angular.module('ngcourse.tasks', [])
.factory('tasks', function($http) {
  var service = {};

  service.getTasks = function () {
    return $http.get('http://localhost:3000/tasks')
      .then(function(response) {
        return response.data;
      });
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

Note we have added a new module definition and need to update app.js.

```javascript
angular.module('ngcourse', ['ngcourse.tasks', 'ngcourse.server'])
```

Let's put this in `client/app/core/tasks/tasks-service.js` and add the path
our `index.html`.

We can now simplify our controller code:

```javascript
  .controller('TaskListCtrl', function($http, $log, tasks) {
    var vm = this;
    vm.tasks = [];

    tasks.getTasks()
      .then(function(tasks) {
        vm.tasks = tasks;
        vm.numberOfTasks = tasks.length;
      })
      .then(null, $log.error);

    vm.numberOfTasks = 0;
    vm.addTask = function() {
      vm.numberOfTasks += 1;
    };
  });
```

Note that we've injected our newly created service.

## Advantages of Keeping Code in Services

Let's discuss some of the advantages of keeping your code in services rather
than in controllers.

The rule of thumb: code that can be written without referring to a
controller's scope should be written this way and should be placed in a
service.

## Using `.factory()` vs `.service()` vs `.provider()`

Note our use of `.factory()` to define a service. There is also `.service()`
and `.provider()`. Let's talk briefly about the differences.

## More Services

When it comes to services, the more the better. Let's refactor some of the
code from our `tasks` service into a new `server` service (app/core/server/server-service.js).

```javascript
  angular.module('ngcourse.server', [])

  .factory('server', function($http) {
    var service = {};

    var baseUrl = 'http://localhost:3000';

    service.get = function (path) {
      return $http.get(baseUrl + path)
        .then(function(response) {
          return response.data;
        });
    };

    return service;
  });
```

While our `tasks` service code gets simplified to:

```javascript
  service.getTasks = function () {
    return server.get('/tasks');
  };
```

And we have a layered service architecture with the tasks service calling the server service.

But why bother, you might ask? Lets go over some of the benefits.

## Using `.constant()` and `.value()`

We could decompose yet more, though:

```javascript
  .constant('API_BASE_URL', 'http://localhost:3000')

  .factory('server', function($http, API_BASE_URL) {
    var service = {};

    service.get = function (path) {
      return $http.get(API_BASE_URL + path)
        .then(function(response) {
          return response.data;
        });
    };

    return service;
  });
```

Alternatively, we can use `.value()` instead of `.constant()`. However, when
in doubt, use `.constant()`.

## Modules

At this point we may want to consider breaking our code up into modules. E.g.,
let's make `server` its own module:

```javascript
  angular.module('ngcourse.server', [])

  .constant('API_BASE_URL', 'http://localhost:3000')

  .factory('server', function($http, API_BASE_URL) {
    var service = {};

    service.get = function (path) {
      return $http.get(API_BASE_URL + path)
        .then(function(response) {
          return response.data;
        });
    };

    return service;
  });
```

We can then make it a dependency in our `ngcourse` module (in `app.js`):

```javascript
  angular.module('ngcourse', [
    'ngcourse.server'
  ]);
```

Note that an Angular "app" is basically just an Angular module.

Each module can define `.config()` and `.run()` sections. You will rarely see
`.config()` except when setting up routes. (We'll discuss it in that context.)
Your `.run()` is essentially you modules's equivalent of the "main" block.

```javascript
  angular.module('ngcourse', [
    'ngcourse.server'
  ])

  .run(function($log) {
    $log.info('All ready!');
  });
```

Keep in mind, though, that Angular's modules are somewhat of a fiction.
