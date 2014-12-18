/**
 * User: abau
 * Date: 01.12.2014
 * Time: 18:11
 */
angular.module("app.messages")
  .controller("MessagesChatController", function ctrl($scope, $socket, $route, user, chat, $http, $rootScope, $timeout) {

    $scope.chat = chat;
    $scope.members = {};
    $scope.answer = '';

    $scope.answersHistory = [];

    //scrollPoint
    document.getElementById('scrollPoint').scrollIntoView();

    if(chat.members){
      for (var i = 0; i < chat.members.length; i++) {
        var member = chat.members[i];
        $scope.members[member.id] = member;
      }
    }

    io.socket.on('chat', function (data) {
      if (data.verb == 'updated') {
        $scope.$apply(function () {
          var msg = data.data;
          var old = $scope.chat.messages;
          if ($scope.chat.id == msg.id) {
            $scope.chat.messages = msg.messages;
          }
          diffMessages($scope.chat.messages, old);
        });
      }
    });

    function diffMessages(a, b) {

      var newMessages = [], i;

      for (i = 0; i < a.length; i++) {
        var messageA = a[i];
        var isNew = true;
        for (var j = 0; j < b.length; j++) {
          var messageB = b[j];
          if (messageA.id == messageB.id) {
            isNew = false;
          }
        }
        if (isNew) {
          newMessages.push(messageA);
        }
      }

      for (i = 0; i < newMessages.length; i++) {
        var message = newMessages[i];
        if (message.user != user.id) {
          console.log("notify", message);
          notify($scope.members[message.user].username + ':', {body: String(message.body).replace(/<[^>]+>/gm, ''), icon: '/images/chat-bubble.jpg'});
        }
      }
    }

    $scope.getMembers = function (chat) {
      if (!chat || !chat.members) return '';
      var out = [];

      for (var i = 0; i < chat.members.length; i++) {
        var member = chat.members[i];
        if (member.id != chat.creator) {
          out.push(member.username);
        }
      }

      return out.join(', ');
    };
    $rootScope.$route.title = 'Nachrichten von ' + $scope.getMembers(chat);

    $scope.send = function () {
      if (!$scope.answer) return;
      var answer = $scope.answer.trim();
      if (answer != '') {
        $scope.sendingMessage = true;
        answer = String(answer).replace(/<[^>]+>/gm, '');
        $http.post('/api/v1/chat/' + chat.id + '/post', {msg: answer}).finally(function () {
          $scope.answersHistory.push(answer);
          if ($scope.answersHistory.length > 50) {
            $scope.answersHistory.shift();
          }
          $timeout(function () {
            $scope.sendingMessage = false;
          }, 150);
        });
        $scope.answer = '';
      }
    };

    $scope.chatKeyEvent = function (event) {
      if (event.keyCode == 13 && event.shiftKey == false && event.type == 'keypress') { //enter
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        $scope.send();
      }
      if (event.keyCode == 38 && event.type == 'keyup') { //up
        console.log("key up");
      }
      if (event.keyCode == 40 && event.type == 'keyup') { //down
        console.log("key down");
      }
    };


    $scope.toggleNotif = function () {
      if ($scope.browserSupportsNotifications) {
        if ($scope.notificationsActive) {
          $scope.notificationsActive = false;
        } else {
          Notification.requestPermission();
          $scope.notificationsActive = true;
        }
      }
    };

    $scope.browserSupportsNotifications = !!window.Notification;
    $scope.notificationsActive = $scope.browserSupportsNotifications && Notification.permission === "granted";

    function notify(title, options) {
      if ($scope.browserSupportsNotifications && $scope.notificationsActive && Notification.permission === "granted") {
        var instance = new Notification(title, options);
      }
    }
  });
