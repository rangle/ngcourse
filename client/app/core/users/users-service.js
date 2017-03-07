'use strict';

angular.module('ngcourse.users', ['ngcourse.auth', 'ngcourse.server'])

.factory('users', function (auth, server, $http) {
  var service = {};
  var byUserName = {};
  var usersPromise = auth.whenAuthenticated()
    .then(function () {
      return server.get('/users')
        .then(function (userArray) {
          service.all = userArray;
          userArray.forEach(function (user) {
            if (user.username) {
              byUserName[user.username] = user;
            }
          });
        });
    });

  service.whenReady = function () {
    return usersPromise;
  };

  service.getUserByUsername = function (username) {
    return byUserName[username];
  };

  service.getUserDisplayName = function (username) {
    var user = service.getUserByUsername(username);
    if (!user) {
      return '';
    }

    return user.displayName;
  };

  return service;
});
