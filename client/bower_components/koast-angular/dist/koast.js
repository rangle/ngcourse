(function(window, document, undefined) {
'use strict';
// koast - 0.1.5
/* global angular */

/**
 *
 * @module koast
 */
angular.module('koast', ['koast-user', 'koast-resource', 'koast-versionCheck'])
  .run(function () {
    if (typeof _ === typeof undefined) {
      throw new Error(
        '_ is undefined. koast-angular requires underscore or lodash to be loaded'
      );
    }
  });

angular.module('koast').constant('peerDependencies', {
	"koast": ">=0.4.5"
});

/**
 * @alias module:koast
 */
angular.module('koast')
  .factory('koast', ['_koastUser', '_koastResourceGetter', '$log',
    '_koastHttp', 'versionCheck',
    function (koastUser, koastResourceGetter, $log, _koastHttp, versionCheck) {
var service = {};
      var resourceGetterMethodsToCopy = [
        'setApiUriPrefix',
        'getResource',
        'createResource',
        'queryForResources',
        'addEndpoint'
      ];

      // For koastUser, we just attach the service as a field.
      service.user = koastUser;

      // For koastResourceGetter we basically copy all the methods except init.
      resourceGetterMethodsToCopy.forEach(function (functionName) {
        service[functionName] = koastResourceGetter[functionName];
      });


      service.init = function (options) {


        $log.info('Initializing koast.');
        _koastHttp.setOptions(options);
        koastUser.init(options);
        koastResourceGetter.init(options);
        versionCheck.isCompatible();

      };

      return service;
    }
  ]);

/* global angular,_ */
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
      };

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

/* global angular,_ */
/**
 * @module koast-http/_koastTokenKeeper
 */
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

/* global angular */
// Logging with a few extra bells and whistles.
//

/**
 * @module koast-logger
 */
angular.module('koast-logger', [])
  .factory('_koastLogger', [
    function () {

      var service = {};
      service.levels = {
        debug: 1,
        verbose: 2,
        info: 3,
        warn: 4,
        error: 5
      };
      var logLevel = 3;
      service.colors = {};
      service.setLogLevel = function (newLevel) {
        logLevel = newLevel;
      };

      function log(options, groupOptions, values) {
        options = arguments[0] || {};

        if (options.level && options.level < logLevel) {
          return;
        }

        var color = options.color || 'black';
        var args = [];
        var noMoreColors = false;
        values = Array.prototype.slice.call(values, 0);
        var colored = [];
        if (typeof values[0] === 'string') {
          colored.push('%c' + values.shift());
          args.push('color:' + color + ';');
        }

        if (groupOptions.groupName) {
          colored.unshift('%c[' + groupOptions.groupName + ']');
          args.unshift('color:gray;');
        }
        if (options.symbol) {
          colored.unshift('%c' + options.symbol);
          args.unshift('color:' + color +
            ';font-weight:bold;font-size:150%;');
        }
        args.unshift(colored.join(' '));
        args = args.concat(values);
        Function.prototype.apply.call(console.log, console, args);
      }

      function makeLoggerFunction(options) {
        options.level = service.levels[options.name];
        return function (groupOptions, args) {
          log(options, groupOptions, args);
        };
      }

      var logFunctions = {
        debug: makeLoggerFunction({
          name: 'debug',
          color: 'gray',
          symbol: '✍'
        }),
        verbose: makeLoggerFunction({
          name: 'verbose',
          color: 'cyan',
          symbol: '☞'
        }),
        info: makeLoggerFunction({
          name: 'info',
          color: '#0074D9',
          symbol: '☞'
        }),
        warn: makeLoggerFunction({
          name: 'warn',
          color: 'orange',
          symbol: '⚐'
        }),
        error: makeLoggerFunction({
          name: 'error',
          color: 'red',
          symbol: '⚑'
        }),
      };

      var methodNames = ['debug', 'verbose', 'info', 'warn', 'error'];

      service.makeLogger = function (options) {
        var logger = {};
        if (typeof options === 'string') {
          options = {
            groupName: options
          };
        }
        logger.options = options;
        methodNames.forEach(function (methodName) {
          logger[methodName] = function () {
            var args = arguments;
            return logFunctions[methodName](logger.options, args);
          };
        });

        return logger;
      };

      var defaultLogger = service.makeLogger({});

      methodNames.forEach(function (methodName) {
        service[methodName] = defaultLogger[methodName];
      });

      return service;
    }
  ]);

/* global angular, _ */

/**
 * @module koast-resource
 */

angular.module('koast-resource', ['koast-user']);

/*global angular,_*/

/**
 * @module koast-resource/_KoastEndpoint
 */
angular.module('koast-resource')
  .factory('_KoastEndpoint', [

    function () {
// The constructor.
      function Endpoint(prefix, handle, template, options) {
        var endpoint = this;
        endpoint.prefix = prefix;
        endpoint.handle = handle;
        endpoint.template = template;
        endpoint.options = _.clone(options);
      }

      // A method to generate the post url - that is, a URL that does not
      // identify a specific resource.
      Endpoint.prototype.makePostUrl = function () {
        return this.prefix + this.handle;
      };

      // An auxiliary function to generate the part of the URL that identifies
      // the specific resource.
      function makeResourceIdentifier(template, params) {

        if (!params) {
          return '';
        } else {
          return template.replace(/:([-_a-zA-Z]*)/g, function (_, paramName) {
            var param = params[paramName];
            var paramIsDefined = param || (param === 0); // Accept 0 as "defined".
            if (!paramIsDefined) {
              throw new Error('Missing parameter: ' + paramName);
            }
            return params[paramName];
          });
        }
      }

      // A method to generate a URL for get, put or delete - that is, a URL that
      // identies a particular resource. This URL would not include the query
      // string, since $http will attach that for us.
      Endpoint.prototype.makeGetUrl = function (params) {
        return this.makePostUrl() + '/' + makeResourceIdentifier(this.template,
          params);
      };

      // The service instance is actually going to be a constructor function.
      return Endpoint;
    }
  ]);

/*global angular,_*/

/**
 * @module koast-resource/_koastResourceGetter
 */
angular.module('koast-resource')
  .factory('_koastResourceGetter', ['_KoastResource', '_KoastServerHelper',
    '_KoastEndpoint', '$http', '$q', '$log', '_koastHttp',
    function (KoastResource, KoastServerHelper, KoastEndpoint, $http, $q,
      $log, _koastHttp) {
var service = {};
      var prefixes = {};
      var endpoints = {};
      var options = {};



      // Converts an array of raw results coming from the server into an array
      // of resources. If options specify a singular resource, then we just
      // return that resource.
      function convertResultsToResources(results, options) {

        var resources = _.map(results, function (rawResult) {
          return new KoastResource(options.endpoint, rawResult, options);
        });

        if (options.singular) {
          if (resources.length === 0) {
            resources = null;
          } else if (resources.length > 1) {
            $log.warn('Expected a singular resource, got ' + resources.length);
            resources = resources[0];
          } else {
            resources = resources[0];
          }
        }
        return resources;
      }

      // An auxiliary function that actually gets the resource. This should work
      // for either a request to get a single item or a query for multiple.
      function get(endpointHandle, params, query, resourceOptions) {
        var endpoint = endpoints[endpointHandle];
        var headers = {};
        var options = {};
        var getConfig = {
          params: query,
          headers: headers
        };
        options = angular.extend(options, endpoint.options);
        options = angular.extend(options, resourceOptions);
        options.endpoint = endpoint;
        if (!endpoint) {
          throw new Error('Unknown endpoint: ' + endpointHandle);
        }

        KoastServerHelper.addAuthHeaders(headers);

        return _koastHttp.get(endpoint.makeGetUrl(params), getConfig)
          .then(function (response) {
            return convertResultsToResources(response, options);
          });
      }

      // Sets the prefix for API URLs. The prefix can be optionally associated
      // with a server handle. If no handle is specified, this method sets API
      // URL prefix for the default server.
      service.setApiUriPrefix = function (newPrefix, serverHandle) {
        serverHandle = serverHandle || '_';
        prefixes[serverHandle] = newPrefix;
      };

      /**
       * Gets a single resource. This should be used when we want to retrieve
       * a specific resource.
       *
       * @param  {String} endpointHandle    A string identifying the endpoint.
       * @param  {Object} params            An object identifying a specific
       *                                    resource.
       * @return {promise}                  A $q promise that resolves to
       *                                    specific resource (or null if not
       *                                    found).
       */
      service.getResource = function (endpointHandle, params) {
        return get(endpointHandle, params, null, {
          singular: true
        });
      };


      function post(endpointHandle, data, options) {
        var deferred = $q.defer();
        var endpoint = endpoints[endpointHandle];
        var headers = {};

        options = options || {};
        if (!endpoint) {
          throw new Error('Unknown endpoint: ' + endpointHandle);
        }

        KoastServerHelper.addAuthHeaders(headers);

        return _koastHttp.post(endpoint.makePostUrl(), data, {
          headers: headers
        });

      }


      service.createResource = function (endpointHandle, body) {
        return post(endpointHandle, body)
          .then(null, $log.error);
      };

      /**
       * Queries for resource. This should be used when we want to get a list of
       * resources that satisfy some criteria.
       *
       * @param  {String} endpointHandle    A string identifying the endpoint.
       * @param  {Object} query             A query object.
       * @return {promise}                  A $q promise that resolves to a list
       *                                    of resources.
       */
      service.queryForResources = function (endpointHandle, query) {

        return get(endpointHandle, null, query);
      };

      service.addEndpoint = function (handle, template, options) {
        options = options || {};
        var serverHandle = options.server || '_';
        var prefix = prefixes[serverHandle];
        if (!prefix) {
          throw new Error('No URI prefix defined for server ' +
            serverHandle);
        }
        var endpoint = new KoastEndpoint(prefix, handle, template, options);
        if (endpoints[handle]) {
          throw new Error(
            'An endpoint with this handle was already defined: ' +
            handle);
        }
        endpoints[handle] = endpoint;
      };

      service.init = function (initOptions) {
        options = initOptions;
      };

      return service;
    }
  ]);

/*global angular,_*/

/**
 * @module koast-resource/_KoastResource
 */
angular.module('koast-resource')
  .factory('_KoastResource', ['_KoastServerHelper', '$q', '_koastHttp', '$log',
    function (KoastServerHelper, $q, _koastHttp, $log) {
// A client side representation of a saveable RESTful resource instance.
      function Resource(endpoint, result, options) {
        var resource = this;
        var data;
        if (options.useEnvelope) {
          data = result.data;
          if (!data) {
            throw new Error(
              'Client expects an envelope, but server did not send it properly.'
            );
          }
        } else {
          data = result;
        }
        _.keys(data).forEach(function (key) {
          resource[key] = data[key];
        });

        if (options.useEnvelope) {
          Object.defineProperty(this, 'can', {
            get: function () {
              return result.meta.can;
            }
          });
        }

        Object.defineProperty(this, '_endpoint', {
          get: function () {
            return endpoint;
          }
        });

        return this;
      }

      // A method for saving the resource
      Resource.prototype.save = function () {
        var url = this._endpoint.makeGetUrl(this);
        var headers = {};
        KoastServerHelper.addAuthHeaders(headers);
        return _koastHttp.put(url, this, {
          headers: headers
        });
      };

      // A method for deleting the resource
      Resource.prototype.delete = function () {
        $log.debug('The endpoint: ', this._endpoint);
        var url = this._endpoint.makeGetUrl(this);
        $log.debug('delete url:', url);
        var headers = {};
        KoastServerHelper.addAuthHeaders(headers);
        return _koastHttp.delete(url, {
          headers: headers
        });
      };

      return Resource;
    }
  ])

/*global angular,_*/

/**
 * @module koast-resource/_KoastServerHelper
 */
angular.module('koast-resource')
  .factory('_KoastServerHelper', ['_koastUser', '_koastTokenKeeper',
    function (user, _koastTokenKeeper) {
var service = {};

      service.addAuthHeaders = function (headers) {

        if (user.isSignedIn) {
          headers['koast-auth-token'] = user.meta.token;
          headers['koast-auth-token-timestamp'] = user.meta.timestamp;
          headers['koast-user'] = angular.toJson(user.data);

        }
        headers['Authorization'] = 'Bearer ' + _koastTokenKeeper.loadToken();
      };
      return service;
    }
  ]);

/* global angular */

/**
 * @module koast-user
 */
angular.module('koast-user', [
  'koast-logger',
  'koast-http'
]);

/**
 * @module koast-user/_koastOAuth
 */
angular.module('koast-user')
  .factory('_koastOauth', ['$window', '$location', '$log', '_koastLogger',

    function ($window, $location, $log, _koastLogger) {
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

/**
 * @module koast-user/_koastUser
 */
angular.module('koast-user')
  .factory('_koastUser', ['_koastOauth', '_koastHttp',
    '_koastLogger', '$log',
    '$timeout', '$http', '$window', '$q', '$location',
    function (koastOauth, _koastHttp, _koastLogger, $log, $timeout, $http,
      $window, $q, $location) {
var log = _koastLogger.makeLogger('koast.user');
      var koastHttp = _koastHttp;

      // This is our service, which is an object that represents the user. The
      // app should be able to just add this to the scope.
      var user = {
        isAuthenticated: false, // Whether the user is authenticated or anonymous.
        isReady: false, // Whether the user's status is known.
        data: {}, // User data coming from the database or similar.
        meta: {} // Metadata: registration status, tokens, etc.
      };

      var registrationHandler; // An optional callback for registering an new user.
      var statusPromise; // A promise resolving to user's authentication status.
      var authenticatedDeferred = $q.defer();

      // Inserts a pause into a promise chain if the debug config requires it.
      function pauseIfDebugging(value) {
        var delay = user.debug.delay;
        if (delay) {
          $log.debug('Delayng for ' + delay + ' msec.');
          return $timeout(function () {
            return value;
          }, delay);
        } else {
          return value;
        }
      }

      // Sets the user's data and meta data.
      // Returns true if the user is authenticated.
      function setUser(responseBody) {
        var valid = responseBody && responseBody.data;
        var newUser;
        log.debug('Setting the user based on', responseBody);
        if (!valid) {
          log.warn('Did not get back a valid user record.', responseBody);
          user.data = {};
          user.isAuthenticated = false;
          user.meta = {};
        } else {
          // Figure out if the user is signed in. If so, update user.data and
          // user.meta.
          if (responseBody.isAuthenticated) {
            log.info('response body is', responseBody);
            log.info('response body data is', responseBody.data);
            log.info('response body meta is', responseBody.meta);
            user.data = responseBody.data;
            user.meta = responseBody.meta;
            if (user.meta.token) {
              koastHttp.saveToken({
                token: user.meta.token,
                expires: user.meta.expires
              });
            }
            authenticatedDeferred.resolve();
          }
          user.isAuthenticated = responseBody.isAuthenticated;
        }
        user.isReady = true;
        return user.isAuthenticated;
      }

      // Calls registration handler if necessary. Returns a boolean indicating
      // whether the user is authenticated or a promise for such a boolean.
      function callRegistrationHandler(isAuthenticated) {
        // Call the registration handler if the user is new and the handler
        // is defined.
        if (isAuthenticated && (!user.meta.isRegistered) &&
          registrationHandler) {
          // Using $timeout to give angular a chance to update the view.
          // $timeout returns a promise equivalent to the one returned by
          // registrationHandler.
          return $timeout(registrationHandler, 0)
            .then(function () {
              return isAuthenticated;
            });
        } else {
          return isAuthenticated;
        }
      }

      function postAuthRedirect() {
          var nextUrl = koastOauth.getNextUrl();
          koastOauth.clearNextUrl();
          if (nextUrl) {
            $location.url(nextUrl);
          } else {
            return {};
          }
        }
        // Retrieves user's data from the server. This means we need to make an
        // extra trip to the server, but the benefit is that this method works
        // across a range of authentication setups and we are not limited by
        // cookie size.
      function getUserData(url) {

        // First get the current user data from the server.
        return koastHttp.get(url || '/auth/user')
          .then(null, function (response) {
            if (response.status === 401) {
              return null;
            } else {
              throw response;
            }
          })
          .then(pauseIfDebugging)
          .then(setUser)
          .then(callRegistrationHandler);
      }

      user.getUserData = getUserData;

      user.saveToken = function (token, expires) {
        koastHttp.saveToken({
          token: token,
          expires: expires
        });
      };
      // Initiates the login process.

      user.initiateOauthAuthentication = function (provider, redirectState) {
        koastOauth.initiateAuthentication(provider, redirectState);
      };

      // Posts a logout request.
      user.logout = function (nextUrl) {
        koastHttp.deleteToken();
        return $http.post(koastOauth.makeRequestURL('/auth/logout'))
          .then(function (response) {
            if (response.data !== 'Ok') {
              throw new Error('Failed to logout.');
            } else {
              $window.location.replace(nextUrl || '/');
            }
          })
          .then(null, function (error) {
            $log.error(error);
            throw error;
          });
      };

      // user logs in with local strategy
      user.loginLocal = function (user) {
        $log.debug('Login:', user.username);
        var body = {
          username: user.username,
          password: user.password
        };
        return $http.post(koastOauth.makeRequestURL('/auth/login'), body)
          .then(function (response) {
            log.debug('loginLocal:', response);
            return response.data;
          })
          .then(setUser);
      };

      // Registers the user (social login)
      user.registerSocial = function (data) {


        return koastHttp.put('/auth/user', data)
          .then(function (response) {
            if (response.meta.token) {
              user.saveToken(response.meta.token, response.meta.expires);
            }
            return getUserData();
          });
      };

      // Registers the user (local strategy)
      user.registerLocal = function (userData) {
        return $http.post(koastOauth.makeRequestURL('/auth/user'), userData);
      };

      // Checks if a username is available.
      user.checkUsernameAvailability = function (username) {
        var url = '/auth/usernameAvailable'; //koastOauth.makeRequestURL('/auth/usernameAvailable');
        return koastHttp.get(url, {
            params: {
              username: username
            }
          })
          .then(function (result) {

            return result.data === true;
          })
          .then(null, function (x) {

          });
      };

      user.resetPassword = function (email) {
        return $http.post(koastOauth.makeRequestURL('/forgot'), {
          email: email
        });
      };

      user.setNewPassword = function (newPassword, token) {
        return $http.post(koastOauth.makeRequestURL('/reset/' + token), {
          password: newPassword
        });
      };

      // Attaches a registration handler - afunction that will be called when we
      // have a new user.
      user.setRegistrationHanler = function (handler) {
        registrationHandler = handler;
      };

      // Returns a promise that resolves to user's login status.
      user.getStatusPromise = function () {
        if (!statusPromise) {
          statusPromise = getUserData();
        }
        return statusPromise;
      };

      user.whenStatusIsKnown = user.getStatusPromise;



      user.refreshToken = function (url, initToken) {
        return koastHttp.get(url || '/auth/token/refresh').then(function (
          response) {
          if (response.token) {
            user.meta.token = response.token;
            return response;
          } else {
            return initToken;
          }
        });

      }
      user.checkForToken = function () {
        var queryToken = $location.search().redirectToken;
        if (queryToken) {
          user.saveToken(queryToken);
          return user
            .refreshToken(null, queryToken)
            .then(function (data) {

              return user.saveToken(data.token, data.expires);

            });
        } else {
          return $q.when({});
        }
      };
      // Initializes the user service.
      user.init = function (options) {
        options.debug = options.debug || {};
        user.debug = options.debug;
        //koastHttp.setOptions(options);
        koastOauth.setBaseUrl(options.baseUrl);
        return user.checkForToken()
          .then(user.getStatusPromise)
          .then(postAuthRedirect);

      };

      // Returns a promise that resolves when the user is authenticated.
      user.whenAuthenticated = function () {
        return authenticatedDeferred.promise;
      };

      return user;
    }
  ]);

/* global angular */

/**
 * Check the compatability of the current version of koast-angular with the server version of koast
 * @module koast/versionCheck
 */
angular.module('koast-versionCheck', ['koast-http', 'koast-logger']).factory(
  'versionCheck',
  function (
    _koastHttp,
    peerDependencies, $log) {
var COMPATABILITY_URL =
      '/meta/koast-angular/check-compatability?koast-version=';

    function logResult(result) {
      var logger = (result.isCompatible) ? $log.info : $log.error;

      if (result.isCompatible) {
        logger(
          'Current version of kaost-angular is compatible with server'
        );

      } else {
        logger(
          'Current version of kaost-angular is not compatible with server'
        );

      }
      logger('isCompatible', result.isCompatible);
      logger('koast server version:', result.koastVersion);
      logger('koast-angular compatible versions:', result.checkedVersion);
      return result;
    }

    function isCompatible(version) {
      version = version || peerDependencies.koast;
      version = encodeURIComponent(version);
      return _koastHttp.get(COMPATABILITY_URL + version).then(logResult);
    }

    return {
      isCompatible: isCompatible
    };


  });

})(window, document);
