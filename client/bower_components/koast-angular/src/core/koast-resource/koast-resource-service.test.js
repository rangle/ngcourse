/* jshint expr:true */
/* globals describe, it, inject, beforeEach, Q, expect */


'use strict';

describe('_KoastResource',function(){
  beforeEach(module('koast-resource'));

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
  }));

  var _KoastResource;
  beforeEach(function(){
    inject(function($injector){
      _KoastResource = $injector.get('_KoastResource');
    });
  });

  it('should exist', function() {
    expect(_KoastResource).to.be.a('function');
    expect(_KoastResource.prototype.save).to.be.a('function');
    expect(_KoastResource.prototype.delete).to.be.a('function');
  });

  //TODO: write tests construstor and methods

});