'use strict';

angular.module('ngcourse')

.controller('TaskEditCtrl', function ($http, $log, tasks, $stateParams, router) {
  var vm = this;

  tasks.getTask($stateParams._id)
    .then(function (response) {
      vm.task = response;
    })
    .then(null, $log.error);

  vm.cancel = router.goToTaskList;

  vm.updateTask = function (task) {
    tasks.updateTask(task)
      .then(function () {
        router.goToTaskList();
      })
      .then(null, $log.error);
  };
});