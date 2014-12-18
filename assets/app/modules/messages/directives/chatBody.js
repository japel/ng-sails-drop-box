/**
 * User: abau
 * Date: 03.12.2014
 * Time: 14:47
 */
angular.module("app.messages")
  .directive("chatBody", function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs, controller) {
        var body = scope.$eval(attrs.chatBody);
        //body = body.replace(/(\r\n|\n|\r)/gm, '<br>\n');
        element.html(body);
        $('a', element).attr('target', '_blank');
      }
    }
  });
