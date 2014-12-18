/**
 * User: abau
 * Date: 18.12.2014
 * Time: 16:31
 */

var $$ngAP;

angular.module("app.files").run(function () {
  $$ngAP = audiojs.createAll();
});

angular.module("app.files").factory('audioPlayer', function ($rootScope) {
  var el = $$ngAP[0];
  el.show = function () {
    $rootScope.audio = true;
  };
  el.hide = function () {
    $rootScope.audio = false;
  };
  return $$ngAP[0];
});
