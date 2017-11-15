describe('Login Component', function() {

  var login, $rootScope;

  // The MockFirebase is only because the grModule will attempt to connect to the real DB by defualt and I don't want it to in a unit test.
  beforeEach(function () {
    jasmine.addCustomEqualityTester(angular.equals);
    MockFirebase.override();
    fbRef = new MockFirebase('https://garage-reality-test.firebaseio.com').child('data');
    module('grFirebase');
    inject(function(_$rootScope_, _login_) {
      login = _login_;
     });
  });

  afterEach(function () {
    firebase.app().delete();
  });


});
