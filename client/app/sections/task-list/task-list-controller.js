'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function(tasks, $log, router) {
  var vm = this;
  vm.numberOfTasks = 0;
  vm.addTask = function() {
    vm.numberOfTasks += 1;
  };

  vm.tasks = [];

  vm.goToTask = router.goToTask;

  tasks.getTasks()
    .then(function(tasks) {
      vm.tasks = tasks;
    });

  vm.getUserDisplayName= function(name){
    return name;
  };
});