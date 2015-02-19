'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function ($log, tasks, users, router) {
  var vm = this;

  vm.tasks = [];
  vm.addTask = router.goToAddTask;
  vm.getUserDisplayName = users.getUserDisplayName;
  vm.sortColumnName = 'owner';
  vm.reverseSort = false;

  vm.sort = function(columnName) {
    if (columnName === vm.sortColumnName) {
      vm.reverseSort = !vm.reverseSort;
    }
    else {
      vm.reverseSort = false;
      vm.sortColumnName = columnName;
    }
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
