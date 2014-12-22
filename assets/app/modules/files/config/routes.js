/**
 * User: abau
 * Date: 16.10.2014
 * Time: 15:27
 */
angular.module("app.files").config(function ($routeProvider) {

  var filesConfig = {
    templateUrl: '/app/modules/files/templates/files.html',
    title: 'FTP',
    reloadOnSearch: false,
    controller: 'filesController',
    resolve: {
      folder: function ($http, $route) {
        var add = '';
        if ($route.current.params.folder) {
          add = $route.current.params.folder;
        }
        return $http.get('/api/v1/folder/' + add + '?ts=' + (new Date()).getTime(), {cache: false});
      }
    },
    'options-bar': {
      templateUrl: '/app/modules/files/templates/files.options.html',
      controller: function ($scope, folder) {
      }
    }
  };
  $routeProvider.when('/files/:folder?', filesConfig);
});
