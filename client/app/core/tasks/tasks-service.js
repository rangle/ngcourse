'use strict';

angular.module('ngcourse.tasks', ['ngcourse.server'])
  .factory('tasks', function (server) {
    var service = {};

    service.getTasks = function () {
      return server.get('/tasks')
    };

    service.getMyTasks = function () {
      return service.getTasks()
        .then(function (tasks) {
          return filterTasks(tasks, {
            owner: user.username
          });
        });
    };

    service.createTask = function(task) {
      return server.post('/tasks', task);
    }

    return service;
  });