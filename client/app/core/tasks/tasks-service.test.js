'use strict';

describe('tasks service', function () {
  // Load the angular module. Having smaller modules helps here.
  beforeEach(module('ngcourse.tasks'));
  beforeEach(module(function($provide){
    // Mock 'server'.
    $provide.service('server', function() {
      var service = {};
      var data = [{
        owner: 'alice',
        description: 'Mow the lawn'
      }, {
        owner: 'bob',
        description: 'Wash the dishes'
      }, {
        owner: 'alice',
        description: 'Fix the bugs'
      }];

      service.get = function () {
        return Q.when(data);
        // or try this: Q.reject(new Error('Some Error'));
      };

      service.post = sinon.spy(function (url, _data) {
        return Q.when({
          owner: 'Alice',
          description: 'A newly-created task.'
        });
      });

      return service;
    });
    // Mock 'users'.
    $provide.service('users', function() {
      var service = {};

      service.getUsers = function() {
        return Q.when([{
          username: 'alice',
          displayName: 'Alice Beeblebrox'
        }, {
          username: 'bob',
          displayName: 'Bob Beeblebrox'
        }, {
          username: 'diane',
          displayName: 'Diane Dent'
        }]);
      };

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
      expect(tasks.length).to.equal(3);
      // We no longer need to call done()
    });
  });

  it('should create a new task', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    var users = getService('users');
    server.post.reset();

    var newTask = {
      owner: 'alice',
      description: 'A newly-created task.'
    };

    return tasks.createTask(newTask)
    .then(function (task) {
      server.post.should.have.been.calledOnce;
      server.post.should.have.been.calledWith('/api/v1/tasks', newTask);
    });

  });

  it('should not create a new task if null param supplied', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    var users = getService('users');
    server.post.reset();

    var createTaskPromise = tasks.createTask(null)
    .then(function (task) {
      server.post.should.have.been.calledOnce;
    });

    return createTaskPromise.should.be.rejected;

  });

  it('should not create a new task if owner field is missing', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    var users = getService('users');
    server.post.reset();

    var createTaskPromise = tasks.createTask({
      description: 'do something'
    })
    .then(function (task) {
      server.post.should.have.been.calledOnce;
    });

    return createTaskPromise.should.be.rejected;

  });

  it('should not create a new task if description field is missing', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    var users = getService('users');
    server.post.reset();

    var createTaskPromise = tasks.createTask({
      owner: 'alice'
    })
    .then(function (task) {
      server.post.should.have.been.calledOnce;
    });

    return createTaskPromise.should.be.rejected;

  });

  it('should not create if owner is invalid', function() {
    var tasks = getService('tasks');
    var server = getService('server');
    var users = getService('users');

    var createTaskPromise = tasks.createTask({
      owner: 'john',
      description: 'A newly-created task.'
    });

    return createTaskPromise.should.be.rejected;

  });

});