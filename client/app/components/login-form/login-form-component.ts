import {Inject} from 'utils/di';
import {makeComponent} from 'utils/component-maker';

let template = `
<form
  class="login"
  name = "loginFormCtrl.form"
  novalidate
  >
  Enter username:
  <input
    ng-model="ctrl.username"
    name="username"
    ng-pattern="/^[a-z]+$/"
    required> <br>
  Password:
  <input
    type="password"
    ng-model="ctrl.password"
    name="password"
    required > <br>

  <div ng-show="ctrl.errorMessage" > {{ ctrl.errorMessage }}</div>
  <button
    id="login-button"
    ng-click="ctrl.submit()"
    ng-disabled="loginFormCtrl.form.$invalid"
    >
      Login
  </button>
</form>
`

class LoginFormController {
  errorMessage: any;
  username: any;
  password: any;
  fireSubmit: Function;
  $scope: any;
  constructor(@Inject('$scope') $scope) {
    this.$scope = $scope;
  }
  submit() {
    console.log('SUBMITTED', this.$scope);
    var form = {
      data: this
    };
    console.log('form sent:', form);
    this.fireSubmit(form);
  }
}

export var LoginFormComponent = makeComponent(
  template,
  LoginFormController,
  {
    scope: {
      errorMessage: '=',
      fireSubmit: '&onSubmit'
    }
  }
);
