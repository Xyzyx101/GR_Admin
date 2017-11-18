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
    $scope.id = $routeParams.id;

    self.project = {};
    ProjectList.GetProject($scope.id)
    .then(function(project) {
      self.project = project;
    });
  }
})();
