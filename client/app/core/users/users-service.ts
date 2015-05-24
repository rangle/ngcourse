import {Inject, getServices} from 'utils/di';

class UsersService {
  services: any;
  byUserName: any;
  usersPromise: any;
  all: any;

  constructor(
    @Inject('koast') koast,
    @Inject('$log') $log
  ) {
    this.services = getServices(this.constructor, arguments);
    this.byUserName = {};
    this.loadUsers();
  }

  loadUsers () {
    this.usersPromise = this.services.koast.user.whenAuthenticated()
      .then(() => this.services.koast.queryForResources('users'))
      .then((userArray) => (
        this.all = userArray,
        userArray.forEach(
          (user) => user.username && (this.byUserName[user.username] = user)
        )
      ))
      .then(null, this.services.$log.error);
  }

  whenReady () {
    return this.usersPromise;
  }

  getUserByUsername (username) {
    return this.byUserName[username];
  }

  getUserDisplayName (username) {
    var user = this.getUserByUsername(username);
    if (!user) {
      return '';
    }

    return user.displayName;
  }
}
// UsersService.$inject = ['$log', 'koast'];

export {UsersService};
