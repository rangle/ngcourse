'use strict';

angular.module('ngcourse.router', [
  'ui.router'
])

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(false);

  $stateProvider
    .state('home', {
      url: '/',
      controller: 'MainCtrl as main',
      templateUrl: '/app/components/main/main.html'
    })
    .state('tasks', {
      url: '/tasks',
      controller: 'TaskListCtrl as taskList',
      templateUrl: '/app/sections/task-list/task-list.html'
    })
    .state('tasks.edit', {
      url: '/{_id}',
      views: {
        'actionArea': {
          controller: 'TaskEditCtrl as taskEdit',
          templateUrl: '/app/sections/task-edit/task-edit.html'
        }
      }
    })
    .state('account', {
      url: '/my-account',
      template: 'my account'
    });
})

.factory('router', function ($stateParams) {
  var service = {};

  service.getTaskId = function() {
    return $stateParams._id;
  };

  return service;
});
