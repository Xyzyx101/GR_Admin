(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('MasterList', MasterList);

  MasterList.$inject = ['$rootScope', '$log', 'Cleaner'];

  /* @ngInject */
  function MasterList($rootScope, $log, Cleaner) {
    var list = {'optionList': []};

    function download() {
      firebase.database().ref('/masterlist/').orderByKey().limitToLast(1).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          list =  childSnapshot.val();
          $rootScope.$broadcast("MasterList:Changed");
        });
      });
    }

    function upload(newList) {
      // Clean will remove the junk properties that ui-grid shoves into the data.
      newList = Cleaner.Clean(newList);
      var masterListRef = firebase.database().ref('/masterlist/');
      var newlistRef = masterListRef.push();
      newlistRef.set(newList).then(
        function(data) {
          $log.log(data);
          list = newList;
          $rootScope.$broadcast("MasterList:Changed");
        }).catch(function(error) {
          $log.error(error);
        });
      }

    function getList() {
      return list;
    }

    return {
      Download: download,
      Upload: upload,
      GetList: getList
    };
  }
})();
