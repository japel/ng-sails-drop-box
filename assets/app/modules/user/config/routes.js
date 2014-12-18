/**
 * User: abau
 * Date: 01.12.2014
 * Time: 14:57
 */
angular.module("app.messages").config(function ($routeProvider) {
  $routeProvider.when('/me', {
    title: 'Test',
    templateUrl: '/app/modules/user/templates/test.html'
  });
});
