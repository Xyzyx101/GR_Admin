(function() {
  'use strict';

  angular
  .module('login')
  .component('login', {
    templateUrl: 'login/login.template.html',
    controller: LoginController,
  });

  LoginController.$inject = ['$rootScope','$scope', 'GRFirebase', '$log'];

  /* @ngInject */
  function LoginController($rootScope, $scope, GRFirebase, $log) {
    $scope.error = '';
    $scope.loginData = {email: '', password: ''};
    $scope.Login = function login() {
      GRFirebase.Auth().$signInWithEmailAndPassword($scope.loginData.email, $scope.loginData.password).catch(function(error) {
        $scope.error = error.message;
        $scope.user = $rootScope.user;
      });
    }
    GRFirebase.Auth().$onAuthStateChanged(function(firebaseUser) {
      $scope.user = $rootScope.user;
    });
  }
})();
