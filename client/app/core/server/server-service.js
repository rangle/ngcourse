'use strict';

angular.module('ngcourse.server', [])

  .constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')

  .factory('server', function($http, API_BASE_URL) {
    var service = {};

    service.get = function (path) {
      return $http.get(API_BASE_URL + path)
        .then(function(response) {
          return response.data;
        });
    };

    return service;
  });