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
      views: {
        'actionArea@tasks': {
          template: ' <button ng-click="taskList.addTask()">Add task</button> '
        },
        '': {
          controller: 'TaskListCtrl as taskList',
          templateUrl: '/app/sections/task-list/task-list.html'
        }
      }
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
      url: '/{id: [0-9a-zA-Z]{9}}',
      views: {
        'actionArea@tasks': {
          controller: 'TaskEditCtrl as taskEdit',
          templateUrl: '/app/sections/task-edit/task-edit.html'
        }
      }
    })
    .state('foo', {
      url: '/foo',
      views: {
        'foo': {
          template: 'foo <div ui-view="bar@main"></div> +'
        }
      },
    })
    .state('foo.bar', {
      url: '/bar',
      views: {
        'bar@main': {
          template: 'bar'
        }
      }
    });
})

.factory('router', function ($log, $state, $stateParams) {
  var service = {};

  service.goToAddTask = function () {
    $state.go('tasks.add');
  };

  service.goToTask = function (taskId) {
    $state.go('tasks.details', {
      id: taskId
    });
  };

  service.goToTaskList = function () {
    $state.go('tasks', {}, {
      reload: true
    });
  };

  return service;
});