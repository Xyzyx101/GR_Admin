(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('ProjectConfig', ProjectConfig);

  ProjectConfig.$inject = ['$q', 'Cleaner'];

  /* @ngInject */
  function ProjectConfig($q, Cleaner) {
    return {
      Load: load,
      Save: save
    }

    function load(projectId) {
      var deferred = $q.defer();
      firebase.database().ref('/projectConfig/'+projectId+'/').orderByKey().limitToLast(1).once('value')
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          deferred.resolve(childSnapshot.val());
        });
      }).catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    function save(projectId, config) {
      var deferred = $q.defer();
      config = Cleaner.Clean(config);
      var configListRef = firebase.database().ref('/projectConfig/'+projectId+'/');
      var newConfigRef = configListRef.push();
      newConfigRef.set(config)
      .then(function() {
        deferred.resolve('Project config for ' + projectId + ' has been saved');
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }
  }
})();
