'use strict';

angular.module('ngcourse')
  .controller('LoginFormCtrl', function () {
    // Let's do nothing for now.
  })
  .controller('MainCtrl', function ($log) {
    var vm = this;
    vm.isAuthenticated = false;
    vm.login = function (username, password) {
      vm.isAuthenticated = true;
      vm.username = username;
      vm.password = password;
    };
  });