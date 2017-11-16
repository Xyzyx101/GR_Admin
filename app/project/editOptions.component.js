(function() {
  'use strict';

  angular
  .module('project')
  .component('editOptions', {
    templateUrl: 'project/editOptions.template.html',
    controller: EditOptionsController
  });

  EditOptionsController.$inject = ['$scope', 'ProjectList'];

  /* @ngInject */
  function EditOptionsController($scope, ProjectList) {
    var self = this;
    $scope.id = $scope.$parent.id;
  }
})();
