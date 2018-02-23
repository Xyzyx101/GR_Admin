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

    function emailLogin(email, password) {
      var deferred = $q.defer();
      // TODO I cannot get session persistence to work.  It should end a login at a new session
      // but it stays logged in forever.  minification process to a bower module may be broken
      //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      //then(function() {
      //  return
      firebaseAuth.$signInWithEmailAndPassword(email,password)
      .then(function(user) {
        return retrieveDetails(user);
      }).then(function(user) {
        deferred.resolve(user);
      }).catch(function(err){
        deferred.reject(err);
      }).finally(function() {
        $rootScope.$broadcast("Auth:StateChanged");
      });
      return deferred.promise;
    }

    function anonymousLogin() {
      var deferred = $q.defer();
      firebaseAuth.$signInAnonymously()
      .then(function(user) {
        deferred.resolve(user);
      }).catch(function(err){
        deferred.reject(err);
      }).finally(function() {
        $rootScope.$broadcast("Auth:StateChanged");
      });
      return deferred.promise;
    }

    function facebookLogin() {
      var deferred = $q.defer();
      var provider = new firebase.auth.FacebookAuthProvider();
      firebaseAuth.$signInWithPopup(provider)
      .then(function(userCredential) {
        return retrieveDetails(userCredential.user);
      }).then(function(user) {
        deferred.resolve(user);
      }).catch(function(err){
        deferred.reject(err);
      }).finally(function() {
        $rootScope.$broadcast("Auth:StateChanged");
      });
      return deferred.promise;
    }

    function googleLogin() {
      var deferred = $q.defer();
      var provider = new firebase.auth.GoogleAuthProvider();
      firebaseAuth.$signInWithPopup(provider)
      .then(function(userCredential) {
        return retrieveDetails(userCredential.user);
      }).then(function(user) {
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

    function createAccount(email, password) {
      var deferred = $q.defer();
      firebaseAuth.$createUserWithEmailAndPassword(email,password)
      .then(function(uid) {
        return emailLogin(email, password);
      }).then(function(user) {
        deferred.resolve(user);
      }).catch(function(err){
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function sendEmailVerification() {
      var deferred = $q.defer();
      let currentUser = firebaseAuth.$getAuth();
      if(currentUser !== null) {
        currentUser.sendEmailVerification()
        .then(function(data) {
          deferred.resolve('Email verification has been sent to ' + currentUser.email);
        }).catch(function(err){
          deferred.reject(err);
        });
      } else {
        deferred.reject('No user signed in');
      }
      return deferred.promise;
    }

    function applyEmailVerification(code) {
      var deferred = $q.defer();
      let currentUser = firebaseAuth.$getAuth();
      if(currentUser !== null) {
        currentUser.applyActionCode(code)
        .then(function(data) {
          deferred.resolve(data);
        }).catch(function(err) {
          deferred.reject(err);
        })
      } else {
        deferred.reject({'message':'No user signe in'});
      }
      return deferred
    }

    function resetPassword(email) {
      var deferred = $q.defer();
      firebaseAuth.$sendPasswordResetEmail(email)
      .catch(function(err){
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function updateDisplayName(displayName) {
      let deferred = $q.defer();
      let currentUser = firebaseAuth.$getAuth();
      if(currentUser !== null) {
        currentUser.updateProfile({
          displayName: displayName
          // photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(function() {
          deferred.resolve();
        }).catch(function(err) {
          deferred.reject(err);
        });
      } else {
        deferred.reject({'message':'No user signed in'});
      }
      return deferred.promise;
    }

    function reload() {
      let deferred = $q.defer();
      let user = firebase.auth().currentUser;
      if(user===null) {
        deferred.reject({'message':'No user signed in'});
      } else {
        user.reload()
        .then(function() {
          $rootScope.$broadcast("Auth:StateChanged");
          deferred.resolve();
        }).catch(function(err) {
          deferred.reject(err);
        })
      }
      return deferred.promise;
    }

    function sendPasswordReset(email) {
      let deferred = $q.defer();
      firebase.auth().sendPasswordResetEmail(email)
      .then(function() {
        deferred.resolve('Password reset email has been sent');
      }).catch(function(err) {
        deferred.reject(err);
      })
      return deferred.promise;
    }

    return {
      EmailLogin : emailLogin,
      AnonymousLogin : anonymousLogin,
      FacebookLogin : facebookLogin,
      GoogleLogin : googleLogin,
      Logout : logout,
      User : user,
      UserDetails : userDetails,
      CreateAccount : createAccount,
      SendEmailVerification : sendEmailVerification,
      ApplyEmailVerification : applyEmailVerification,
      ResetPassword : resetPassword,
      UpdateDisplayName : updateDisplayName,
      Reload : reload,
      SendPasswordReset : sendPasswordReset,
      WaitForSignIn : firebaseAuth.$waitForSignIn,
      RequireSignIn : firebaseAuth.$requireSignIn
    }
  }
})();
