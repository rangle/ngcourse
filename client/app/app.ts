'use strict';

import {TaskListCtrl} from 'sections/task-list/task-list-controller';
import {TaskEditCtrl} from 'sections/task-edit/task-edit-controller';
import {TaskAddCtrl} from 'sections/task-add/task-add-controller';
import {TasksService} from 'core/tasks/tasks-service';
import {UsersService} from 'core/users/users-service';
import {AuthenticatorComponent} from 'components/authenticator/authenticator-component';
import {configureRouter, RouterService} from 'core/router/router-service';
import {LoginFormComponent} from 'components/login-form/login-form-component';
declare var angular: any;

angular.module('ngcourse.router', ['ui.router'])
  .config(configureRouter)
  .service('router', RouterService);

angular.module('ngcourse.tasks', ['koast']).service('tasks', TasksService);
angular.module('ngcourse.users', ['koast']).service('users', UsersService);

angular.module('ngcourse', [
  'ngcourse.tasks',
  'ngcourse.users',
  'ngcourse.router',
  'koast'
  // ,
  // 'ngcourse-example-directives'
]);

angular.module('ngcourse')


.directive('ngcLoginForm', LoginFormComponent)

.controller('TaskListCtrl', TaskListCtrl)
.controller('TaskEditCtrl', TaskEditCtrl)
.controller('TaskAddCtrl', TaskAddCtrl)

.controller('LoginFormCtrl', function() { })
.directive('ngcAuthenticator', AuthenticatorComponent)

// .constant('API_BASE_URL', 'http://localhost:7000')
.constant('API_BASE_URL', 'http://ngcourse.herokuapp.com')

.run(function ($log, koast, API_BASE_URL) {
  $log.info('All ready!');

  koast.init({
    baseUrl: API_BASE_URL
  });
  koast.setApiUriPrefix('/api/v2/');
  koast.addEndpoint('tasks', ':_id', {
    useEnvelope: true
  });
  koast.addEndpoint('users', ':_id', {
    useEnvelope: true
  });
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['ngcourse']);
});