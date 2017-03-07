/*global angular,_*/

/**
 * @module koast-resource/_KoastEndpoint
 */
angular.module('koast-resource')
  .factory('_KoastEndpoint', [

    function () {
      'use strict';

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
