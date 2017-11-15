(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('Auth', Auth);

  Auth.$inject = ['$q', '$rootScope', '$firebaseAuth'];

  /* @ngInject */
  function Auth($q, $rootScope, $firebaseAuth) {
    var firebaseAuth = $firebaseAuth();
    var details = {};

    firebaseAuth.$onAuthStateChanged(function(firebaseUser) {
      if(firebaseUser != null) {
        retrieveDetails(firebaseUser)
        .finally(function() {
          $rootScope.$broadcast("Auth:StateChanged");
        });
      } else {
        details = {};
        $rootScope.$broadcast("Auth:StateChanged");
      }
    });

    function login(email, password) {
      var deferred = $q.defer();
      var newUser = {};
      // TODO I cannot get session persistence to work.  It should end a login at a new session
      // but it stays logged in forever.  minification process to a bower module may be broken
      //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      //then(function() {
      //  return
      firebaseAuth.$signInWithEmailAndPassword(email,password)
      .then(retrieveDetails)
      .then(function(user) {
        deferred.resolve(user);
      }).catch(function(err){
        deferred.reject(err);
      }).finally(function() {
        $rootScope.$broadcast("Auth:StateChanged");
      });
      return deferred.promise;
    }

    function retrieveDetails(user) {
        var deferred = $q.defer();
        user = user || {uid:'-1'};
        firebase.database().ref('/users/'+user.uid).once('value')
        .then(function(snapshot) {
          if(snapshot && snapshot.val()) {
            //user.admin=snapshot.val()[user.uid]
            details = snapshot.val();
          }
          deferred.resolve(user);
        }).catch(function(error) {
          deferred.reject(error);
        })
        return deferred.promise;
    }

    function logout(callback) {
      var deferred = $q.defer();
      firebaseAuth.$signOut()
      .then(function() {
        deferred.resolve();
      }).catch(function(err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function user() {
      return firebaseAuth.$getAuth();
    }

    function userDetails() {
        return details;
    }

    return {
      Login : login,
      Logout : logout,
      User : user,
      UserDetails : userDetails,
      WaitForSignIn : firebaseAuth.$waitForSignIn,
      RequireSignIn : firebaseAuth.$requireSignIn
    }
  }
})();
