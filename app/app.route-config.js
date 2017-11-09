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
        currentAuth : function(Auth) {
          // controller will not be loaded until $requireSignIn resolves
          return Auth.RequireSignIn();
          // $requireSignIn returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $routeChangeError and get caught by AuthCatch() below
        }
      }
    })
    .when('/admin', {
      template: '<admin></admin>',
      resolve: {
        currentAuth : function(Auth) {
          return Auth.RequireSignIn();
        }
      }
    })
    .when('/project/:projectId', {
      template: '<project></project>',
      resolve: {
        currentAuth: function(Auth) {
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
