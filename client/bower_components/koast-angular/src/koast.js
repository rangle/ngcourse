/* global angular */
'use strict';
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