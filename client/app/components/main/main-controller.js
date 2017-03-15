'use strict';

angular.module('ngcourse')
  .controller('MainCtrl', function($log) {
    var vm = this;

    vm.isAuthenticated = false;

    vm.name = 'Bob';

    vm.login = function(username, password) {
      vm.isAuthenticated = true;
      vm.username = username;
      vm.password = password;
    };

    vm.handleCustomEvent = function (str) {
      console.log('Caught custom event and: ', str);
    }
  });