/**
 * User: abau
 * Date: 12.12.2014
 * Time: 15:58
 */
angular.module("app.files")
  .controller("filesController", function ctrl($scope, folder, $http, $location, $route, $upload, $q, $filter, modal, $timeout, $interval, $mdSidenav, $mdBottomSheet) {
    var $$scope = $scope;
    var forbiddenFiles = ['thumbs.db'];
    var orderBy = $filter('orderBy');

    function isImage(mime) {
      var regex = /image\/(png|jpeg)/gi;
      return regex.test(mime);
    }

    /*$scope.showGridBottomSheet = function ($event) {
     $mdBottomSheet.show({
     templateUrl: '/app/modules/files/templates/files.bottomSheet.html',
     controller: 'FilesGridBottomSheetController',
     targetEvent: $event
     });
     };*/

    $scope.rnd = function () {
      return Math.floor(Math.random() * 100);
    };

    $scope.slickIndex = 0;

    //initFolder(folder.data);
    $scope.$$folder = folder.data;
    $scope.$watch('$$folder', function (val) {
      initFolder(val);
    }, true);
    //console.log("$scope.files", $scope.files);

    $scope.target = function (file) {
      if (!isImage(file.mime)) {
        return '_blank'
      }
    };

    $scope.href = function (file) {
      if (!isImage(file.mime)) {
        return 'api/v1/file/' + file.id + '/' + file.name;
      }
    };

    function initFolder(folder) {
      $$scope.$$folder = folder;
      $$scope.folder = orderBy(folder.children, 'name');
      $$scope.files = orderBy(folder.files, 'name');
      $$scope.obj = folder;
      if (!folder.parentPath) {
        folder.parentPath = [];
      }

      $$scope.images = $$scope.files.filter(function (file) {
        return isImage(file.mime);
      });

      $$scope.clickFile = function (file, ev) {
        if (isImage(file.mime)) {
          $$scope.slickIndex = $$scope.images.indexOf(file);
          var dialog = $scope.dialog = modal('/app/modules/files/templates/carousel.modal.html', $scope, {closer: false, wrapperClass: 'slick'});
          $timeout(function () {
            dialog.open();
          }, 0, false);
        }
      };

      $scope.canGoBack = !!folder.parent;
      //console.log("folder", folder);

      $scope.goBack = function () {
        $scope.backwards = {
          isLoading: true
        };
        $location.path('/files/' + (folder.parent.id || ''));
      };

      $$scope.newFolder = function () {
        var name = prompt("Name des neuen Ordners ?", "");

        if (name != null) {
          $mdSidenav('right').close();
          $http.post('/api/v1/folder', {name: name, parent: folder.id, parentPath: folder.parentPath.concat([folder])}).success(function (data) {
            console.log("args", arguments);
            if (!($scope.folder instanceof Array)) {
              $scope.folder = [];
            }
            $scope.folder.push(data);
          })
        }
      };

      $scope.handleFolder = function (folder, event) {
        if (!event.isDefaultPrevented()) {
          $location.path('/files/' + folder.id);
        }
      };

      $scope.deleteFolder = function () {
        if (confirm("Diesen Ordner wirklich löschen ?")) {
          $http.delete('/api/v1/folder/' + folder.id).success(function () {
            $mdSidenav('right').close();
            $scope.goBack();
          });
        }
      };

      $scope.dropFiles = function () {
        if (confirm("Wirklich ALLE löschen ?")) {
          $mdSidenav('right').close();
          var done = folder.files.length > 0 ? 0 : 100;
          var max = folder.files.length;
          for (var i = 0; i < max; i++) {
            var file = folder.files[i];
            (function (file) {
              $http.delete('/api/v1/file/' + file.id).then(function () {
                done++;
                folder.determinateValue = parseInt((done / max) * 100);
                folder.files.splice(folder.files.indexOf(file), 1);
              });
            })(file);
          }
        }
      };

      $scope.determinateValue = 100;

      function filterFiles(files) {
        var array = [];
        for (var key in files) {
          var obj = files[key];
          if (obj.type != "directory") {
            console.log("files[%s]", key, obj);
            array.push(obj);
          }
        }
        return array.filter(function (el) {
          return forbiddenFiles.indexOf(el.name.toLowerCase()) == -1 && el instanceof File;
        });
      }

      function kbps(){
        var netxTickAmount = 0;
        var interval = 500; //ms
        this.atm = 0;
        var firstTick = true;
        var timeOut = null;
        this.add = function (amount) {
          if(firstTick){
            this.atm += amount;
            if(timeOut === null){
              this.startTicks();
            }
          }else{
            netxTickAmount += amount;
          }
        };
        this.tick = function () {
          if(!firstTick){
            firstTick = false;
            this.atm = netxTickAmount;
            netxTickAmount = 0;
          }
        };
        this.atm = function () {
          return this.atm;
        };
        this.startTicks = function () {
          timeOut = $interval(this.tick, interval);
        };
        this.cancel = function () {
          this.atm = netxTickAmount;
          $interval.cancel(timeOut);
        }
      }

      $scope.onFileSelect = function ($_files, $event, $rejectedFiles, _folder) {
        var kbpsBuffer = 5;
        var done = 0;
        var uploadFolder = _folder || folder;
        var uploadUrl = '/api/v1/upload/' + uploadFolder.id;
        var length = 0;
        var prms = $q(function (resolve) {
          resolve('init');
        });

        $timeout(function () {
          var $files = uploadFolder.uploads = filterFiles($_files);

          length = $files.length;

          for (var i = 0; i < length; i++) {
            $scope.determinateValue = 0;
            (function (file) {
              prms = prms.then(function () {
                return handleFileUpload(file);
              });
            })($files[i]);
          }

          uploadFolder.files = uploadFolder.files || [];
        }, 0, false);

        function genDone() {
          if (!uploadFolder.uploads.length) return 100;
          var done = length - uploadFolder.uploads.length;
          for (var i = 0; i < uploadFolder.uploads.length; i++) {
            var upload = uploadFolder.uploads[i];
            done += (upload.done || 0);
          }

          var result = (done / length) * 100;
          console.log(result, done, length);
          return result;
        }

        function handleFileUpload(file) {
          file.kbps = new kbps();
          file.uploadStarted = true;
          $$scope.$root.showUpload = false;
          var def = $q.defer();
          var lastDone = 0;
          $upload.upload({
            withCredentials: true,
            url: uploadUrl,
            file: file
          }).progress(function (evt) {
            var doneNow = evt.loaded - lastDone;
            file.kbps.add(doneNow);
            lastDone = evt.loaded;
            file.done = evt.loaded / evt.total;
            uploadFolder.determinateValue = genDone();
          }).success(function (data, status, headers, config) {
            file.kbps.cancel();
            uploadFolder.files = uploadFolder.files.concat(data);
            done++;
            uploadFolder.determinateValue = genDone();
            def.resolve();
            var index = uploadFolder.uploads.indexOf(file);
            if (index != -1) {
              uploadFolder.uploads.splice(index, 1)
            }
            if (!_folder) {
              $$scope.images = $$scope.files.filter(function (file) {
                return isImage(file.mime);
              });
            }
          });
          return def.promise;
        }
      };
    }
  });
