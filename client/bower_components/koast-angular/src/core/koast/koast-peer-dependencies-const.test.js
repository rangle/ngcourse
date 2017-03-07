/* jshint expr:true */
/* globals describe, it, inject, beforeEach, Q, expect */


'use strict';

describe('koast',function(){
  beforeEach(module('koast'));

  var peerDependencies;
  beforeEach(function(){
    inject(function($injector){
      peerDependencies = $injector.get('peerDependencies');
    });
  });

  it('should exist', function() {
    expect(peerDependencies).to.be.an('object');
    expect(peerDependencies.koast).to.be.a('string');
  });

});