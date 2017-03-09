describe('TaskAddCtrl', function () {
  beforeEach(module('ngcourse'));

  var taskAddController;
  var mockTasks;
  var mockRouter;

  beforeEach(inject(function ($controller, $log) {
    mockTasks = {
      addTask: sinon.spy(function () {
        return Q.when();
      })
    };

    mockRouter = {
      goToTaskList: sinon.spy()
    };

    taskAddController = $controller('TaskAddCtrl', {
      $log: $log,
      tasks: mockTasks,
      router: mockRouter
    });
  }));

  it('cancel sends you back to the task list', function () {
    taskAddController.cancel();
    mockRouter.goToTaskList.should.have.been.calledOnce;
  });

  it('save adds a task and takes you back to the task list', function () {
    var newTask = {
      owner: 'bob',
      description: 'a new task'
    };

    return taskAddController.save(newTask)
      .then(function () {
        mockTasks.addTask.should.have.been.calledOnce;
        mockRouter.goToTaskList.should.have.been.calledOnce;
      });
  })
});