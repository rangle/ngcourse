'use strict';

angular.module('ngcourse.tasks', ['ngcourse.server'])

.factory('tasks', function (server, $http) {
  var service = {};

  service.getTasks = function () {
    return server.get('/tasks');
  };

  service.addTask = function (task) {
    return server.post('/tasks', task);
  };

  service.updateTask = function (task) {
    return server.put('/tasks/' + task.id, task);
  };

  service.getTask = function (id) {
    return server.get('/tasks/' + id);
  };

  return service;
});