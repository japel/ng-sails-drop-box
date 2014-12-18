angular.module("app.files")
  .directive("longClick", function () {
    return {
      restrict: 'A',
      priority: 0,
      require: '?ngClick',
      link: function (scope, element, attrs, controller) {
        //console.log("controller", controller);

        var pressTimer = null;
        var longPress = false;
        var handle = function (event) {
          console.log("event long press", event);
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          scope.$eval(attrs.longClick);
        };
        element.mouseup(function () {
          clearTimeout(pressTimer);
          return false;
        });
        element.click(function (event) {
          if (longPress) {
            console.log("event click", event);
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return false;
          }
        });
        element.mousedown(function (event) {
          longPress = false;
          pressTimer = window.setTimeout(function () {
            longPress = true;
            handle(event);
          }, 500);
          return false;
        });
      }
    }
  });
