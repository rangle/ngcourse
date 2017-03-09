describe('tasks service', function () {
  // Load the angular module. Having smaller modules helps here.
  beforeEach(module('ngcourse.tasks'));
  beforeEach(module(function ($provide) {
    // Mock 'server'.
    $provide.service('server', function () {
      var service = {};
      var data = [{
        owner: 'bob',
        description: 'Mow the lawn'
      }];

      service.get = function () {
        return Q.when(data);
        // or try this: Q.reject(new Error('Some Error'));
      };

      service.post = function (path, task) {
        if ( task === null || (task.owner === '' || task.description === '')) {
          return Q.reject(task);
        }
        else {
          return Q.when(task);
        }
      };

      return service;
    });
    // Mock $q.
    $provide.service('$q', function () {
      return Q;
    });
  }));

  it('should get tasks', function () {
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

  it('should add a new task', function () {
    var injected = {};
    inject(function (tasks) {
      injected.tasks = tasks;
    });

    var newTask = {
      owner: 'Alice',
      description: 'A newly-created task.'
    };

    return injected.tasks.createTask(newTask)
      .then(function (task) {
        expect(task.owner).to.equal('Alice');
        // We no longer need to call done()
      });
  });

  it('should fail if task is null', function () {
    var injected = {};
    inject(function (tasks) {
      injected.tasks = tasks;
    });

    return injected.tasks.createTask(null)
      .then(function onSuccess(task) {
        expect(task).to.be(null);
      }, function onError(task){
        expect(task).to.be.null;
      })
  });

  it('should fail if owner is empty', function () {
    var injected = {};
    inject(function (tasks) {
      injected.tasks = tasks;
    });

    var newTask = {
      owner: '',
      description: 'A newly-created task.'
    };

    return injected.tasks.createTask(newTask)
      .then(function onSuccess(task) {
        expect(task).to.be(null);
      }, function onError(task){
        expect(task.owner).to.be.empty;
      })
  });
});