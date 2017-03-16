'use strict';

angular.module('ngcourse')
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
        });
    };
  });