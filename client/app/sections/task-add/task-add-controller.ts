import {Inject, getServices} from 'utils/di';

export class TaskAddCtrl {
  services: any;
  cancel: any;
  constructor(
    @Inject('$log') $log,
    @Inject('router') router,
    @Inject('tasks') tasks
  ) {
    this.services = getServices(this.constructor, arguments);
    this.cancel = this.services.router.goToTaskList.bind(this.services.router);
  }

  save(task) {
    return this.services.tasks.addTask(task)
      .then(() => this.services.router.goToTaskList())
      .then(null, this.services.$log.error);
  };
};