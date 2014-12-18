/**
 * User: abau
 * Date: 01.12.2014
 * Time: 16:27
 */
angular.module("app.messages")
  .controller("MessagesPMController", function ctrl($scope, user, $mdDialog) {

    $scope.newMessage = function ($event) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/app/modules/messages/templates/userpicker.modal.html',
        targetEvent: $event
      })
        .then(function (answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function () {
          //dialogue canceled
        });
    };

    $scope.chats = [];

    if (user) {
      io.socket.get('/api/v1/chat', {}, function (data, jwres) {
        $scope.$apply(function () {
          $scope.chats = data;
        });
        io.socket.on('chat', function (data) {
          if (data.verb == 'updated') {
            $scope.$apply(function () {
              var msg = data.data;
              for (var i = 0; i < $scope.chats.length; i++) {
                var chat = $scope.chats[i];
                if (chat.id == msg.id) {
                  $scope.chats[i].messages = msg.messages;
                }
              }
            });
          }
        });
      });
    }

    $scope.getMembers = function (chat) {
      var out = [];

      for (var i = 0; i < chat.members.length; i++) {
        var member = chat.members[i];
        if (member.id != chat.creator) {
          out.push(member.username);
        }
      }

      return out.join(', ');
    }

  });

function DialogController($scope, $mdDialog, $http, $location) {
  $scope.users = [];
  $scope.loading = false;

  $http.get('/api/v1/user').success(function (data) {
    $scope.users = data;
  });

  $scope.to = function (user) {
    $http.get('/api/v1/chat/create/' + user.id).success(function (data) {
      $mdDialog.cancel();
      $location.path('/messages/chat/' + data.id);
    });
    $scope.loading = true;
  };

  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
}
