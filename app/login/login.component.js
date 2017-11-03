(function() {
  'use strict';

  angular
  .module('login')
  .component('login', {
    templateUrl: 'login/login.template.html',
    controller: LoginController,
  });

  LoginController.$inject = [];

  /* @ngInject */
  function LoginController() {

  }
})();
