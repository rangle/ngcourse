import {Inject, getServices} from 'utils/di';

export class TaskListCtrl {
  services: any;
  tasks: any;
  addTask: any;
  getUserDisplayName: any;
  constructor(
    @Inject('$log') $log,
    @Inject('tasks') tasks,
    @Inject('users') users,
    @Inject('router') router
  ) {
    this.services = getServices(this.constructor, arguments);
    this.tasks = [];
    this.addTask = this.services.router.goToAddTask.bind(this.services.router);
    this.getUserDisplayName = this.services.users.getUserDisplayName.bind(this.services.users);
    this.loadInitialTasks();
  }

  loadInitialTasks() {
    let tasks;
    this.services.tasks.getTasks()
      .then(newTasks => tasks = newTasks)
      .then(() => this.services.users.whenReady())
      .then(() => this.tasks = tasks)
      .then(null, this.services.$log.error);
  }

  // get addTask() { return this.services.router.goToAddTask; }
};
