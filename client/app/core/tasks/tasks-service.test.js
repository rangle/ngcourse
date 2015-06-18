'use strict';

describe('tasks service', function () {
  // Load the angular module. Having smaller modules helps here.
  beforeEach(module('ngcourse.tasks'));
  beforeEach(module(function($provide) {
    // Mock 'server'.
    $provide.service('server', function() {
      var service = {};
      var data = [{
        description: 'Mow the lawn'
      }];

      service.get = sinon.spy(function () {
        return Q.when(data);
      });

      return service;
    });
    // Mock $q.
    $provide.service('$q', function() {
      return Q;
    });
  }));

   it('should get tasks', function() {
    // Run inject() to inject service.
    var tasks = getService('tasks');
    var server = getService('server');
    // Write a test that returns a promise;
    return tasks.getTasks()
      .then(function (tasks) {
        expect(tasks.length).to.equal(1);
        server.get.should.have.been.calledOnce; // Check the number of calls.
      });
  });
});