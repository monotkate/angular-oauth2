/* global angular */

angular.module('oauth2')
.controller('LoginCtrl',
  [
    '$scope', '$state', '$stateParams', '$window', '$rootScope', 'AuthSvc',
    function($scope, $state, $stateParams, $window, $rootScope, AuthSvc, $cookies) {
      "use strict";

      $scope.displayOverflow = false;

      $scope.navigate = function navigate(home) {
        $state.go(home);
      };

      // Login user using authSvc.  Once complete, navigate home.
      $scope.login = function () {
        AuthSvc.login()
        .then(function(resp) {
          // $scope.navigate('home');
        }).catch(function(error) {
          console.log(error);
        });
      };

      $scope.logout = function() {
        AuthSvc.clearUser();
      };
    }
  ]
);
