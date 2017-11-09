'use strict';

describe('grFirebase', function() {
  var fbRef;
  var spy;
  var Auth;
  var $rootScope;

  beforeEach(function () {
    jasmine.addCustomEqualityTester(angular.equals);
    MockFirebase.override();
    spy = sinon.spy();
    fbRef = new MockFirebase('https://garage-reality-test.firebaseio.com').child('data');
    module('grFirebase');
    inject(function(_$rootScope_, _Auth_) {
        Auth = _Auth_;
        $rootScope = _$rootScope_;
      })
  });

  afterEach(function () {
    firebase.app().delete();
  });

  describe('MockFirebase', function () {
    it('sets the auth data', function () {
      var user = {};
      fbRef.changeAuthState(user);
      fbRef.flush();
      expect(fbRef).toBeDefined();
      expect(spy).toBeDefined();
      expect(fbRef.getAuth()).toBe(user);
    });
  });

  describe('Auth service', function () {
    it('Should exist', function() {
      expect(Auth).toBeDefined();
      expect(Auth.User()).toBeDefined();
    });
  });

  describe('No User', function () {
    it('sets the auth data', function () {
      expect(Auth.User().authenticated).toBe(false);
    });
  });

  // The firebase mock is garabge for authentication because the authentication state change never gets called
  // describe('Login In', function () {
  //
  // });
  //
  // describe('Login Out', function () {
  //
  // });

  describe('Error', function () {
    it('Gets error message', function () {
      expect(Auth.AuthError()).toBe(null);
      var authError = "AUTH_ERROR";
      $rootScope.authError = authError;
      expect(Auth.AuthError()).toBe(authError);
    });
  });

  describe('routing promise', function() {
    it('Gets promises from Auth', function() {
      var wait = Auth.WaitForSignIn();
      expect(wait.constructor.name).toBe('Promise');
      var require = Auth.RequireSignIn();
      expect(require.constructor.name).toBe('Promise');
    });
  });
});
