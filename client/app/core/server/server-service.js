'use strict';

angular.module('ngcourse.server', [])

.factory('server', function ($http, API_BASE_URL) {
  var service = {};

  service.get = function (path, params) {
    return $http({
          url: API_BASE_URL + path,
          method: 'GET',
          params: params
      })
      .then(function (response) {
        return response.data;
      });
  };

  service.post = function (path, data) {
    debugger;
    return $http.post(API_BASE_URL + path, data);
  };

  service.put = function (path, data) {
    return $http.put(API_BASE_URL + path, data);
  };

  return service;
});