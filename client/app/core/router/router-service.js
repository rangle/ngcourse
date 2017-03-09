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
      .state('tasksDetail', {
        url: '/tasks/{id}',
        template: 'task details'
      })
      .state('account', {
        url: '/my-account',
        template: 'My account',
        resolve: {
          greeting: function ($timeout) {
            return $timeout(function () {
              return 'Hello';
            }, 3000);
          }
        }
      })
      .state('parent', {
        url: '/parent',
        views: {
          'parent': {
            template: 'parent view <div ui-view="child@parent"></div>'
          }
        },
      })
      .state('parent.child1', {
        url: '/child1',
        views: {
          'child@parent': {
            template: 'child 1'
          }
        }
      })
      .state('parent.child2', {
        url: '/child2',
        views: {
          'child@parent': {
            template: 'child 2'
          }
        }
      });
  })
  .factory('router', function ($log, $state, $stateParams) {
    var service = {};

    service.goToTask = function (taskId) {
      $state.go('tasks.details', { id: taskId });
    };

    service.getTaskId = function () {
      return $stateParams.id;
    };

    return service;
  });
