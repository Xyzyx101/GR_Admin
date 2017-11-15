(function() {
  'use strict';

  angular
  .module('grFirebase', ['firebase'])
  .run(FirebaseInit)

  FirebaseInit.$inject = ['firebase'];
  /* @ngInject */
  function FirebaseInit(firebase) {;
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
  }
})();
