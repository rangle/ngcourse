angular.module('ngcourse.users', [])

  .factory('users', function (server, $q) {
    var service = {};

    service.username = null;
    service.password = null;

    service.getUser = function (username) {
      return server.get('/users?username=' + username)
        .then(function (users) {
          return users[0]; // json-server always returns an array here
        });
    };

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

    return service;
  });