(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('UserConfig', UserConfig);

  UserConfig.$inject = ['$q', 'Cleaner'];

  /* @ngInject */
  function UserConfig($q, Cleaner) {
    return {
      Load: load,
      Save: save
    }

    function load(uid, projectId, unitId) {
      var deferred = $q.defer();
      firebase.database().ref('/userConfig/'+projectId+'/'+uid+'/'+unitId+'/').orderByKey().limitToLast(1).once('value')
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          deferred.resolve(childSnapshot.val());
        });
      }).catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function save(uid, projectId, unitId, config) {
      var deferred = $q.defer();
      config = Cleaner.Clean(config);
      var configListRef = firebase.database().ref('/userConfig/'+projectId+'/'+uid+'/'+unitId+'/');
      var newConfigRef = configListRef.push();
      newConfigRef.set(config)
      .then(function() {
        deferred.resolve('User config for ' + projectId + ' ' + unitId + ' has been saved');
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  }
})();
