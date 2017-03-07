/* jshint expr:true */
/* globals describe, it, chai, console, inject, xit,before,beforeEach,angular,sinon,$window,Q */

'use strict';
var expect = chai.expect;

function testMakeRequestUrl(baseUrl) {



  beforeEach(angular.mock.module('koast-user'));
  beforeEach(module(function ($provide) {

    $provide.service('$location', function () {
      var service = {};
      service.absUrl = function () {
        return baseUrl;
      };
      return service;
    });
  }));


  describe('_koastOauth', function () {
    testMakeRequestUrl('http://example.com');
  });

  describe('_koastOauth', function () {
    // This tests the baseUrl logic
    testMakeRequestUrl('http://example.com/foo/booo/1234');
  });



  xit('should make a request url', function () {

    inject(function (_koastOauth) {
      expect(_koastOauth.makeRequestURL()).to.not.be.undefined;
      expect(_koastOauth.makeRequestURL('car')).to.equal(
        'http://example.com/car');
      expect(_koastOauth.makeRequestURL('/car')).to.equal(
        'http://example.com//car');
      expect(_koastOauth.makeRequestURL('')).to.equal(
        'http://example.com/');
      expect(_koastOauth.makeRequestURL()).to.equal(
        'http://example.com/');
      expect(_koastOauth.makeRequestURL('false')).to.equal(
        'http://example.com/false');
      expect(_koastOauth.makeRequestURL(null)).to.equal(
        'http://example.com/');
      expect(_koastOauth.makeRequestURL(false)).to.equal(
        'http://example.com/');

      var anotherServer = 'http://anotherserver.ca';
      _koastOauth.setBaseUrl(anotherServer);
      expect(_koastOauth.makeRequestURL(false)).to.equal(
        anotherServer);
      expect(_koastOauth.makeRequestURL('/car')).to.equal(
        anotherServer + '/car');
      expect(_koastOauth.makeRequestURL('//car')).to.equal(
        anotherServer + '//car');

    });
  });
}


describe('_koastOauth', function () {
  function localStorageMock() {
    var keys = {};

    return {
      setItem: function (key, value) {
        keys[key] = value || '';
      },
      getItem: function (key) {
        return keys[key];
      },
      removeItem: function (key) {
        delete keys[key];
      },
      get length() {
        return Object.keys(keys).length;
      },
      key: function (i) {
        var aKeys = Object.keys(keys);
        return aKeys[i] || null;
      }
    };
  }
  var baseUrl = 'http://example.com/foo/bar';

  beforeEach(angular.mock.module('koast-user'));
  beforeEach(module(function ($provide) {

    $provide.service('$location', function () {
      var service = {};
      service.absUrl = function () {
        return baseUrl;
      };
      return service;
    });

    $provide.service('$window', function () {
      var service = {};
      service.location = {
        replace: sinon.spy()
      };
      /*jshint -W055 */
      service.localStorage = new localStorageMock();
      return service;
    });
  }));



  it('should initiate authentication', function () {
    inject(function (_koastOauth, $window) {
      var someProvider = 'facebook';

      _koastOauth.initiateAuthentication(someProvider);
      $window.location.replace.should.have.been.calledOnce;
      $window.location.replace.should.have
        .been.calledWith('http://example.com/auth/' + someProvider +
          '?next=' + encodeURIComponent(baseUrl));
    });
  });
});


describe('_koastUser', function () {

  beforeEach(angular.mock.module('koast-user'));

  beforeEach(module(function ($provide) {
    $provide.service('$http', function () {
      var service = {};
      var response = {
        data: {
          data: {
            username: 'someUsername'
          },
          meta: {
            token: 'asdfasdfasd'
          },
          isAuthenticated: true
        }
      };

      service.post = sinon.spy(function () {
        return Q.when(response);
      });
      return service;
    });
  }));

  it('should login a user using local strategy', function (done) {
    inject(function (_koastUser, $http) {

      _koastUser.loginLocal({
          username: 'someUsername',
          password: 'somePassword'
        })
        .then(function (res) {
          expect(res).to.be.true;
          $http.post.should.have.been.calledOnce;
          done();
        })
        .then(null, done);
    });
  });
});
