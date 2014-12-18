/**
 * User: abau
 * Date: 01.12.2014
 * Time: 18:23
 */
angular.module("app.core").service('$socket', function ($q, $rootScope) {
  return {
    get: function (route) {
      var deferred = $q.defer();
      io.socket.get(route, {}, function (data, jwres) {
        $rootScope.$apply(function () {
          deferred.resolve(data, jwres);
        });
      });
      return deferred.promise;
    }
  }
});
