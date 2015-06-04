'use strict';

angular.module('ngcourse.users', ['ngcourse.server'])

.factory('users', function (server) {
  var service = {};

  service.username= null;
  service.password= null;
  service.login= function(name, password){
    service.username=name;
    service.password=password;
  };

  service.getUsers = function() {
    return server.get('/api/v1/users');
  };

  return service;
});
