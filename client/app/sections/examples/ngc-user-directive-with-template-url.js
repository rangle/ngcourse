'use strict';

angular.module('ngcourse-example-directives')
  .controller('NgcUserDirectiveCtrl', function (users, $attrs) {
    var vm = this;
    vm.user = users.getUser(vm.username);

    vm.banUser = function() {
      ...
      vm.onBan({
        user: vm.user
      });
    }
  })

  .directive('ngcUser', function () {
    return {
      replace: true,
      restrict: 'E',
      scope: {
        username: '=',
        onBan: '&'
      },
      controller: 'NgcUserDirectiveCtrl',
      controllerAs:'ngcUserCtrl',
      bindToController: true,
      template: '<span>{{ user }}</span>'
    };
  });


<ngc-user username="parent.user" on-ban="parent.handleBan(user)"></ngc-user>