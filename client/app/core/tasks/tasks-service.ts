import {Inject, getServices} from 'utils/di';

class TasksService {
  services: any;
  getTasks: any;
  addTask: any;
  updateTask: any;
  getTask: any;

  constructor( @Inject('koast') koast) {
    this.services = getServices(this.constructor, arguments);
    this.addMethods();
  }

  makeAuthenticatedMethod(functionToDelay) {
    return function () {
      let myArgs = arguments;
      return this.services.koast.user.whenAuthenticated()
        .then(() => functionToDelay.apply(this, myArgs));
    };
  }

  addMethods() {
    this.getTasks = this.makeAuthenticatedMethod(
      () => this.services.koast.queryForResources('tasks')
    );

    this.addTask = this.makeAuthenticatedMethod(
      (task) => this.services.koast.createResource('tasks', task)
    );

    this.updateTask = this.makeAuthenticatedMethod(
      (task) => task.save()
    );

    this.getTask = this.makeAuthenticatedMethod(
      (id) => this.services.koast.getResource('tasks', { _id: id})
    );
  }
}

export {TasksService};