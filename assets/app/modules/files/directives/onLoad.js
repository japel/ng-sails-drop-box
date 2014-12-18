angular.module("app.files").directive('onLoad', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var load = function () {
        scope.$apply(function () {
          scope.$eval(attrs.onLoad);
        });
      };
      element.on("load", load);
      scope.$on("$destroy", function () {
        element.unbind("load", load);
      })
    }
  }
});
angular.module("app.core").directive('ngShowFix', function () {
  return {
    link: function (scope, element, attr) {
      scope.$watch(attr.ngShowFix, function ngShowFixWatchAction(value) {
        if (!value) {
          element.addClass('hidden');
        } else {
          element.removeClass('hidden');
        }
      });
    }
  }
});
