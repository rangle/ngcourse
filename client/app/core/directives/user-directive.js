angular.module('ngcourse.directive', [])
  .directive('ngcUser', function () {
    return {
      scope: {
        username: '=username'
      },
      restrict: 'E', // vs 'A', 'AE'
      replace: true,
      scope: {}, // vs 'true', 'null'
      template: '<span>Hello {{username}}</span>'
    };
  }); 