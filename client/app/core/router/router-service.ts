import {Inject, getServices} from 'utils/di';

let configureRouter:any = function configureRouter() {
  let services:any = getServices(configureRouter, arguments);
  services.$urlRouterProvider.otherwise('/tasks');
  services.$locationProvider.html5Mode(false);

  services.$stateProvider
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
    })
    .state('account', {
      url: '/my-account',
      template: 'My account',
      resolve: {
        timeout: function ($timeout) {
          return $timeout(function () {}, 3000);
        }
      }
    });
}
configureRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
export {configureRouter};

export class RouterService {
  services: any;
  $state: any;
  constructor(
    @Inject('$log') $log,
    @Inject('$state') $state,
    @Inject('$stateParams') $stateParams
  ) {
    this.services = getServices(this.constructor, arguments);
    this.$state = this.services.$state;
  }

  goToAddTask() {
    this.$state.go('tasks.add');
  }

  goToTask(taskId) {
    this.$state.go('tasks.details', {
      _id: taskId
    });
  }

  goToTaskList() {
    this.$state.go('tasks', {}, {
      reload: true
    });
  }
}