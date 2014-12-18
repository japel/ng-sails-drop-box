angular.module("app.auth", []);

angular.module("app.auth").run(function ($rootScope, $route, $location, $auth) {
  $rootScope.$on('$routeChangeStart', function (event, nextRoute) {
    if (nextRoute) {
      var route = nextRoute.$$route;
      if (route.private !== false && !$auth.loggedIn()) { //
        console.log("route is private");
        event.preventDefault();
        var actualPath = $location.path();
        $location.path('/auth/login').search('next', actualPath);
      }
    }
  });
});
