(function() {
  'use strict';

  angular
  .module('project')
  .component('project', {
    templateUrl: 'project/project.template.html',
    controller: ProjectController,
  });

  ProjectController.$inject = ['$routeParams', '$scope'];

  /* @ngInject */
  function ProjectController($routeParams, $scope) {
    $scope.id = $routeParams.id;
  }
})();
