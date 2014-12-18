/**
 * User: abau
 * Date: 02.12.2014
 * Time: 13:04
 */
angular.module("app.messages")
  .directive("scrollGlue", function ($timeout, $interval) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        var init = false;
        var scrolling = false;
        var el = element[0];
        var lastHeight = el.scrollHeight;

        function checkHeight(){
          if(lastHeight != el.scrollHeight){
            doScroll();
          }
        }

        function doScroll() {
          if (!scrolling) {
            lastHeight = el.scrollHeight;
            var offset = el.scrollHeight - element.outerHeight();
            scrolling = true;
            if (init) {
              el.scrollTop = offset - 200;
              offset = el.scrollHeight - element.outerHeight();
              $timeout(function () {
                element.animate({
                  scrollTop: offset
                }, 500, function () {
                  el.scrollTop = offset;
                  scrolling = false;
                });
              }, 0, false);
            } else {
              $timeout(function () {
                el.scrollTop = offset;
                init = true;
                scrolling = false;
              }, 0, false);
            }
          }
        }

        if (attrs.scrollGlue) {
          scope.$watch(attrs.scrollGlue, doScroll);
        } else {
          scope.$watch(doScroll);
        }

        $timeout(function () {
          var imgs = $('img', element);
          imgs.load(function () {
            init = false;
            doScroll();
          })
        }, 0, false);

        /*var stop = $interval(checkHeight, 100);
        scope.$on("$destroy", function () {
          $interval.cancel(stop);
        })*/
      }
    }
  });
