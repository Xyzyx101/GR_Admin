(function() {
  'use strict';

  angular
  .module('sideNav')
  .factory('SideNavOpener', SideNavOpener);

  SideNavOpener.$inject = ['$mdSidenav', '$log'];
  /* @ngInject */
  function SideNavOpener($mdSidenav, $log) {
    var Opener = {
      Open: function() {
        $log.debug('Open');
      },
      Close: function() {
        $log.debug('Close');
      }
    }
    return Opener;
  }
})();
