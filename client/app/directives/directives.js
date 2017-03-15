angular.module('ngcourse.directives', [])
  .controller('directiveCtrl', function ($scope, tasks, $attrs, $parse, $element, $timeout) {
    var vm = this;

    vm.fireEvent = function () {
      console.log('Firing event from directive');
      vm.fireCustomEvent({
        str: "some string"
      });
    };


    var getCost = $parse($attrs.cost);
    vm.cost = getCost({
      hours: 3,
      rate: 4
    })
  })

  .directive('ngcUser', function (tasks, $compile) {
    return {
      restrict: 'E', // vs 'A', 'AE'
      replace: true,
      scope: {
        name: '=', // = , &,
        fireCustomEvent: '&onCustomEvent'
      }, // vs 'true', 'null'
      transclude: true,
      templateUrl: '/app/directives/user.html',
      // controller: 'directiveCtrl',
      // controllerAs: 'dir',
      // bindToController: true,
      link: function (scope, element, attrs) {
        scope.cost = 12;

        tasks.getTasks()
          .then(function(tasks) {
            scope.tasksLength = tasks.length;
          });
      },
      compile: function (element, attrs) {
        var wrapper = angular.element('<div></div>');

        for (var i=0; i < attrs.repeat; i++) {
          wrapper.append(element.clone());
        }

        return function (scope) {
          var compiled = $compile(wrapper)(scope);
          element.replaceWith(compiled);
        }
      }
    };
  });
