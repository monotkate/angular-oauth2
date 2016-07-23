/* global angular */

/*
    This sets up the main app module and also tells Angular
    what this module depends on to work correctly.
 */
angular.module('oauth2', [
    'ui.router',
    'ngMaterial',
    'ngCookies'
  ]
)
.config([
  '$urlRouterProvider', '$stateProvider', '$httpProvider',
  function($urlRouterProvider, $stateProvider, $httpProvider) {
    "use strict";

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'login.tpl.html',
        controller: 'LoginCtrl'
      });

    $urlRouterProvider.otherwise('/');
  }
])
.run(['$rootScope', '$cookies', 'AuthSvc',
  function($rootScope, $cookies, AuthSvc) {
    "use strict";

    var token = $cookies.get('user') || {};
    
    // If token is returned, validate and set current user
    if (token.length > 0) {
      AuthSvc.validateToken(token).then(function() {
        AuthSvc.setCurrentUser(token);
      });
    }
    else {
      AuthSvc.clearUser(); // Otherwise clear user
    }
  }
]);
