/* global angular,_ */
/**
 * @module koast-http/_koastTokenKeeper
 */
'use strict';
angular.module('koast-http')
  .factory('_koastTokenKeeper', ['$log', '$window',
    function ($log, $window) {
      var _tokenKey = 'KoastToken';
      var service = {};
      //set where to keep the token
      //needed by koast admin app to prevent it from overwriting the koast token
      service.setTokenKey = function(newKey) {
        _tokenKey = newKey;
      };
      service.saveToken = function (params) {
        var tokenValue = params.token || params;
        $window.localStorage.setItem(_tokenKey, tokenValue);
      };
      service.loadToken = function () {
        return $window.localStorage.getItem(_tokenKey);
      };
      service.clear = function () {
        return $window.localStorage.removeItem(_tokenKey);
      };

      return service;
    }
  ]);
