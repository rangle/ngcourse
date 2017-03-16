angular.module('ngcourse.users', [])

  .factory('users', function ($q, server) {
    var service = {};

    service.username = null;
    service.password = null;
    service.login = function (username, password) {
      return service.getUser(username).then(function (loggedInUser) {
        if (loggedInUser && loggedInUser.password === password) {
          service.username = username;
          service.password = password;
          return loggedInUser;
        } else {
          service.username = null;
          service.password = null;
          return $q.reject('Invalid login credentials');
        }
      })
    };

  service.getUser = function (username) {
    return server.get('/users?username=' + username)
      .then(function (users) {
        return users[0]; // json-server always returns an array here
      });
  };

    return service;
  });