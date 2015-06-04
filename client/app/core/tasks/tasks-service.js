'use strict';

angular.module('ngcourse.tasks', [
  'ngcourse.server',
  'ngcourse.users'
])
.factory('tasks', function(server, $q, users) {
  var service = {};

  service.getTasks = function () {
    return server.get('/api/v1/tasks')
  };

  service.getMyTasks = function (user) {
    return service.getTasks()
    .then(function(tasks) {
      return filterTasks(tasks, {
        owner: user.username
      });
    });
  };

  function filterTasks(tasks, criteria) {
    console.log(criteria)
    return _.filter(tasks, criteria);
  }

  function validOwner(owner) {
    return users.getUsers()
    .then(function(usersList) {
      var isValid = _.find(usersList, { username: owner });
      return isValid ? true : $q.reject('A valid owner must be provided');
    });
  }

  service.createTask = function(task) {
    if (task && task.owner && task.description) {
      // check to see if the owner is valid
      return validOwner(task.owner)
      .then(function() {
        return server.post('/api/v1/tasks', task);
      });
    } else if (task && !task.owner) {
      // if the description is missing
      return $q.reject('Owner is required');
    } else if (task && !task.description) {
      // if the owner is missing
      return $q.reject('Description is required');
    } else {
      // if task is missing
      return $q.reject('No task data provided');
    }
  };

  return service;
});