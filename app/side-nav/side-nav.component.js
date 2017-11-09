(function() {
  'use strict';

  angular
  .module('sideNav')
  .component('sideNav', {
    templateUrl: 'side-nav/side-nav.template.html',
    controller: SideNavController,
  });

  SideNavController.$inject = ['$scope', '$location', 'Auth'];

  /* @ngInject */
  function SideNavController($scope, $location, Auth) {
    $scope.user = Auth.User();
    $scope.$on("Auth:StateChanged", function() {
      $scope.user = Auth.User();
    });

    $scope.LogOut = function() {
      Auth.Logout(function() {
        $location.path('/login');
      });
    }

    $scope.Admin = function() {
      $location.path('/admin');
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
  }
})();
