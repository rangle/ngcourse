'use strict';

angular.module('ngcourse.main-ctrl', [
  'ngcourse.users',
  'ngcourse.auth'
])

.controller('MainCtrl', function ($log, auth, users) {
  var vm = this;
  vm.auth = auth;

  auth.whenAuthenticated()

  auth.whenAuthenticated()
    .then(function () {
      return users.whenReady();
    })
    .then(function () {
      vm.userDisplayName = users.getUserDisplayName(auth.username);
    })
    .then(null, $log.error);

  vm.login = function (form) {
    auth.login(form.username, form.password)
      .then(null, showLoginError);
  };
  vm.logout = function () {
    auth.logout()
      .then(null, $log.error);
  };

  function showLoginError(errorMessage) {
    vm.errorMessage = 'Login failed.';
    $log.error(errorMessage);
  }
});