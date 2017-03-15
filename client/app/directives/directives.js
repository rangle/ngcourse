angular.module('ngcourse.directives', [])
  .controller('directiveCtrl',
    function ($scope, tasks, $attrs, $element, $compile, $parse, $timeout) {
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
    });

    var wrapper = angular.element('<div></div>');

    for (var i=0; i < $attrs.repeat; i++) {
      wrapper.append($element[0].innerHTML);
    }

    var compiled = $compile(wrapper)($scope);
    $element.replaceWith(compiled);
  })

  .directive('ngcUser', function (tasks, $compile) {
    return {
      restrict: 'E',
      require: 'ngModel', // Require a dependency
      scope: {
        name: '=', // @, = , &,
        fireCustomEvent: '&onCustomEvent'
      }, // vs 'true', 'null'
      // transclude: true,
      templateUrl: '/app/directives/user.html',
      controller: 'directiveCtrl',
      controllerAs: 'dir',
      bindToController: true,
      // link: function (scope, element, attrs, ctrl) {
      //   scope.cost = 12;

      //   tasks.getTasks()
      //     .then(function(tasks) {
      //       scope.tasksLength = tasks.length;
      //     });

      //   scope.fireEvent = function () {
      //     console.log('Firing event from directive');
      //     scope.fireCustomEvent({
      //       str: "some string"
      //     });
      //   };

      //   var wrapper = angular.element('<div></div>');

      //   for (var i=0; i < attrs.repeat; i++) {
      //     wrapper.append(element[0].innerHTML);
      //   }

      //   var compiled = $compile(wrapper)(scope);
      //   element.replaceWith(compiled);
      // },
      // compile: function (element, attrs) {
      //   var wrapper = angular.element('<div></div>');

      //   for (var i=0; i < attrs.repeat; i++) {
      //     wrapper.append(element[0].innerHTML);
      //   }

      //   // The returned function here is the same as `link`
      //   return function (scope, element, attrs, ctrl) {
      //     var compiled = $compile(wrapper)(scope);
      //     element.replaceWith(compiled);
      //   }
      // }
    };
  })

  .filter('slice', function () {
    return function(input, start, finish) {
        return input.slice(start, finish);
    }
  });
