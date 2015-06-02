'use strict';

angular.module('ngcourse')

.controller('TaskListCtrl', function($log) {
  var vm = this;

  vm.tasks = [
    {
      owner: 'alice',
      description: 'Build the dog shed.'
    },
    {
      owner: 'bob',
      description: 'Get the milk.'
    },
    {
      owner: 'alice',
      description: 'Fix the door handle.'
    }
  ];

  vm.numberOfTasks = 0;
  vm.addTask = function() {
    vm.numberOfTasks += 1;
  };
});