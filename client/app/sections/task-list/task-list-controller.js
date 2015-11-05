'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function ($log, tasks, users, router) {
  var vm = this;
  vm.tasks = [];
  vm.addTask = router.goToAddTask;

  vm.getUserDisplayName = users.getUserDisplayName;

  vm.filterDone = function (task) {
    return !task.done;
  };

  vm.done = function (_id) {
    var task = vm.tasks.find(function(task) {
      return task._id === _id;
    })

    task.done = true;
  };

  tasks.getTasks()
    .then(function (tasks) {
      return users.whenReady()
        .then(function () {
          vm.tasks = tasks;
        });
    })
    .then(null, $log.error);
});