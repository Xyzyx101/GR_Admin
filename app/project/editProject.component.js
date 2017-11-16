(function() {
  'use strict';

  angular
  .module('project')
  .component('editProject', {
    templateUrl: 'project/editProject.template.html',
    controller: EditProjectController
  });

  EditProjectController.$inject = ['$scope', '$window', 'ProjectList'];

  /* @ngInject */
  function EditProjectController($scope, $window, ProjectList) {
    var self = this;
    this.provinces = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland', 'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan'];
    this.id = $scope.$parent.id;
    this.project = {};
    this.message = '';
    this.error = '';
    ProjectList.GetProject(this.id)
    .then(function(project) {
      self.project = project;
    }).catch(function(err) {
      self.error = err.message;
      self.message = '';
    });

    this.SaveProject = function() {
      ProjectList.SaveProject(self.project)
      .then(function(message) {
        self.message = message;
        self.error = '';
      }).catch(function(err){
        self.error = err.message;
        self.message = '';
      }).finally(function() {
        $window.location.reload();
      });
    }
  }
})();
