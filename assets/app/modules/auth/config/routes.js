/**
 * User: abau
 * Date: 01.12.2014
 * Time: 13:31
 */
angular.module("app.auth").config(function ($routeProvider) {
  $routeProvider.when('/auth/login', {
    templateUrl: '/app/modules/auth/templates/login.html',
    controller: 'AuthLoginController',
    title: 'Login',
    private: false
  });

  $routeProvider.when('/auth/logout', {
    templateUrl: '/app/modules/auth/templates/login.html',
    private: false,
    controller: function ($location, $auth) {
      $auth.logout().finally(function () {
        $location.path('/');
      });
    }
  });
});
