(function() {
  'use strict';

  angular
  .module('admin')
  .component('admin', {
    templateUrl: 'admin/admin.template.html',
    controller: AdminController
  });

  AdminController.$inject = ['$scope'];

  /* @ngInject */
  function AdminController($scope) {
  }
})();
