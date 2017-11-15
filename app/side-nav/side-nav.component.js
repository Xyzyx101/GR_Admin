(function() {
  'use strict';

  angular
  .module('sideNav')
  .component('sideNav', {
    templateUrl: 'side-nav/side-nav.template.html',
    controller: SideNavController,
  });

  SideNavController.$inject = ['$scope', '$location', '$log', 'Auth', 'ProjectList'];

  /* @ngInject */
  function SideNavController($scope, $location, $log, Auth, ProjectList) {
    var self = this;
    this.user = Auth.User();
    this.userDetails = Auth.UserDetails();
    $scope.$on("Auth:StateChanged", function() {
      self.user = Auth.User();
      self.userDetails = Auth.UserDetails();
      updateProjects();
      //self.projects = ProjectList.GetList(self.user);
    });

    this.LogOut = function() {
      Auth.Logout()
      .finally(function() {
        $location.path('/login');
      });
    }

    this.Admin = function() {
      $location.path('/admin');
    }

    function updateProjects() {
      ProjectList.GetList()
      .then(function(list) {
        self.projects = list;
      }).catch(function(err) {
        $log.error(err);
        self.projects = [];
      })
    }
    updateProjects();
    $scope.$on("ProjectList:Updated", function() {
      updateProjects();
    });
    //this.projects = ProjectList.GetList(this.user);
    // this.projects = [
    //   {
    //     "age": 1,
    //     "id": "test-project",
    //     "name": "Test Project",
    //     "customer": "Santa"
    //   },
    //   {
    //     "age": 2,
    //     "id": "savic-avalon-townhomes",
    //     "name": "Avalon Townhomes",
    //     "customer": "Savic Homes"
    //   },
    //   {
    //     "age": 1,
    //     "id": "test-project",
    //     "name": "Test Project",
    //     "customer": "Santa"
    //   },
    //   {
    //     "age": 2,
    //     "id": "savic-avalon-townhomes",
    //     "name": "Avalon Townhomes",
    //     "customer": "Savic Homes"
    //   },
    //   {
    //     "age": 1,
    //     "id": "test-project",
    //     "name": "Test Project",
    //     "customer": "Santa"
    //   },
    //   {
    //     "age": 2,
    //     "id": "savic-avalon-townhomes",
    //     "name": "Avalon Townhomes",
    //     "customer": "Savic Homes"
    //   },
    // ];
  }
})();
