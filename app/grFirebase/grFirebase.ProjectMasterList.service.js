(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('ProjectMasterList', ProjectMasterList);

  ProjectMasterList.$inject = ['$rootScope', '$log', 'Cleaner'];

  /* @ngInject */
  function ProjectMasterList($rootScope, $log, Cleaner) {
    var list = {"OptionList": []};

    function download(projectId) {
      firebase.database().ref('/projectMasterList/'+projectId+'/').orderByKey().limitToLast(1).once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          list =  childSnapshot.val();
          $rootScope.$broadcast("ProjectMasterList:Changed");
        });
      });
    }

    function upload(projectId, newList) {
      $rootScope.$broadcast("ProjectMasterList:Changed");

      // Clean will remove the junk properties that ui-grid shoves into the data.
      newList = Cleaner.Clean(newList);
      var masterListRef = firebase.database().ref('/projectMasterList/'+projectId+'/');
      var newlistRef = masterListRef.push();
      newlistRef.set(newList).then(
        function(data) {
          $log.log(data);
          list = newList;
          $rootScope.$broadcast("ProjectMasterList:Changed");
        }).catch(function(error) {
          $log.error(error);
        });
      }

    function getList(projectId) {
      return list;
    }

    return {
      Download: download,
      Upload: upload,
      GetList: getList
    };
  }
})();
