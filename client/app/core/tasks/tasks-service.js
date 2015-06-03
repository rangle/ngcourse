'use strict';

angular.module('ngcourse.tasks', [])

.factory('tasks', function($http, server) {
  var service = {};

  // Get a list of all tasks from the server
  service.getTasks = function () {
    return server.get('/api/v1/tasks');
  };

  // Get a list of taks for one use
  service.getMyTasks = function () {
    return service.getTasks()
      .then(function(tasks) {
        return filterTasks(tasks, {
          owner: 'alice' //user.username
        });
      });
  };

  return service;
});