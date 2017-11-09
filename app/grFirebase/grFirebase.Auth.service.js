(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('Auth', Auth);

  Auth.$inject = ['$rootScope', '$firebaseAuth', '$log'];

  /* @ngInject */
  function Auth($rootScope, $firebaseAuth, $log) {
    $rootScope.auth = null;
    $rootScope.authError = null;
    $rootScope.projects = [];

    var firebaseAuth = $firebaseAuth();

    firebaseAuth.$onAuthStateChanged(function(firebaseUser) {
      if(firebaseUser === null) {
        $rootScope.auth = null;
      } else {
        $rootScope.auth = {
          authenticated: true,
          uid: firebaseUser.uid,
          name: firebaseUser.name,
          email: firebaseUser.email
        }
        setAdminFlag($rootScope.auth);
        //TODO load projects;
      }
      $rootScope.$broadcast("Auth:StateChanged");
      $rootScope.authError = null;
    })

    function setAdminFlag(user) {
      firebase.database().ref('/admins/').orderByKey().equalTo(user.uid).once('value').then(function(snapshot) {
        if(snapshot && snapshot.val()) {
            user.admin=snapshot.val()[user.uid]
            $rootScope.$broadcast("Auth:StateChanged");
        }
      });
    }

    function login(email, password) {
      firebaseAuth.$signInWithEmailAndPassword(email,password).catch(function(error) {
        $log.error(error);
        $rootScope.auth = null;
        $rootScope.authError = error;
        $rootScope.$broadcast("Auth:Error", error);
      });
    }

    function logout(callback) {
      firebaseAuth.$signOut().then(function() {
        if(callback) {
          callback();
        }
      }, function(error) {
        $log.error(error);
      });
    }

    function user() {
      if($rootScope.auth === null) {
        return {authenticated: false};
      } else {
        return $rootScope.auth;
      }
    }

    function authError() {
      return $rootScope.authError;
    }

    return {
      Login : login,
      Logout : logout,
      User : user,
      AuthError : authError,
      WaitForSignIn : firebaseAuth.$waitForSignIn,
      RequireSignIn : firebaseAuth.$requireSignIn
    }
  }
})();
