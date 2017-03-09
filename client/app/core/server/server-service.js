angular.module('ngcourse.server', [])

.constant('API_BASE_URL', 'http://localhost:3000')

.factory('server', function ($http, API_BASE_URL) {
  var service = {};

  service.get = function (path) {
    return $http.get(API_BASE_URL + path)
    .then(function (response) {
      return response.data;
    });
  };

  service.post = function (path, data) {
    return $http.post(API_BASE_URL + path, data);
  }

  service.put = function (path, id, data) {
    return $http.put(API_BASE_URL + path + '/' + id, data);
  }

  service.delete = function (path, id) {
    return $http.delete(API_BASE_URL + path + '/' + id, data);
  }

  return service;
});