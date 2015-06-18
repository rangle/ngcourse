'use strict';

angular.module('ngcourse.router', [
  'ui.router'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/tasks');

  $locationProvider.html5Mode(false);

  $stateProvider
    .state('tasks', {
      url: '/tasks',
      controller: 'TaskListCtrl as taskList',
      templateUrl: '/app/sections/task-list/task-list.html'
    })
    .state('tasks.details', {
      url: '/{_id:[A-Za-z0-9-_]{0,}}',
      views: {
        'actionArea': {
          template: 'task details with id'
        }
      }
    })
    .state('account', {
      url: '/my-account',
      template: '<h1>my account</h1>'
    });
})

.factory('router', function ($state, $stateParams) {
  var service = {};

  service.goToTask = function(taskId) {
    $state.go('tasks.details', {_id: taskId});
  };

  service.getTaskId = function() {
    return $stateParams._id;
  };

  return service;
});
