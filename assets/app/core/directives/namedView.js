/**
 * User: abau
 * Date: 16.12.2014
 * Time: 11:56
 */

angular.module("app.core")
  .directive("namedView", function ($compile, $controller, $route, $sce, $templateRequest) {
    return {
      restrict: 'ECA',
      priority: -400,
      link: function ($scope, $element, attrs) {
        var name = attrs.namedView,
          currentScope,
          currentView,
          templateUrl,
          templateRequest,
          link;

        $scope.$on('$routeChangeSuccess', update);
        update();

        function update() {
          var next = $route.current && $route.current[name];
          if (next) {
            var currentRoute = $route.current,
              locals = currentRoute.locals;
            currentView = next;
            templateUrl = $sce.getTrustedResourceUrl(currentView.templateUrl);

            if (angular.isDefined(templateUrl)) {
              templateRequest = $templateRequest(templateUrl);
              templateRequest.then(function (template) {
                currentScope = currentRoute.scope;
                $element.html(template);
                link = $compile($element.contents());

                if (currentView.controller) {
                  var controller = $controller(currentView.controller, locals);
                  if (currentView.controllerAs) {
                    currentScope[currentView.controllerAs] = controller;
                  }
                }
                link(currentScope);
                $scope.$root[name] = true;
              });
            }

          } else if(!next) {
            $element.html('');
            if (currentScope) {
              currentScope.$destroy();
              currentScope = currentView = null;
            }
            $scope.$root[name] = false;
          }
        }
      }
    }
  });
