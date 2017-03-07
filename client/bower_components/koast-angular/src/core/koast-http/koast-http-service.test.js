/* jshint expr:true */
/* globals describe, it, inject, beforeEach, Q, expect */


'use strict';

describe('_koastTokenKeeper',function(){
  beforeEach(module('koast-http'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
  }));

  var _koastHttp;
  beforeEach(function(){
    inject(function($injector){
      _koastHttp = $injector.get('_koastHttp');
    });
  });

  it('should exist', function() {
    expect(_koastHttp).to.be.an('object');
    expect(_koastHttp.setOptions).to.be.a('function');
    expect(_koastHttp.saveToken).to.be.a('function');
    expect(_koastHttp.deleteToken).to.be.a('function');
    expect(_koastHttp.post).to.be.a('function');
    expect(_koastHttp.put).to.be.a('function');
    expect(_koastHttp.get).to.be.a('function');
  });

  //TODO: write tests for _koastTokenKeeper methods

});