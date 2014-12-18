/**
 * User: abau
 * Date: 21.11.2014
 * Time: 14:26
 */
angular.module("app.files")
  .directive("scrollbar", function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        element.mCustomScrollbar({
          axis: "y", // horizontal scrollbar
          theme: "minimal",
          scrollInertia: 200,
          scrollTo: 'last',
          advanced: {
            updateOnSelectorChange: 'div.row'
          }
        });
        scope.scrollBot = function () {
          $timeout(function () {
            element.mCustomScrollbar("scrollTo", "bottom");
          }, 0, false);
        }
      }
    }
  });
