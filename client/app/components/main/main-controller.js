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

    // Fun with directives
    vm.name = 'Philip Da Silva';

    vm.types = {
      foo: 'foo',
      bar: 'bar',
      baz: 'baz',
    };

    vm.friends = [
      {name:'John', sub: { foo: 'asd' }, phone:'555-1276'},
      {name:'Mary', sub: { foo: 'fgdf' }, phone:'800-BIG-MARY'},
      {name:'Mike', sub: { foo: 'wer' }, phone:'555-BIG-MIKE'},
      {name:'Adam', sub: { foo: 'mlk' }, phone:'555-5678'},
      {name:'Julie', sub: { foo: 'jioj' }, phone:'555-ADAM'},
      {name:'Juliette', sub: { foo: 'nkljoi' }, phone:'555-5678'}
    ];

    vm.toggle = function () {
      $scope.isVisible = !$scope.isVisible;
    };

    vm.setType = function (type) {
      vm.type = type;
    };

    vm.handleCustomEvent = function (str) {
      console.log('Caught custom event and: ', str);
    };
  });