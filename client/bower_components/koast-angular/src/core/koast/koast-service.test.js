/* jshint expr:true */
/* globals describe, it, inject, beforeEach, Q, expect */


'use strict';

describe('koast',function() {
  beforeEach(module('koast'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
  }));

  var koast;
  beforeEach(function() {
    inject(function($injector) {
      koast = $injector.get('koast');
    });
  });

  it('should exist', function() {
    expect(koast).to.be.an('object');
    expect(koast.init).to.be.a('function');
    expect(koast.user).to.be.an('object');
  });

  it('should have methods', function() {
    expect(koast.setApiUriPrefix).to.be.a('function');
    expect(koast.getResource).to.be.a('function');
    expect(koast.createResource).to.be.a('function');
    expect(koast.queryForResources).to.be.a('function');
    expect(koast.addEndpoint).to.be.a('function');
  });

//TODO: write tests for init()




});