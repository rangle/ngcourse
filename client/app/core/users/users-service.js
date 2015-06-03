'use strict';

angular.module('ngcourse.users', ['ngcourse.server'])

.factory('users', function (server) {
  var service = {};

  service.getUsers = function() {
    return server.get('/api/v1/users');
  };

  return service;
});
