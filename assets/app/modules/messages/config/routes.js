/**
 * User: abau
 * Date: 01.12.2014
 * Time: 14:57
 */
angular.module("app.messages").config(function ($routeProvider) {
  $routeProvider.when('/messages', {
    title: 'Nachrichten',
    templateUrl: '/app/modules/messages/templates/pm.html',
    controller: 'MessagesPMController',
    resolve: {
      user: function ($auth) {
        return $auth.getUser();
      }
    }
  });
  $routeProvider.when('/messages/chat/:chatId', {
    templateUrl: '/app/modules/messages/templates/chat.html',
    controller: 'MessagesChatController',
    resolve: {
      user: function ($auth) {
        return $auth.getUser();
      },
      chat: function ($socket, $route) {
        return $socket.get('/api/v1/chat/' + $route.current.params.chatId)
      }
    }
  });
  $routeProvider.when('/messages/to/:userId', {
    templateUrl: '/app/modules/messages/templates/chat.html',
    controller: 'MessagesChatController',
    resolve: {
      user: function ($auth) {
        return $auth.getUser();
      },
      chat: function () {
        return {};
      }
    }
  });
});
