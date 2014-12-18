/**
 * User: abau
 * Date: 20.11.2014
 * Time: 12:18
 */
angular.module("app.files")
  .directive("progress", function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        var elem = $('<span class="meter"></span>');
        element.append(elem);
        scope.$watch(attrs.progress, function (val) {
          elem.css('width', val + '%');
        });
      }
    }
  });
