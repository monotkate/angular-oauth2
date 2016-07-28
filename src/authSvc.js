/* global angular */

angular.module('oauth2')
.factory('AuthSvc',
  function ($rootScope, $http, $window, $cookies, $q) {
    var authSvc = {};

    var authObj = {
      OAUTHURL: 'https://accounts.google.com/o/oauth2/v2/auth?',
      VALIDURL: 'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=',
      USERURL: 'https://www.googleapis.com/oauth2/v2/userinfo?access_token=',
      SCOPE: 'profile',
      CLIENTID: '<insert ClientID here',
      REDIRECT: 'http://localhost:8080/MAMP/html5/oauth/',
      TYPE: 'token',
      NONCE: '1234567890123456789'
    };

    var user;       // Current user information
    var userToken;  // Current user token

    // Login current user using Google Login
    authSvc.login = function () {

      var _url = authObj.OAUTHURL +
                 '&scope=' + authObj.SCOPE +
                 '&client_id=' + authObj.CLIENTID +
                 '&response_type=' + authObj.TYPE +
                 '&redirect_uri=' + authObj.REDIRECT;

      var win = $window.open(_url, "windowname1", 'width=800, height=600');

      function getValidLogin() {
        // var i = 0;
        var deferred = $q.defer();
        var poll = $window.setInterval(function() {
          try {
            if(win.document.URL.indexOf(authObj.REDIRECT) != -1) {
              $window.clearInterval(poll);
              var url =   win.document.URL;
              acToken =   gup(url, 'access_token');
              tokenType = gup(url, 'token_type');
              expiresIn = gup(url, 'expires_in');
              win.close();

              authSvc.validateToken(acToken).then(function() {
                $http.get(authObj.USERURL + userToken)
                .then(function(userdata) {
                  user = userdata.data;
                  authSvc.setCurrentUser(userToken);
                  deferred.resolve(userdata.data);
                });
              });
            }
          } catch(e) {
            if (win.closed) {
              $window.clearInterval(poll);
            }
            // console.log(e);
          }
        }, 100);


        return deferred.promise;
      }

      return getValidLogin();
    };

    //Parses value out of URL string
    function gup(url, name) {
      name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
      var regexS = "[\?&#]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( url );
      if( results == null )
        return "";
      else
        return results[1];
    };

    // Given token, validate the token and return response
    authSvc.validateToken = function(token) {
      return $http.get(authObj.VALIDURL + token)
      .then(function () {
        userToken = token;
      });
    };

    // Retrieve user info for current user.  Must validate token in order
    //   to set toke before grabbing info.
    authSvc.getUserInfo = function() {
      return $http.get(authObj.USERURL + userToken)
      .then(function(resp) {
        user = resp.data;
      });
    };

    // Set current user.  Must validate token before using to properly get
    //   user current user info (or will not set)
    authSvc.setCurrentUser = function() {
      authSvc.getUserInfo(userToken).then(function() {
        $rootScope.globals = user;
        $rootScope.userLoggedIn = true;
        $cookies.put('user', userToken);
      });
    };

    // Log user out and clear their information.
    authSvc.clearUser = function() {
      $rootScope.userLoggedIn = false;
      $rootScope.globals = {};
      $cookies.remove('user');
      userToken = null;
      user = null;
    };

    return authSvc;
  }
);
