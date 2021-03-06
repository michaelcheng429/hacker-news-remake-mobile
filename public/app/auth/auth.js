angular.module('hack.auth', [])

.controller('AuthController', ["$scope", "$window", "$location", "Auth", "Followers", 
  function ($scope, $window, $location, Auth, Followers) {
  
  $scope.user = {};
  $scope.newUser = {};
  $scope.loggedIn = Auth.isAuth();
  $scope.badLogin = false;
  $scope.badLoginMessage = '';
  $scope.badSignup = false;
  $scope.badSignupMessage = '';

  $scope.signin = function () {
    Auth.signin($scope.user)
      .then(function (data) {
        $scope.badLogin = false;
        $scope.badLoginMessage = '';
        $scope.badSignup = false;
        $scope.badSignupMessage = '';
        $window.localStorage.setItem('com.hack', data.token);
        $window.localStorage.setItem('hfUsers', data.followers)

        Followers.init(data.followers.split(","));

        $scope.loggedIn = true;
        $scope.user = {};
      })
      .catch(function (error) {
        $scope.badSignup = false;
        $scope.badSignupMessage = '';
        $scope.badLogin = true;
        $scope.badLoginMessage = error;
        console.error(error);
      });
  };

  $scope.signup = function () {
    $scope.newUser.following = Followers.following.join(',');

    Auth.signup($scope.newUser)
      .then(function (data) {
        $scope.badLogin = false;
        $scope.badLoginMessage = '';
        $scope.badSignup = false;
        $scope.badSignupMessage = '';
        $window.localStorage.setItem('com.hack', data.token);

        $scope.loggedIn = true;
        $scope.newUser = {};
      })
      .catch(function (error) {
        $scope.badLogin = false;
        $scope.badLoginMessage = '';
        $scope.badSignup = true;
        $scope.badSignupMessage = error;
        console.error(error);
      });
  };

  $scope.logout = function () {
    Followers.init();
    Auth.signout();
    $scope.loggedIn = false;
  }
}]);
