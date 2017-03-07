/* global angular,_ */
'use strict';


// Abstracts server interaction.

/**
 * more stuff
 * @module koast-http/_koastHttp
 */
angular.module('koast-http', ['koast-logger'])
  .factory('_koastHttp', ['$http', '$q', '_koastLogger', '_koastTokenKeeper',
    function ($http, $q, _koastLogger, _koastTokenKeeper) {
      var log = _koastLogger.makeLogger('koast.http');
      var service = {};
      var options = {
        timeout: 30000 // 30 seconds
      };
      var token = _koastTokenKeeper.loadToken();

      log.debug('Loaded token', token);

      service.setOptions = function (newOptions) {
        options = newOptions;
      };

      function addTokenHeader() {

        options.headers = options.headers || {};
        if (token) {
          options.headers.Authorization = 'Bearer ' + token;
        }

      }

      service.saveToken = function (tokenData) {
        token = tokenData.token;
        _koastTokenKeeper.saveToken(tokenData);
      };

      service.deleteToken = function (tokenData) {
        _koastTokenKeeper.clear();
      };

      function whenAuthenticated() {
        // ::todo
        return $q.when();
      }

      // Sandwiches a call to the server inbetween checking for things like
      // authentication and post-call error checking.
      function makeServerRequest(caller) {
        return whenAuthenticated()
          // .then(function() {
          //   if (!networkInformation.isOnline) {
          //     throw 'offline';
          //   }
          // })
          .then(function () {
            addTokenHeader();
          })
          .then(caller)
          .then(function (response) {
            service.isReachable = true;
            return response.data ? response.data : response;
          })
          .then(null, function (err) {
            log.warn(err.data || err);
            throw err;
          });
        // .then(null, function(error) {
        //   error = checkErrors(error);
        //   throw error.data? error.data: error;
        // });
      }

      service.post = function (url, data, inputOptions) {
        inputOptions = _.cloneDeep(inputOptions) || options;
        inputOptions.baseUrl = options.baseUrl || '';
        inputOptions.method = 'POST';
        inputOptions.data = data;
        return makeServerRequest(function () {
          var config = _.cloneDeep(inputOptions);
          config.url = inputOptions.baseUrl + url;
          config.params = inputOptions.params;
          return $http(config);
        });
      };

      service.put = function (url, data, inputOptions) {
        inputOptions = _.cloneDeep(inputOptions) || options;
        inputOptions.baseUrl = options.baseUrl || '';
        inputOptions.method = 'PUT';
        inputOptions.data = data;
        return makeServerRequest(function () {
          var config = _.cloneDeep(inputOptions);
          config.url = inputOptions.baseUrl + url;
          config.params = inputOptions.params;

          return $http(config);
        });
      };
      service.get = function (url, inputOptions) {
        inputOptions = _.cloneDeep(inputOptions) || options;
        inputOptions.baseUrl = options.baseUrl || '';
        inputOptions.method = 'GET';
        return makeServerRequest(function () {
          var config = _.cloneDeep(inputOptions);
          config.url = inputOptions.baseUrl + url;
          config.params = inputOptions.params;

          return $http(config);
        });
      };

      return service;
    }
  ]);
