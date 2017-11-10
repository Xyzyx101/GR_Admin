(function() {
  'use strict';

  angular
  .module('admin')
  .component('manageProjects', {
    templateUrl: 'admin/manageProjects.template.html',
    controller: ManageProjectsController
  });

  ManageProjectsController.$inject = [];

  /* @ngInject */
  function ManageProjectsController() {
    this.foo = "Bacon is yummy";
  }
})();
