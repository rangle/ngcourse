/**
 * @alias module:koast
 */
angular.module('koast')
  .factory('koast', ['_koastUser', '_koastResourceGetter', '$log',
    '_koastHttp', 'versionCheck',
    function (koastUser, koastResourceGetter, $log, _koastHttp, versionCheck) {
      'use strict';
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
