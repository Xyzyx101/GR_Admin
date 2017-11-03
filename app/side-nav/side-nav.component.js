(function() {
  'use strict';

  angular
  .module('sideNav')
  .component('sideNav', {
    templateUrl: 'side-nav/side-nav.template.html',
    controller: SideNavController,
  });

  SideNavController.$inject = [];

  /* @ngInject */
  function SideNavController() {
    this.projects = [
      {
        "age": 1,
        "id": "test-project",
        "name": "Test Project",
        "customer": "Santa"
      },
      {
        "age": 2,
        "id": "savic-avalon-townhomes",
        "name": "Avalon Townhomes",
        "customer": "Savic Homes"
      },
    ];
    this.orderProp = 'name';
  }
})();
