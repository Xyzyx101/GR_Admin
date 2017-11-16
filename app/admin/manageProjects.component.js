(function() {
  'use strict';

  angular
  .module('admin')
  .component('manageProjects', {
    templateUrl: 'admin/manageProjects.template.html',
    controller: ManageProjectsController
  });

  ManageProjectsController.$inject = ['$scope', 'ProjectList'];

  /* @ngInject */
  function ManageProjectsController($scope, ProjectList) {
    var self = this;
    this.provinces = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'];
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth();
    var day = today.getDate();
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
    this.createEnabled = false;
    this.projectAdminId = '';

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
        self.createEnabled = true;
      }
      $scope.project.id = newId.toLowerCase().replace(/\ /g, '_').replace(/\'/g, '');
      self.projectMessage = '';
      self.projectError = '';
    }

    this.deleteEnabled = false;
    $scope.projectIdToDelete = '';
    $scope.$watch('projectIdToDelete', updateProjectToDelete);
    function updateProjectToDelete(newValue, oldValue) {
      self.deleteEnabled = ($scope.projectIdToDelete != '');
      self.deleteMessage = '';
      self.deleteError = '';
    }

    this.projectMessage = '';
    this.projectError = '';
    this.CreateProject = function() {
      ProjectList.CreateProject($scope.project)
      .then(function(result){
        self.projectMessage = result;
        self.projectError = '';
      }).catch(function(err){
        self.projectMessage = '';
        self.projectError = err.message;
      })
    }

    this.deleteMessage = '';
    this.deleteError = '';
    this.DeleteProject = function() {
      ProjectList.DeleteProject($scope.projectIdToDelete)
      .then(function(result){
        self.deleteMessage = result;
        self.deleteError = '';
      }).catch(function(err){
        self.deleteMessage = '';
        self.deleteError = err.message;
      })
      $scope.projectIdToDelete = '';
    }
  }
})();
