'use strict';

angular.module('ngcourse.tasks', [])
  .factory('tasks', function (server) {
    var service = {};

    service.getTasks = function () {
      return server.get('/tasks');
    };

    return service;
  });