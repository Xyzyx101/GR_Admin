(function() {
  'use strict';

  angular
  .module('admin')
  .component('admin', {
    templateUrl: 'admin/admin.template.html',
    controller: AdminController
  })
  .directive("grFileSelect", GRFileSelect);

  AdminController.$inject = ['$scope', '$q', 'MasterList', 'FileSaver', 'Blob'];

  /* @ngInject */
  function AdminController($scope, $q, MasterList, FileSaver, Blob) {
    $scope.masterList = MasterList.List || {};
    $scope.$on("MasterList:Update", function() {
      $scope.masterList = MasterList.List();
    });


    $scope.prettyJson = true;
    $scope.saveMasterList = function() {
      var json = angular.toJson($scope.masterList, true);
      var file = new Blob([ json ], {
        type : 'application/json'
      });
      FileSaver.saveAs(file, 'MasterOptionList.json');
    }

    $scope.uploadError = '';
    $scope.uploadMessage = '';
    $scope.uploadFile = null;
    $scope.uploadEnabled = false;
    $scope.uploadMasterList = function() {
      console.log($scope.uploadFile);
      $scope.uploadError = '$scope.uploadFile'
    }
    $scope.loadFile = function(file) {
      readJsonData(file)
      .then(verifyJsonData, loadError, loadNotify)
      .then(function() {
        $scope.uploadEnabled = true;
        $scope.uploadMessage = "File verifcation passed.  Press upload to continue."
      }, loadError, loadNotify)
    }

    function readJsonData(file) {
      console.log("readJsonData");
      var deferred = $q.defer();
      var reader = new FileReader();
      reader.onload = function () {
        deferred.resolve(reader.result);
      };
      reader.onerror = function() {
        deferred.reject(reader.result);
      };
      reader.onprogress = function(e) {
        deferred.notify((e.loaded / e.total * 100) + "%");
      }
      reader.readAsText(file);
      return deferred.promise;
    }

    function verifyJsonData(data) {
      var deferred = $q.defer();
      console.log("verifyJsonData");
      console.log(data);
      var count = 0;
      window.setInterval(function() {
        deferred.notify(count++);
      }, 250);
    window.setTimeout(function() {
      deferred.resolve("good file");
    }, 3000);
      return deferred.promise;
    }

    function loadError(err) {
      $scope.uploadMessage = '';
      $scope.uploadError = err;
      $scope.uploadEnabled = false;
    }
    function loadNotify(message) {
      $scope.uploadMessage = message;
    }
  }

  GRFileSelect.$inject = [];
  /* @ngInject */
  function GRFileSelect() {
    return {
      link: function($scope,el){
        el.bind("change", function(e){
          if (!window.File || !window.FileReader || !window.Blob) {
              $scope.uploadError = "File upload is not supported in your browser"
              return;
          }
          var file = (e.srcElement || e.target).files[0];
          if(file) {
            $scope.loadFile(file)
          }
        });
      }
    }
  }
})();
