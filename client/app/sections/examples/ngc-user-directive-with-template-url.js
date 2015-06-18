'use strict';

angular.module('ngcourse-example-directives')

.directive('ngcUserWithTemplateUrl', function () {
  return {
    restrict: 'E',
    scope: {
      userDisplayName: '='
    },
    templateUrl: 'app/sections/examples/ngc-user-directive-with-template-url.html'
  };
});