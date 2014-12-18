/**
 * User: abau
 * Date: 28.11.2014
 * Time: 12:08
 */

/*window.onerror = function() {
  alert("Error caught");
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    alert(arg);
  }
};*/

var dependencies = [];

dependencies.push('ngResource');
dependencies.push('ngRoute');
dependencies.push('ngMaterial');

dependencies.push('angularFileUpload');
dependencies.push('emtec.modal');
dependencies.push('slick');

dependencies.push('app.core');
dependencies.push('app.messages');
dependencies.push('app.auth');
dependencies.push('app.user');
dependencies.push('app.files');

angular.module("app", dependencies);

angular.module("app").config(function ($locationProvider, $routeProvider) {
  $locationProvider.html5Mode(true);

  $routeProvider.when('/home', {
    redirectTo: '/start'
  });
  $routeProvider.when('/start', {
    template: 'yay'
  });
});

angular.module("app").run(function ($rootScope) {
  $rootScope.$on("$routeChangeStart", function (event, route) {
    if($rootScope.$title) delete $rootScope.$title;
    $rootScope.$route = route ? route.$$route : null;
  });
});

angular.module('app')
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle();
    };
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('left').close();
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('right').close();
    };
  });

angular.module("app")
  .directive("body", function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs, controller) {
        element.addClass('linked');
        element.removeClass('unlinked');
      }
    }
  });
