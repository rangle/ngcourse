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
      });
  });