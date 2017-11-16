(function() {
  'use strict';

  angular
  .module('project')
  .component('project', {
    templateUrl: 'project/project.template.html',
    controller: ProjectController,
  });

  ProjectController.$inject = ['$routeParams', '$scope', 'ProjectList'];

  /* @ngInject */
  function ProjectController($routeParams, $scope, ProjectList) {
    var self = this;
    self.project = {};
    $scope.id = $routeParams.id;
    ProjectList.GetProject($scope.id)
    .then(function(project) {
      self.project = project;
    });
  }
})();
