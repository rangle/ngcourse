'use strict';

angular.module('ngcourse.tasks', ['ngcourse.server'])
  .factory('tasks', function (server) {
    var service = {};

    service.getTasks = function () {
      return server.get('/tasks')
    };

    service.updateTask = function (task) {
      return server.put('/tasks/', task.id, task);
    }

    service.getTask = function (id) {
      return server.get('/tasks/' + id);
    }

    service.createTask = function (task) {
      return server.post('/tasks', task);
    }

    return service;
  });