'use strict';

describe('tasks service', function () {
  // Load the angular module. Having smaller modules helps here.
  beforeEach(module('ngcourse.tasks'));
  beforeEach(module(function($provide){
    // Mock 'server'.
    $provide.service('server', function() {
      var service = {};
      var data = [{
        owner: 'bob',
        description: 'Mow the lawn'
      }];

      service.get = function () {
        return Q.when(data);
        // or try this: Q.reject(new Error('Some Error'));
      };
      return service;
    });
    // Mock $q.
    $provide.service('$q', function() {
      return Q;
    });
  }));

  it('should get tasks', function() {
    // Setup a variable to store injected services.
    var injected = {};
    // Run inject() to inject service.
    inject(function (tasks) {
      injected.tasks = tasks;
    });
    // Write a test that returns a promise;
    return injected.tasks.getTasks()
    .then(function (tasks) {
      expect(tasks.length).to.equal(1);
      // We no longer need to call done()
    });
  });
});