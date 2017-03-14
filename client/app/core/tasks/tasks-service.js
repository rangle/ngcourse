'use strict';

angular.module('ngcourse.tasks', [])
  .factory('tasks', function(server) {
    var service = {};
    var tasksPromise;

    service.getTasks = function () {
      tasksPromise = tasksPromise || server.get('/tasks');
      return tasksPromise;
    };

    return service;
  });