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
    'use strict';

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