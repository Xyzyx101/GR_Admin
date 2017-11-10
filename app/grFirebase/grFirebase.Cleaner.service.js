(function() {
  'use strict';

  // The ui-grid injects some ugly mess of properties into the master list.
  // This cleans out all the junk that doesn't work in firebase.

  angular
  .module('grFirebase')
  .factory('Cleaner', Cleaner);

  Cleaner.$inject = ['$log'];

  /* @ngInject */
  function Cleaner($log) {
    return {
      Clean : clean
    };

    function clean(obj) {
      if (obj === null || typeof(obj) !== 'object')
      return obj;

      if (obj instanceof Date) {
        return new Date(obj); //or new Date(obj);
      } else if (obj instanceof Array) {
        var cleanArray = []
        for(var i=0; i<obj.length; ++i) {
          cleanArray.push(clean(obj[i]));
        }
        return cleanArray;
      } else {
        var cleanObj = {};
        for (var key in obj) {
          if(!obj.hasOwnProperty(key)) { continue; };
          //should match anything containing any of ".", "#", "$", "/", "[", or "]"
          if(key.match(/(\.|#|\$|\/|\[|])/)) {
            $log.log("Found key with invalid characters " + key);
            $log.log("Key will not be sent to the db");
          } else {
            cleanObj[key] = clean(obj[key]);
          }
        }
        return cleanObj;
      }
    }
  }
})();
