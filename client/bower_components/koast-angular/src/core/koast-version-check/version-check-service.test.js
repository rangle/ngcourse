/* jshint expr:true */
/* globals describe, it, chai, console, inject, xit,before,beforeEach,angular,sinon,$window,Q */

'use strict';
var expect = chai.expect;

describe('the version check service', function () {
  var versionCheck, $log;

  beforeEach(angular.mock.module('koast-versionCheck'));

  beforeEach(module(function ($provide) {

    $provide.service('$q', function () {
      return Q;
    });

    $provide.constant('peerDependencies', {
      koast: '>=0.4.5'
    });

    $provide.factory('_koastHttp', function ($q) {
      var service = {};
      service.get = function (url) {
        if (url ===
          '/meta/koast-angular/check-compatability?koast-version=%3E%3D0.4.5'
        ) {
          return $q.when({
            isCompatible: true,
            checkedVersion: '>=0.4.5',
            koastVersion: '0.4.5'
          });
        } else {
          return $q.when({
            isCompatible: false,
            checkedVersion: '>=0.4.6',
            koastVersion: '0.4.5'
          });
        }

      };
      return service;
    });

  }));

  beforeEach(inject(function (_versionCheck_, _$log_) {
    versionCheck = _versionCheck_;
    $log = _$log_;
  }));

  it('should have an isCompatible set to true', function () {
    var errorSpy = sinon.spy($log, 'error');
    var infoSpy = sinon.spy($log, 'info');
    return versionCheck
      .isCompatible()
      .then(function (result) {
        expect(result.isCompatible).to.be.equal(true);
        infoSpy.should.have.been.called;
        errorSpy.should.not.have.been.called;
      });



  });

  it('should have an isCompatible set to false', function () {
    var errorSpy = sinon.spy($log, 'error');
    var infoSpy = sinon.spy($log, 'info');
    return versionCheck
      .isCompatible('>=0.4.6')
      .then(function (result) {
        expect(result.isCompatible).to.be.equal(false);
        infoSpy.should.not.have.been.called;
        errorSpy.should.have.been.called;
      });



  });
});
