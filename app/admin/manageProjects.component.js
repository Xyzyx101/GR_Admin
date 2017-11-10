(function() {
  'use strict';

  angular
  .module('admin')
  .component('manageProjects', {
    templateUrl: 'admin/manageProjects.template.html',
    controller: ManageProjectsController
  });

  ManageProjectsController.$inject = ['$scope'];

  /* @ngInject */
  function ManageProjectsController($scope) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
    var x = new Date(year, month + 3, day);
    var y = new Date(year + 1, month, day);
    $scope.project = {
      id: '',
      displayName: '',
      creationDate: today,
      launchDate: new Date(year, month + 3, day),
      shutdownDate: new Date(year + 1, month, day),
      address: {
        line1: '',
        line2: '',
        city: '',
        province: ''
      },
      client: {
        displayName: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          province: ''
        },
      }
    };
    $scope.$watch('project.displayName', updateProjectId);
    $scope.$watch('project.client.displayName', updateProjectId);
    function updateProjectId(newValue, oldValue) {
      var newId = ''
      if($scope.project.displayName === '') {
        newId = $scope.project.client.displayName;
      } else if ($scope.project.client.displayName === '') {
        newId = $scope.project.displayName;
      } else {
        newId = $scope.project.client.displayName + '-' +  $scope.project.displayName;
      }
      $scope.project.id = newId.toLowerCase().replace(/\ /g, '_').replace(/\'/g, '');
    }
  }

})();
