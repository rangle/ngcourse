'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function($log, tasks) {
  var vm = this;
  vm.tasks = [];
  refresh();

  vm.numberOfTasks = 0;
  vm.addTask = function() {
    tasks.createTask({
      owner: 'alice',
      description: 'added a new task from this button'
    })
    .then(refresh);
  };

  function refresh() {
    tasks.getTasks()
      .then(function(tasks) {
        vm.tasks = tasks;
        vm.numberOfTasks = tasks.length;
      })
      .then(null, $log.error);
  };
});