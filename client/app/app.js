'use strict';

angular.module('ngcourse', [
  'ngcourse.tasks',
  'ngcourse.router',
  'ngcourse-example-directives',
  'ngcourse.users'
])

.constant('API_BASE_URL', 'http://localhost:3000');