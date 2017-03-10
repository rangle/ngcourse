angular.module('ngcourse.users', [])

  .factory('users', function () {
    var service = {};

    service.username = null;
    service.password = null;

    service.login = function (name, password) {
      service.username = name;
      service.password = password;
    };

    service.getUserDisplayName = function (username) {
      return username;
    };
    return service;
  });