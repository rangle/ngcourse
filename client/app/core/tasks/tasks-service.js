'use strict';

angular.module('ngcourse.tasks', [])

.factory('tasks', function($http) {
  var service = {};

  // Get a list of all tasks from the server
  service.getTasks = function () {
    return $http.get('http://ngcourse.herokuapp.com/api/v1/tasks')
      .then(function(response) {
        return response.data;
      });
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

  function filterTasks() {

  }

  return service;
});