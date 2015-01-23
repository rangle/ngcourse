'use strict';

angular.module('ngcourse.main-ctrl', [
  'ngcourse.users',
  'koast'
])

<<<<<<< HEAD
.controller('MainCtrl', function ($log, koast, users) {
  var vm = this;
  vm.user = koast.user;

  koast.user.whenAuthenticated()
    .then(function() {
      return users.whenReady()
    })
    .then(function() {
      vm.userDisplayName = users.getUserDisplayName(koast.user.data.username);
    })
    .then(null, $log.error);

  vm.login = function (form) {
    koast.user.loginLocal(form)
      .then(null, $log.error);
  };
  vm.logout = function () {
    koast.user.logout()
      .then(null, $log.error);
  };
});
=======
.controller('MainCtrl', function() {
        var scope = this;
        scope.isAuthenticated = false;

        scope.login = function(username, password) {
            scope.isAuthenticated = true;
            scope.username = username;
        }
    });

>>>>>>> FETCH_HEAD
