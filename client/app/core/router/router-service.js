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
      template: '<h1>my tasks</h1>'
    });
})

.factory('router', function () {
  var service = {};

  return service;
});
