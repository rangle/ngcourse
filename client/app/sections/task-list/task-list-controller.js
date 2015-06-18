'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function(tasks, $log) {
  var vm = this;
  vm.numberOfTasks = 0;
  vm.addTask = function() {
    vm.numberOfTasks += 1;
  };

  vm.tasks = [];

  tasks.getTasks()
    .then(function(tasks) {
      vm.tasks = tasks;
    });
});