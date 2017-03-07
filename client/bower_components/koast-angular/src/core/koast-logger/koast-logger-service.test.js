/* jshint expr:true */
/* globals describe, it, inject, beforeEach, Q, expect */


'use strict';

describe('_koastLogger',function(){
  var loggedMessages;
  var msg;
  beforeEach(module('koast-logger'));

  beforeEach(module(function ($provide) {
     loggedMessages = [];
     msg = 'mesage';
    $provide.service('$q', function() {return Q;});
    $provide.service('$window', function(){
      return{
         console:{
          log:function(msg){
            loggedMessages.push(msg);
          }
         }

      };

    });
  }));

  var _koastLogger;
  beforeEach(function(){
    inject(function($injector){
      _koastLogger = $injector.get('_koastLogger');
    });
  });

  it('should exist', function() {
    expect(_koastLogger).to.be.an('object');
    expect(_koastLogger.setLogLevel).to.be.a('function');
    expect(_koastLogger.makeLogger).to.be.a('function');
  });

  it('should accept a number', function() {
    expect(_koastLogger.makeLogger(1)).to.be.ok;

  });

  it('should accept special types', function() {
    expect(_koastLogger.makeLogger(null)).to.be.ok;
    expect(_koastLogger.makeLogger()).to.be.ok;

  });


  it('should return an object', function() {
     expect(_koastLogger.makeLogger()).to.be.a('object');
  });

  it('should return an object that has methods', function() {

    var result = _koastLogger.makeLogger();

    expect(result.debug).to.be.a('function');
    expect(result.verbose).to.be.a('function');
    expect(result.info).to.be.a('function');
    expect(result.warn).to.be.a('function');
    expect(result.error).to.be.a('function');

  });



  it('should not log if the logLevel is less than the default log level',function(){

    var result = _koastLogger.makeLogger('koast.http');

    result.debug(msg);
    result.verbose(msg);

    expect(loggedMessages.length).to.equal(0);

  });

  it('should log if the logLevel is greater than or equal to the default log level',function(){

    var result = _koastLogger.makeLogger('koast.http');

    result.info(msg);
    result.warn(msg);
    result.error(msg);

    expect(loggedMessages.length).to.equal(3);

  });

  it('should let you change the log level to a number below default log level', function(){

    var result = _koastLogger.makeLogger('koast.http');
    _koastLogger.setLogLevel(1);

    result.debug(msg);
    result.verbose(msg);
    result.info(msg);
    result.warn(msg);
    result.error(msg);

    expect(loggedMessages.length).to.equal(5);

  });

  it('should let you change the log level to a number below default log level', function(){

    var result = _koastLogger.makeLogger('koast.http');
    _koastLogger.setLogLevel(4);

    result.debug(msg);
    result.verbose(msg);
    result.info(msg);
    result.warn(msg);
    result.error(msg);

    expect(loggedMessages.length).to.equal(2);

  });

});