'use strict';

angular.module('ngcourse.auth', ['ngcourse.server'])
  .factory('auth', function ($window, $q, $log, server) {
    var service = this;
    var authenticatedDeferred = $q.defer();

    service.isAuthenticated = false;

    service.login = function(username, password) {
      var credentials = {
        username: username,
        password: password
      };

      return server.get('/users', credentials)
        .then(function(users) {
          return users[0] || $q.reject('User not found');
        })
        .then(function (user) {
          service.isAuthenticated = true;
          service.username = username;
          service.password = password;
          authenticatedDeferred.resolve();
        });
    };

    service.logout = function(nextUrl) {
      $window.location.replace(nextUrl || '/');
    };

    service.whenAuthenticated = function () {
      return authenticatedDeferred.promise;
    };

    return service;
  });