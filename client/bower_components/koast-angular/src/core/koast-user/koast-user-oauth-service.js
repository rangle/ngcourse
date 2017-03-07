/**
 * @module koast-user/_koastOAuth
 */
angular.module('koast-user')
  .factory('_koastOauth', ['$window', '$location', '$log', '_koastLogger',

    function ($window, $location, $log, _koastLogger) {
      'use strict';
      var NEXT_URL_KEY = 'Koast_Post_Auth_Url';
      var service = {};

      var log = _koastLogger;

      // This is only a default value, the Koast client must set baseUrl via Koast.init()
      // if the client is served on a different server than that of the API server.
      var baseUrl = $location.absUrl().split('/').slice(0, 3).join('/');


      // Makes a URL for the OAuth provider.
      function makeAuthUrl(provider, nextUrl) {
        return baseUrl + '/auth/' + provider + '?next=' +
          encodeURIComponent(nextUrl);
      }
      service.setNextUrl = function (state) {
        $window.localStorage.setItem(NEXT_URL_KEY, state);
      };
      service.clearNextUrl = function () {
        $window.localStorage.removeItem(NEXT_URL_KEY);
      };
      service.getNextUrl = function () {
        return $window.localStorage.getItem(NEXT_URL_KEY);
      };
      // Sends the user to the provider's OAuth login page.
      service.initiateAuthentication = function (provider, redirectUrl) {
        service.setNextUrl(redirectUrl);
        var newUrl = makeAuthUrl(provider, $location.absUrl());
        $window.location.replace(newUrl);
      };

      // Sets a new base URL
      service.setBaseUrl = function (newBaseUrl) {
        baseUrl = newBaseUrl;
      };

      // expects end point to precede with a forward-slash "/"
      service.makeRequestURL = function (endPoint) {
        if (!endPoint) {
          endPoint = '';
        }
        return baseUrl + endPoint;
      };

      return service;
    }
  ]);