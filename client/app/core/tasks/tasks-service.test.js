'use strict';

var expect = chai.expect;
// We can move expect definition to client/testing/test-utils.js

describe('tasks service', function () {

  // Load the angular module. Having smaller modules helps here.
  beforeEach(module('ngcourse.tasks'));

  beforeEach(module(function($provide){
    // Mock 'server'.
    $provide.service('server', function() {
      var service = {};
      var data = [{
        description: 'Mow the lawn'
      }];

      service.get = sinon.spy(function () {
        return Q.when(data);
        // or try this: Q.reject(new Error('Some Error'));
      });
      return service;
    });
    // Mock $q.
    $provide.service('$q', function() {
      return Q;
    });
  }));

  it('should get tasks', function() {
    var tasks = getService('tasks');
    // Write a test that returns a promise;
    return tasks.getTasks()
      .then(function (tasks) {
        expect(tasks.length).to.equal(1);
        // We no longer need to call done()
      });
  });

  it('should only call server.get once', function() {
     var tasks = getService('tasks');
     var server = getService('server');
     server.get.reset(); // Reset the spy.
     return tasks.getTasks() // Call getTasks the first time.
       .then(function () {
         server.get.should.have.been.calledOnce; // Check the number of calls.
       });
   });

});