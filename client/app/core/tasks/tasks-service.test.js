'use strict';

  var expect = chai.expect;
  // We can move expect definition to client/testing/test-utils.js

  describe('tasks service', function () {
    // Load the angular module. Having smaller modules helps here.
    beforeEach(module('ngcourse.tasks'));

    beforeEach(module(function($provide){
      // Mock 'server'.
      $provide.factory('server', function() {
        var service = {};
        var data = [{
          description: 'Mow the lawn'
        }];

        service.get = function () {
          return Q.when(data);
                 // $q.when();
                 // Promise.resolve();
          // or try this: Q.reject(new Error('Some Error'));
        };
        return service;
      });
      // Mock $q.
      $provide.service('$q', function() {
        return Q;
      });
    }));

    it('should get loaded', function() {
      // Inject the service.
      inject(function(tasks) {
        // Notice that the service is available inside the closure.
        // We can assert that the service has loaded by calling
        // getTasks().
        expect(tasks.getTasks()).to.not.be.undefined;
      });
    });
  });