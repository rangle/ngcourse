// create your angular module here
angular.module('ngcourse', [
  'ngcourse.tasks',
  'ngcourse.server',
  'ngcourse.router',
  'ngcourse.users'
])
  .run(function ($log) {
    $log.info('All ready!');
  });