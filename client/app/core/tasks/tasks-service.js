'use strict';

angular.module('ngcourse.tasks', ['ngcourse.server'])
.factory('tasks', function(server, $q) {
  var service = {};

  service.getTasks = function () {
    return server.get('/api/v1/tasks')
  };

  service.getMyTasks = function () {
    return service.getTasks()
    .then(function(tasks) {
      return filterTasks(tasks, {
        owner: user.username
      });
    });
  };

  service.createTask = function(task) {
    if (task && task.owner && task.description) {
      return server.post('/api/v1/tasks', task);
    } else if (task && !task.owner) {
      return $q.reject('Owner is required');
    } else if (task && !task.description) {
      return $q.reject('Description is required');
    } else {
      return $q.reject('No task data provided');
    }
  };

  return service;
});