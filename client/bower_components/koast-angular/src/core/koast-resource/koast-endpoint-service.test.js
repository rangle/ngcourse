/* jshint expr:true */
/* globals describe, it, inject, beforeEach, Q, expect */


'use strict';

describe('_KoastEndpoint',function(){
  beforeEach(module('koast-resource'));
  var prefix;
  var handle;
  var template;
  var options;
  var endpoint;

  beforeEach(module(function ($provide) {
    $provide.service('$q', function() {return Q;});
  }));

  var _KoastEndpoint;
  beforeEach(function(){
    inject(function($injector){
      _KoastEndpoint = $injector.get('_KoastEndpoint');
    });
    prefix = 'userdata';
    handle = ':_id';
    template = '/userdata';
    options = {useEnvelope: true};
    /*jshint -W055 */
    endpoint = new _KoastEndpoint(prefix,handle,template,options);
  });

  it('should exist', function() {
    expect(_KoastEndpoint).to.be.a('function');
    expect(_KoastEndpoint.prototype.makePostUrl).to.be.a('function');
    expect(_KoastEndpoint.prototype.makeGetUrl).to.be.a('function');
  });

  //TODO: write tests for methods
  it('should return an object with properties', function(){

    expect(endpoint).to.be.an('Object');
    expect(endpoint.prefix).to.equal(prefix);
    expect(endpoint.handle).to.equal(handle);
    expect(endpoint.template).to.equal(template);
    expect(endpoint.options).to.deep.equal(options);
  });

  it('should make and return a POST url', function(){
    expect(endpoint.makePostUrl()).to.be.ok;
  });

   it('should make and return a GET url', function(){
    expect(endpoint.makeGetUrl(this)).to.be.ok;
    expect(endpoint.makeGetUrl()).to.be.ok;

  });

});
