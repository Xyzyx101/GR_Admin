'use strict';

describe('Auth service', function() {

  beforeEach(module('grFirebase'));
  afterEach(function () {
     firebase.app().delete();
   });

  it('should exist', inject(function(Auth) {
    expect(Auth).toBeDefined();
    expect(Auth.User()).toBeDefined();
  }));

  it('Login should return a promise', inject(function(Auth) {
    var promise = Auth.Login('foo@bar.com', 'password');
    expect(promise).toBeDefined();
    expect(promise.constructor.name).toBe('Promise');
  }));

  it('Logout should return a promise', inject(function(Auth) {
    var promise = Auth.Logout();
    expect(promise).toBeDefined();
    expect(promise.constructor.name).toBe('Promise');
  }));

  it('Getg promises from Auth', inject(function(Auth) {
    var wait = Auth.WaitForSignIn();
    expect(wait.constructor.name).toBe('Promise');
    var require = Auth.RequireSignIn();
    expect(require.constructor.name).toBe('Promise');
  }));

  it('should not be authenticated with no user',inject(function(Auth) {
    expect(Auth.User()).toBe(null);
  }));

  // The firebase mock is garabge for authentication.  This test does nothing.
  // describe('Login', function () {
  //   it('should log in',  inject(function($rootScope) {
  //       var authenticatedUser = {authenticated:false};
  //       fbRef.ref().createUser({email: 'joetest@test.com', password: 'password'}, function() {
  //         Auth.Login('joetest@test.com', 'password')
  //         .then(function(user) {
  //           console.log('does this even run????');
  //           expect(user).toBeDefined();
  //           authenticatedUser = user;
  //         }).catch(function(err) {
  //           console.log('or this??!!?!');
  //         });
  //       });
  //       fbRef.flush();
  //       $rootScope.$apply();
  //       expect(authenticatedUser.authenticated).toBe(true);
  //   }));
  // });

  // describe('Login Out', function () {
  //
  // });

});
