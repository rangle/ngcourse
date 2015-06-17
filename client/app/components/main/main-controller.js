'use strict';

  angular.module('ngcourse')

  .controller('MainCtrl', function($log) {
    var vm = this;
    vm.isAuthenticated = false;

    vm.login = function(username, password) {
      vm.isAuthenticated = true;
      vm.username = username;
      vm.password = password;
    };
  });