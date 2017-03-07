/**
 * @module koast-user/_koastUser
 */
angular.module('koast-user')
  .factory('_koastUser', ['_koastOauth', '_koastHttp',
    '_koastLogger', '$log',
    '$timeout', '$http', '$window', '$q', '$location',
    function (koastOauth, _koastHttp, _koastLogger, $log, $timeout, $http,
      $window, $q, $location) {
      'use strict';

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

      };
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
