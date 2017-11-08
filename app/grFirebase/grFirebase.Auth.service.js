(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('Auth', Auth);

  Auth.$inject = ['$rootScope', '$firebaseAuth', '$log'];

  /* @ngInject */
  function Auth($rootScope, $firebaseAuth, $log) {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBKaQInnl8YaNs6ulsZGVi5qZQ7YsOpl6w",
      authDomain: "garage-reality-test.firebaseapp.com",
      databaseURL: "https://garage-reality-test.firebaseio.com",
      projectId: "garage-reality-test",
      storageBucket: "garage-reality-test.appspot.com",
      messagingSenderId: "521229023501"
    };
    firebase.initializeApp(config);

    $rootScope.auth = null;

    $rootScope.projects = [];

    var firebaseAuth = $firebaseAuth();

    firebaseAuth.$onAuthStateChanged(function(firebaseUser) {
      if(firebaseUser === null) {
        $rootScope.auth = null
      } else {
        $rootScope.auth = {
          authenticated: true,
          uid: firebaseUser.uid,
          name: firebaseUser.name,
          email: firebaseUser.email
        }
        //TODO check isSystemAdmin;
        //TODO load projects;
      }
      $rootScope.$broadcast("Auth:StateChanged");
      $rootScope.authError = null;
      //$rootScope.$broadcast("Auth:Error");
    })

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
        return {};
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
