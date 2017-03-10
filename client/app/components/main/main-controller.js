'use strict';

angular.module('ngcourse')
  .controller('LoginFormCtrl', function () {
    // Let's do nothing for now.
  })
  .controller('MainCtrl', function ($log, $state) {
    var vm = this;
    vm.isAuthenticated = false;
    vm.login = function (username, password) {
      // Your logic to authenticate the user
      vm.isAuthenticated = true;
      vm.username = username;
      vm.password = password;
      $state.go('tasks');
    };
  });