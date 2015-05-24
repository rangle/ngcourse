declare var angular: any;

export function makeComponent(template, controller, options) {
  return function() {
    return angular.extend({
      restrict: 'E',
      scope: {},
      controllerAs: 'ctrl',
      bindToController: true,
      template: template,
      controller: controller
    }, options);
  };
}