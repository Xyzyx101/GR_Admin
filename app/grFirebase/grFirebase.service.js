(function() {
  'use strict';

  angular
  .module('grFirebase')
  .factory('GRFirebase', GRFirebase);

  GRFirebase.$inject = ['$rootScope', '$firebaseAuth'];

  /* @ngInject */
  function GRFirebase($rootScope, $firebaseAuth) {
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

    var auth = $firebaseAuth();
    function getAuth() {
      return auth;
    }

    auth.$onAuthStateChanged(function(firebaseUser) {
      $rootScope.$apply(function() {
        $rootScope.user = firebaseUser;
      })
    })

    function DB() {
      return
    }

    return {
      Auth : getAuth
    }
  }
})();
