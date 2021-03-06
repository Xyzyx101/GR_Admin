(function() {
    'use strict';

    angular
        .module('grAdminTool', [
          'ngRoute',
          'ngAnimate',
          'ngMaterial',
          'grAdminTool.version',
          'login',
          'sideNav',
          'project',
          'grFirebase',
          'admin'
        ])
        .config(MaterialTheme);

        MaterialTheme.$inject = ['$mdThemingProvider'];

        /* @ngInject */
        function MaterialTheme($mdThemingProvider) {
          $mdThemingProvider.theme('default')
          .primaryPalette('blue-grey')
          .accentPalette('blue-grey')
          .warnPalette('deep-orange')
          .backgroundPalette('grey');
        }
})();
