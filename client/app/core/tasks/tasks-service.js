'use strict';

angular.module('ngcourse.tasks', [
  'ngcourse.auth',
  'ngcourse.server'
])

.factory('tasks', function (auth, server, $http) {
  var service = {};

  function makeAuthenticatedMethod(functionToDelay) {
    return function () {
      var myArgs = arguments;
      return auth.whenAuthenticated()
        .then(function () {
          return functionToDelay.apply(service, myArgs);
        });
    };
  }

  service.getTasks = makeAuthenticatedMethod(function () {
    return server.get('/tasks');
  });

  service.addTask = makeAuthenticatedMethod(function (task) {
    return server.post('/tasks', task);
  });

  service.updateTask = makeAuthenticatedMethod(function (task) {
    return server.put('/tasks/' + task.id, task);
  });

  service.getTask = makeAuthenticatedMethod(function (id) {
    return server.get('/tasks/' + id);
  });

  return service;
});