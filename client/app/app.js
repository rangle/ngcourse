'use strict';

angular.module('ngcourse', [
  'ngcourse.tasks',
  'ngcourse.server',
  'ngcourse.router',
  'ngcourse.users',
  'ngcourse-example-directives'
])
.run(function ($log) {
  $log.info('Ready to go.');
});