describe('tasks service', function () {

  beforeEach(module('ngcourse.tasks'));
  beforeEach(module(function ($provide) {
    $provide.service('server', function () {
      var service = {};
      var data = [{
        description: 'Mow the lawn'
      }];

      service.get = sinon.spy(function () {
        return Q.when(data);
      });
      return service;
    });
  }))

  it('should only call server.get once', function () {
    var tasks = getService('tasks');
    var server = getService('server');
    server.get.reset(); // Reset the spy.
    return tasks.getTasks() // Call getTasks the first time.
      .then(function () {
        return tasks.getTasks(); // Call it again.
      })
      .then(function () {
        server.get.should.have.been.calledOnce; // Check the number of calls.
      });
  });
});