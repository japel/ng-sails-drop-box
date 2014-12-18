/**
 * User: abau
 * Date: 01.12.2014
 * Time: 13:13
 */
angular.module("app.auth").service('$auth', function ($http, $q, $rootScope) {

  var user = window.currentUser || null;
  if(user !== null){
    $rootScope.$user = user;
  }

  var out = {
    getUser: function () {
      var deferred = $q.defer();
      if (user === null) {
        $http.get('/api/v1/auth/current').success(function (data) {
          user = data;
          $rootScope.$user = user;
          deferred.resolve(user);
        }).error(function () {
          deferred.reject();
        });
      } else {
        deferred.resolve(user);
      }
      return deferred.promise;
    },
    login: function (username, password) {
      return $http.post('/api/v1/auth/login', {username: username, password: password}).success(function (data) {
        user = data;
        $rootScope.$user = user;
      });
    },
    logout: function () {
      user = null;
      $rootScope.$user = user;
      return $http.get('/api/v1/auth/logout');
    },
    loggedIn: function () {
      return user !== null;
    }
  };

  out.getUser();
  return out;
});
