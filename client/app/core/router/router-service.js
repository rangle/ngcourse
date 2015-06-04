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
      views: {
        'actionArea@tasks': {
          template: ' <button ng-click="taskList.addTask()">Add task</button> '
        },
        '': {
          controller: 'TaskListCtrl as taskList',
          templateUrl: '/app/sections/task-list/task-list.html'
        }
      },
    })
    .state('tasks.add', {
      url: '/add',
      views: {
        'actionArea@tasks': {
          controller: 'TaskAddCtrl as taskAdd',
          templateUrl: '/app/sections/task-add/task-add.html'
        }
      }
    })
    .state('tasks.details', {
      url: '/{_id}',
      views: {
        'actionArea@tasks': {
          controller: 'TaskEditCtrl as taskEdit',
          templateUrl: '/app/sections/task-edit/task-edit.html'
        }
      }
    })
    .state('account', {
      url: '/my-account',
      template: 'my account {{ greeting }}',
      resolve: {
        greeting: function($timeout) {
          return $timeout(function() {
            return 'Hello';
          }, 3000);
        }
      }
    });
})

.factory('router', function ($state, $stateParams) {
  var service = {};

  service.goToTask = function(taskId) {
    $state.go('tasks.details', {_id: taskId});
  };

  service.goToAddTask = function() {
    $state.go('tasks.add');
  };

  service.getTaskId = function() {
    return $stateParams._id;
  };

  return service;
});
