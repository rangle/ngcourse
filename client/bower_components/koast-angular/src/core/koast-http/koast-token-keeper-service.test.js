/* jshint expr:true */
/* globals describe, it, inject, beforeEach, Q, expect */


'use strict';

describe('_koastTokenKeeper',function(){
  var _koastTokenKeeper;
  var $window;
  var tokenKey;
  var tokenValue;

  beforeEach(module('koast-http'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
  }));

  beforeEach(function(){
    inject(function($injector){
      _koastTokenKeeper = $injector.get('_koastTokenKeeper');
      $window = $injector.get('$window');
    });
    tokenKey = 'testKey';
    tokenValue = 'testValue';
    _koastTokenKeeper.setTokenKey(tokenKey);
  });

  it('should exist', function() {
    expect(_koastTokenKeeper).to.be.an('object');
    expect(_koastTokenKeeper.saveToken).to.be.a('function');
    expect(_koastTokenKeeper.setTokenKey).to.be.a('function');
    expect(_koastTokenKeeper.loadToken).to.be.a('function');
    expect(_koastTokenKeeper.clear).to.be.a('function');
  });

  it('should save a token', function() {
    _koastTokenKeeper.saveToken({token: tokenValue});
    expect($window.localStorage[tokenKey]).equals(tokenValue);
  });

  it('should load a token after it is saved', function() {
    _koastTokenKeeper.saveToken(tokenValue);  //Using alternate API on purpose.
    expect($window.localStorage[tokenKey]).equals(tokenValue);
    var loadedValue = _koastTokenKeeper.loadToken(tokenKey);
    expect(loadedValue).equals(tokenValue);
  });

  it('should clear a token', function () {
    _koastTokenKeeper.saveToken(tokenValue);
    _koastTokenKeeper.clear(tokenKey);
    var loadedValue = _koastTokenKeeper.loadToken(tokenKey);
    expect($window.localStorage[tokenKey]).to.be.undefined();
    expect(loadedValue).to.be.null();
  });
});