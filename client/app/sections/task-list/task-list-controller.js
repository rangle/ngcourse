'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function($log, tasks, router) {
  var vm = this;
  vm.tasks = [];
  refresh();

  vm.numberOfTasks = 0;
  vm.addTask = function() {
    router.goToAddTask();
  };

  vm.getUserDisplayName = function(name) {
    return name;
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