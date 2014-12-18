/**
 * User: abau
 * Date: 17.12.2014
 * Time: 10:10
 */
angular.module("app.files")
  .controller("FilesGridBottomSheetController", function ctrl($scope, $mdBottomSheet) {
    $scope.close = function () {
      $mdBottomSheet.hide();
    }
  });
