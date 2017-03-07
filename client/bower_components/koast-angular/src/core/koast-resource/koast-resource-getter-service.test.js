/* jshint expr:true */
/* globals describe, it, inject, beforeEach, Q, expect */


'use strict';

describe('_koastResourceGetter',function(){
  beforeEach(module('koast-resource'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
  }));

  var _koastResourceGetter;
  beforeEach(function(){
    inject(function($injector){
      _koastResourceGetter = $injector.get('_koastResourceGetter');
    });
  });

  it('should exist', function() {
    expect(_koastResourceGetter).to.be.an('object');
    expect(_koastResourceGetter.setApiUriPrefix).to.be.a('function');
    expect(_koastResourceGetter.getResource).to.be.a('function');
    expect(_koastResourceGetter.createResource).to.be.a('function');
    expect(_koastResourceGetter.queryForResources).to.be.a('function');
    expect(_koastResourceGetter.addEndpoint).to.be.a('function');
    expect(_koastResourceGetter.init).to.be.a('function');
  });

  //TODO: write tests for methods

});