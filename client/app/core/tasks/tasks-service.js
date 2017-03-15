'use strict';

angular.module('ngcourse.tasks', [])
  .factory('tasks', function(server, $q) {
    var service = {};
    var tasksPromise;

    service.getTasks = function () {
      tasksPromise = tasksPromise || server.get('/tasks');
      return tasksPromise;
    };

    service.createTask = function (task) {
      if (!task || !task.owner) {
        return $q.reject(null);
      }

      return server.post('/tasks', task);
    }

    return service;
  });