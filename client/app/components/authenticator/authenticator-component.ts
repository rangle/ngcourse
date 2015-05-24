import {Inject, getServices} from 'utils/di';
import {makeComponent} from 'utils/component-maker';

let template = `
  <div>
    <ngc-login-form
      ng-hide="ctrl.user.isAuthenticated"
      on-submit="ctrl.login(data)"
      error-message="ctrl.errorMessage">
    </ngc-login-form>
    <div ng-show="ctrl.user.isAuthenticated">
      Hello, <span>{{ctrl.userDisplayName}}</span>!
      <button ng-click="ctrl.logout()">Logout</button>
      <hr>
      <ng-transclude></ng-transclude>
    </div>
`;

class AuthenticatorCtrl {
  services: any;
  user: any;
  userDisplayName: any;
  errorMessage: any;

  constructor(
    @Inject('$log') $log,
    @Inject('users') users,
    @Inject('koast') koast
  ) {
    this.services = {$log, users, koast};
    this.user = this.services.koast.user;
    this.services.koast.user.whenAuthenticated()
        .then(() => this.services.users.whenReady())
        .then(function() {
        this.userDisplayName = this.services.users.getUserDisplayName(
            this.services.koast.user.data.username);
        }.bind(this))
        .then(null, this.services.$log.error);
  }

  login(form) {
    console.log('form received:', form);
    this.services.koast.user.loginLocal(form)
      .then(null, this.showLoginError.bind(this));
  }

  logout() {
    this.services.koast.user.logout()
      .then(null, this.services.$log.error);
  }

  showLoginError(errorMessage) {
    this.errorMessage = 'Login failed.';
    this.services.$log.error(errorMessage);
  }
}

export var AuthenticatorComponent = makeComponent(
  template,
  AuthenticatorCtrl,
  {
    transclude: true
  }
);