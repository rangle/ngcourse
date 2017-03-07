# Part 6: Promises.

In Part 5 we saw that `$http` methods give us promises. But what exactly is a
promise?

## Promises vs Callbacks

JavaScript is single threaded, so we can't really ever "wait" for a result of
a task such as an HTTP request. Our baseline solution is callbacks:

```javascript
  request(url, function(error, response) {
    // handle success or error.
  });
  doSomethingElse();
```

A few problems with that. One is the "Pyramid of Doom":

```javascript
  queryTheDatabase(query, function(error, result) {
    request(url, function(error, response) {
      doSomethingElse(response, function(error, result) {
        doAnotherThing(result, function(error, result) {
          request(anotherUrl, function(error, response) {
            ...
          })
        });
      })
    });
  });
```

And this is without any error handling! A larger problem, though: hard to decompose.

The essence of the problem is that this pattern requires us to specify the
task and the callback at the same time. In contrast, promises allow us to
specify and dispatch the request in one place:

```javascript
  promise = $http.get(url);
```
and then to add the callback later, and in a different place:

```javascript
  promise.then(function(response) {
    // handle the response.
  });
```

This also allows us to attach multiple handlers to the same task:

```javascript
  promise.then(function(response) {
    // handle the response.
  });
  promise.then(function(response) {
    // do something else with the response.
  });
```

## Unchaining Promises

You might have seen chained promises:

```javascript
  $http.get('http://localhost:3000/tasks')
    .then(function(response) {
      return response.data;
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, function(error) {
      $log.error(error);
    });
```

We could also make this more complicated:

```javascript
  $http.get('http://localhost:3000/tasks')
    .then(function(response) {
      var tasks = response.data;
      return filterTasks(tasks);
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, function(error) {
      $log.error(error);
    });
```

Or even:

```javascript
  $http.get('http://localhost:3000/tasks')
    .then(function(response) {
      return response.data;
    })
    .then(function(tasks) {
      return filterTasksAsynchronously(tasks);
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, function(error) {
      $log.error(error);
    });
```

To make sense, let's "unchain" this using variables:

```javascript
  var responsePromise = $http.get('http://localhost:3000/tasks');
  var tasksPromise = responsePromise.then(function(response) {
    return response.data;
  });
  var filteredTasksPromise = tasksPromise.then(function(tasks) {
    return filterTasksAsynchronously(tasks);
  });
  var vmUpdatePromise = filteredTasksPromise.then(function(tasks) {
    $log.info(tasks);
    vm.tasks = tasks;
  })
  var errorHandlerPromise = vmUpdatePromise.then(null, function(error) {
    $log.error(error);
  });
```

Let's work through this example.

## Promises Beget Promises (via `.then()`)

A key point to remember: unless your promise library is buggy, `.then()`
always returns a promise. Always.

```javascript
  p1 = getDataAsync(query);

  p2 = p1.then(function (results) {
    return transformData(results);
  });
```

`p2` is now a promise regardless of what transformData() returned. Even if
something fails.

If the callback function returns a value, the promise resolves to that value:

```javascript
  p2 = p1.then(function (results) {
    return 1;
  });
```
`p2` will resolve to “1”.

If the callback function returns a promise, the promise resolves to a
functionally equivalent promise:

```javascript
  p2 = p1.then(function (results) {
    var newPromise = getSomePromise();
    return newPromise;
  });
```

`p2` is now functionally equivalent to newPromise. It's not the same object,
however. Let's discuss why not.

```javascript
  p2 = p1.then(function (results) {
    throw Error('Oops');
  });

  p2.then(function (results) {
    // You will be wondering why this is never
    // called.
  });
```

`p2` is still a promise, but now it will be rejected with the thrown error.

Why won't the second callback ever be called?

## Catching Rejections

So, catch rejections:

```javascript
  $http.get('http://localhost:3000/tasks')
    .then(function(response) {
      return response.data;
    })
    .then(function(tasks) {
      return filterTasksAsynchronously(tasks);
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    }, function(error) {
      $log.error(error);
    });
```

What's the problem with this code?

So, the following is better.

```javascript
  $http.get('http://localhost:3000/tasks')
    .then(function(response) {
      return response.data;
    })
    .then(function(tasks) {
      return filterTasksAsynchronously(tasks);
    })
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, function(error) {
      $log.error(error);
    });
```

Note that one catch at the end is often enough.

## Using an Existing Function As a Handler

```javascript
    .then(null, function(error) {
      $log.error(error);
    });
```

can be replaced with:

```javascript
    .then(null, $log.error);
```

Let's make sure we understand why.

## Returning Promises

There is one (common) case when it's ok to not catch the rejection:

```javascript
  return $http.get('http://localhost:3000/tasks')
    .then(function(response) {
      return response.data;
    });
```

That's passing the buck. But remember: the buck stops with the controller's
function that is triggered by Angular.

## Catch and Release

Or you can catch, do something, and still pass the exception onwards:

```javascript
  .then(null, function(error) {
    $log.error(error); // Log the error
    throw error; // Then re-throw it.
  });
```

Sometimes we may want to re-throw conditionally.

## Promise Chains Considered Harmful

A better approach is to break them up into meaningful functions.

```javascript
  function getTasks() {
    return $http.get('http://localhost:3000/tasks')
      .then(function(response) {
        return response.data;
      });
  }

  function getMyTasks() {
    return getTasks()
      .then(function(tasks) {
        return filterTasks(tasks, {
          owner: user.username
        });
      });
  }

  getMyTasks()
    .then(function(tasks) {
      $log.info(tasks);
      vm.tasks = tasks;
    })
    .then(null, $log.error);
```
