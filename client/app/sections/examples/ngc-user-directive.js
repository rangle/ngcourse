'use strict';

angular.module('ngcourse-example-directives')

.directive('ngcUser', function (users, tasks) {
  return {
    restrict: 'E',
    scope: {
      userDisplayName: '='
    },
    template: '<span>{{ user.displayName }} ({{ tasks.length }})</span>',
    link: function(scope) {
      users.getUsers()
      .then(function() {
        scope.user = users.getUser(scope.userDisplayName);
        tasks.getMyTasks(scope.user)
        .then(function(tasks) {
          scope.tasks = tasks;
        })
      });
    }
  };
});