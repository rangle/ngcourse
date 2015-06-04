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
    return server.get('/api/v1/users')
      .then(function(_usersList) {
        service.usersList = _usersList;
        return _usersList;
      });
  };

  service.getUser = function(username) {
    return _.find(service.usersList, { username: username });
  };

  return service;
});
