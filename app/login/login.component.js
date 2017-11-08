(function() {
  'use strict';

  angular
  .module('login')
  .component('login', {
    templateUrl: 'login/login.template.html',
    controller: LoginController,
  });

  LoginController.$inject = ['$scope','$location', 'Auth'];

  /* @ngInject */
  function LoginController($scope, $location, Auth) {
    $scope.error = '';
    $scope.email = '';
    $scope.password = '';

    $scope.Login = function() {
      Auth.Login($scope.email, $scope.password);
    };
    $scope.$on("Auth:StateChanged", function() {
      $scope.user = Auth.User();
      if($scope.user.authenticated) {
          $location.path('/home');
      }
    });
    $scope.$on("Auth:Error", function(error) {
      $scope.error = Auth.AuthError();
    });
  }
})();
