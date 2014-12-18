/**
 * User: abau
 * Date: 28.11.2014
 * Time: 17:59
 */
angular.module("app.core")
  .directive("a", function () {
    return {
      restrict: 'E',
      link: function (scope, element, attrs, controller) {
        /*element.on('click', function (event) {
          event.preventDefault();
        })*/
      }
    }
  });
