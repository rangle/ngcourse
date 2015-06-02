'use strict';

angular.module('ngcourse')

.controller('MainCtrl', function($log) {
  var vm = this;

  vm.isAuthenticated = false;
  vm.login = function() {
    vm.isAuthenticated = true;
  };
});