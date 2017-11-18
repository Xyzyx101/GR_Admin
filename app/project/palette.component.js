(function() {
  'use strict';

  angular
  .module('project')
  .component('palette', {
    templateUrl: 'project/palette.template.html',
    controller: PaletteController
  });

  PaletteController.$inject = [];

  /* @ngInject */
  function PaletteController() {

  }
})();
