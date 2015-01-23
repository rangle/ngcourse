'use strict';

angular.module('ngcourse')

<<<<<<< HEAD
.controller('TaskListCtrl', function ($log, tasks, users, router) {
  var vm = this;
  vm.tasks = [];
  vm.addTask = router.goToAddTask;

  vm.getUserDisplayName = users.getUserDisplayName;

  tasks.getTasks()
    .then(function (tasks) {
      return users.whenReady()
        .then(function() {
          vm.tasks = tasks;
        });
    })
    .then(null, $log.error);
});
=======
.controller('TaskListCtrl', function($scope, $log) {
    $log.debug('$scope:', $scope);
    var scope = this;
    scope.tasks = [{
        owner: 'alice',
        description: 'Build the dog shed.'
    }, {
        owner: 'bob',
        description: 'Get the milk.'
    }, {
        owner: 'alice',
        description: 'Fix the door handle.'
    }];

    scope.numberOfTasks = scope.tasks.length;
    scope.addTask = function() {
        scope.numberOfTasks += 1;
    };
});
>>>>>>> FETCH_HEAD
