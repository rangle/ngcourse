/*global angular,_*/

/**
 * @module koast-resource/_koastResourceGetter
 */
angular.module('koast-resource')
  .factory('_koastResourceGetter', ['_KoastResource', '_KoastServerHelper',
    '_KoastEndpoint', '$http', '$q', '$log', '_koastHttp',
    function (KoastResource, KoastServerHelper, KoastEndpoint, $http, $q,
      $log, _koastHttp) {
      'use strict';
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