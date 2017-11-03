(function() {
  'use strict';

  angular
  .module('grAdminTool')
  .config(RouteConfigure);

  RouteConfigure.$inject = ['$locationProvider', '$routeProvider'];

  /* @ngInject */
  function RouteConfigure($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider
    .when('/login', {
      template: '<login></login>'
    })
    .when('/project/:projectId', {
      template: '<project></project>'
    })
    .otherwise('/login');
  }
})();
