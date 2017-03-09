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
      .state('tasks.details', {
        url: '/{_id:[0-9a-fA-F]{24}}',

        views: {
          'actionArea@tasks': {
            controller: 'TaskEditCtrl as taskEdit',
            templateUrl: '/app/sections/task-edit/task-edit.html'
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

    service.goToAddTask = function () {
      $state.go('tasks.add');
    };

    service.goToTask = function (taskId) {
      $state.go('tasks.details', { id: taskId });
    };

    service.goToTaskList = function () {
      $state.go('tasks', {}, {
        reload: true
      });
    };

    service.getTaskId = function () {
      return $stateParams.id;
    };

    return service;
  });
