(function() {
  'use strict';

  angular
  .module('grAdminTool')
  .run(AuthCatch)
  .config(RouteConfigure);

  RouteConfigure.$inject = ['$locationProvider', '$routeProvider'];

  /* @ngInject */
  function RouteConfigure($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider
    .when('/login', {
      template: '<login></login>'
    })
    .when('/home', {
      template: '<home></home>',
      resolve: {
        // controller will not be loaded until $waitForSignIn resolves
        // Auth refers to our $firebaseAuth wrapper in the factory below
        currentAuth : function(Auth) {
          // $waitForSignIn returns a promise so the resolve waits for it to complete
          return Auth.RequireSignIn();
        }
      }
    })
    .when('/project/:projectId', {
      template: '<project></project>',
      resolve: {
        // controller will not be loaded until $requireSignIn resolves
        // Auth refers to our $firebaseAuth wrapper in the factory below
        currentAuth: function(Auth) {
          // $requireSignIn returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $routeChangeError (see above)
          return Auth.RequireSignIn();
        }
      }
    })
    .otherwise('/login');
  }

  AuthCatch.$inject = ['$rootScope', '$location'];
  /* @ngInject */
  function AuthCatch($rootScope, $location) {
      $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $location.path("/login");
      }
    });
  }
})();
