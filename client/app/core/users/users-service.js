'use strict';

angular.module('ngcourse.users', [])

.factory('users', function () {
  var service={};

  service.username = null;
  service.password = null;

  service.login = function(name, password){
    service.username = name;
    service.password = password;
  };

  return service;
});