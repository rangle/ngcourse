'use strict';

angular.module('ngcourse', [
  'ngcourse.main-ctrl',
  'ngcourse.tasks',
  'ngcourse.users',
  'ngcourse.router',
  'ngcourse.auth',
  'ngcourse-example-directives'
])

.constant('API_BASE_URL', 'http://localhost:3000');