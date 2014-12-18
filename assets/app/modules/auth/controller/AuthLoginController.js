/**
 * User: abau
 * Date: 01.12.2014
 * Time: 13:33
 */
angular.module("app.auth")
  .controller("AuthLoginController", function ctrl($scope, $auth, $location, $mdToast) {
    $scope.login = function () {
      $scope.isLoading = true;
      $auth.login($scope.login.username, $scope.login.password).then(function () {
        $scope.isLoading = false;
        if ($auth.loggedIn()) {
          $location.path($location.search().next || '/');
          $location.search('next', null);

          $mdToast.show(
            $mdToast.simple()
              .content('Awwww yeah')
              .position('top right')
              .hideDelay(5000)
          );
        } else {
          $scope.login.password = '';

          $mdToast.show(
            $mdToast.simple()
              .content('Passwort oder Benutzername falsch.')
              .position('top right')
              .hideDelay(5000)
          );
        }
      }, function (event) {
        $scope.isLoading = false;
        if(event.status == 0){
          $mdToast.show(
            $mdToast.simple()
              .content('Offline :O')
              .position('top right')
              .hideDelay(5000)
          );
        }
      });
    }
  });
