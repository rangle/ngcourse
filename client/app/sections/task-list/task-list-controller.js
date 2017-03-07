'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function ($log, tasks, router) {
  var vm = this;
  vm.tasks = [];
  vm.addTask = router.goToAddTask;

  tasks.getTasks()
    .then(function (tasks) {
      vm.tasks = tasks;
    })
    .then(null, $log.error);
});