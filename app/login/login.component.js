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
    var self = this;
    this.error = '';
    this.email = '';
    this.password = '';

  this.Login = function() {
      Auth.Login(this.email, this.password)
      .then(function(user){
        if(user!=null) {
            $location.path('/home');
        }
      }).catch(function(err){
        self.error = err.message;
      });
    };
    $scope.$on("Auth:StateChanged", function() {
      var user = Auth.User();
      if(user !== null) {
        $location.path('/home');
      }
    });
  }
})();
