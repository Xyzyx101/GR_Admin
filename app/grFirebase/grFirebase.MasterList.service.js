(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('MasterList', MasterList);

  MasterList.$inject = ['$rootScope'];

  /* @ngInject */
  function MasterList($rootScope) {
    var list = {"bacon" : "isYummy"};

    $rootScope.$on("Auth:StateChanged", function() {
      retrieve();
    });

    function retrieve() {

    }

    return {
      List: list
    };
  }
})();
