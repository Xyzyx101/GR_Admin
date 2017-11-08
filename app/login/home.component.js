(function() {
  'use strict';

  angular
  .module('login')
  .component('home', {
    templateUrl: 'login/home.template.html',
    controller : HomeController
  });

  HomeController.$inject = [];

  /* @ngInject */
  function HomeController() {
  }
})();
