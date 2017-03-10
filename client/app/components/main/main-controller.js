'use strict';

angular.module('ngcourse')
  .controller('LoginFormCtrl', function () {
    // Let's do nothing for now.
  })
  .controller('MainCtrl', function ($log, users, $state) {
    var vm = this;
    vm.isAuthenticated = false;
    vm.login = function (username, password) {
      users.login(username, password)
        .then(function () {
          vm.loginError = null;
          $state.go('tasks');
        })
        .catch(function (err) {
          vm.loginError = err;
        })
    }
  });