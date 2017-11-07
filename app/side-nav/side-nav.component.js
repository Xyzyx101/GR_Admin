(function() {
  'use strict';

  angular
  .module('sideNav')
  .component('sideNav', {
    templateUrl: 'side-nav/side-nav.template.html',
    controller: SideNavController,
  });

  SideNavController.$inject = ['$rootScope', '$scope', '$location', 'GRFirebase'];

  /* @ngInject */
  function SideNavController($rootScope, $scope, $location, GRFirebase) {
    GRFirebase.Auth().$onAuthStateChanged(function(firebaseUser) {
      $scope.user = $rootScope.user;
    });
    $scope.LogOut = function() {
      GRFirebase.Auth().$signOut().then(function() {
        $location.path('/login');
      }, function(error) {
        alert.error(error.code + " : " + error.message);
      });
    }
    $scope.projects = [
      {
        "age": 1,
        "id": "test-project",
        "name": "Test Project",
        "customer": "Santa"
      },
      {
        "age": 2,
        "id": "savic-avalon-townhomes",
        "name": "Avalon Townhomes",
        "customer": "Savic Homes"
      },
    ];
    $scope.orderProp = 'name';
  }
})();
