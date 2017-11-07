(function() {
  'use strict';

  angular
  .module('project')
  .component('project', {
    templateUrl: 'project/project.template.html',
    controller: ProjectController,
  });

  ProjectController.$inject = [];

  /* @ngInject */
  function ProjectController() {
      
  }
})();
