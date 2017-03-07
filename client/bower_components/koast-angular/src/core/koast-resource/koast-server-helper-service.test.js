/* jshint expr:true */
/* globals describe, it, chai, console, inject, xit,before,beforeEach,angular,sinon,$window,Q, expect */


'use strict';

describe('_KoastServerHelper',function(){
  beforeEach(module('koast-resource'));

  var _KoastServerHelper;
  beforeEach(function(){
    inject(function($injector){
      _KoastServerHelper = $injector.get('_KoastServerHelper');
    });
  });

  it('should exist', function() {
    expect(_KoastServerHelper).to.be.an('object');
    expect(_KoastServerHelper.addAuthHeaders).to.be.a('function');
  });

  //TODO: write tests for addAuthHeaders()

});