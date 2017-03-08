'use strict';

angular.module('ngcourse')

  .controller('MainCtrl', function ($state) {
    var vm = this;
    vm.login = function (username, password) {
      vm.isAuthenticated = true;
      vm.username = username;
      vm.password = password;
      $state.go('tasks');
    };
  });