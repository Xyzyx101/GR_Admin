(function() {
  'use strict';

  angular
  .module('project')
  .component('override', {
    templateUrl: 'project/override.template.html',
    controller: OverrideController
  });

  OverrideController.$inject = [];

  /* @ngInject */
  function OverrideController() {

  }
})();
