(function() {
  'use strict';

  angular
  .module('admin')
  .component('masterList', {
    templateUrl: 'admin/masterList.template.html',
    controller: MasterListController
  })

/* Be careful with changes to this controller.  The project list controller is very similar but
varies enough to make using the same component difficult.  Both components use the same template */

  MasterListController.$inject = ['$scope', '$q', '$window', 'MasterList', 'FileSaver', 'Blob'];

  /* @ngInject */
  function MasterListController($scope, $q, $window, MasterList, FileSaver, Blob) {
    MasterList.Download();
    $scope.$on("MasterList:Changed", function() {
      $scope.masterList = MasterList.GetList() || {'optionList' : {}};
      $scope.gridOptions.data = $scope.masterList['optionList'];
    });

    $scope.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
      rowHeight: 25,
      showGridFooter:true,
      columnDefs: [
        { field: 'id', enableHiding: false, cellTooltip: true, width: '10%', enableColumnResizing: true},
        { field: 'assetName', enableHiding: false, cellTooltip: true, width: '20%', enableColumnResizing: true, enableFiltering: true },
        { field: 'type',enableHiding: false, cellTooltip: true, width: '10%', maxWidth: 200, minWidth: 70,enableColumnResizing: true},
        { field: 'category', enableHiding: false, cellTooltip: true, width: '12%',enableColumnResizing: true},
        { field: 'displayName', enableHiding: false, cellTooltip: true, width: '18%',enableColumnResizing: true },
        { field: 'technicalName', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'collection', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'vendor', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true}
      ]
    };
    $scope.prettyJson = true;
    $scope.saveList = function() {
      var json = angular.toJson($scope.masterList, true);
      var file = new Blob([ json ], {
        type : 'application/json'
      });
      FileSaver.saveAs(file, 'MasterOptionList.json');
    }

    $scope.uploadFile = null;
    $scope.uploadEnabled = false;
    $scope.uploadList = function() {
      MasterList.Upload($scope.masterList);
    }
    $scope.loadFile = function(file) {
      readJsonData(file)
      .then(verifyJsonData)
      .then(function(dataObj) {
        $scope.masterList = dataObj;
        $scope.gridOptions.data = $scope.masterList['optionList'];
        loadLog('File verified found ' + $scope.masterList.length + ' options');
        loadLog("Review the data below and press 'Upload' to update the database")
        $scope.uploadEnabled = true;
      })
      .catch(loadError);
    }

    function readJsonData(file) {
      var deferred = $q.defer();
      var reader = new FileReader();
      reader.onload = function () {
        deferred.resolve(reader.result);
      };
      reader.onerror = function() {
        deferred.reject(reader.result);
      };
      reader.onprogress = function(e) {
        loadLog("Loading file..." + (e.loaded / e.total * 100) + "%");
      }
      reader.readAsText(file);
      return deferred.promise;
    }

    function verifyJsonData(data) {
      var deferred = $q.defer();
      $window.setTimeout(function() {
        var dataObj;
        try {
          dataObj = angular.fromJson(data);
        } catch (e) {
          deferred.reject(e);
          return;
        }
        var tmpList;
        if(Array.isArray(dataObj['optionList'])) {
          tmpList = dataObj['optionList'];
          loadLog("optionList is an array");
        } else {
          deferred.reject("optionList is not an array");
          return;
        }
        var optionIdx = 0;
        var intervalId = $window.setInterval(function() {
          var optionStatus = verifyOption(tmpList[optionIdx]);
          if(optionStatus === true) {
            loadLog(tmpList[optionIdx]['assetName'] + ' verified');
          } else {
            $window.clearInterval(intervalId);
            deferred.reject(optionStatus);
            return;
          }
          optionIdx++;
          if(optionIdx == tmpList.length) {
            $window.clearInterval(intervalId);
            deferred.resolve(dataObj);
          }
        }, 0);
      }, 0);
      return deferred.promise;
    }

    var uniqueIDs = [];
    function verifyOption(option) {
      if (typeof option['assetName'] !== "string" || option['assetName'] === '') {
        return 'Option : ' + optionCount + ' must have a name';
      }
      if(typeof option['type'] !== "string") {
        return option['AssetName'] + ' must have a option type';
      }
      if( option['type'] !== "MaterialOption" && option['type'] !== "ModelOption" && option['type'] !== "InstancedModelOption") {
        return option['assetName'] + ' has an invalid option type';
      }
      if(typeof option['id'] !== "string" || option['id'] === '') {
        return option['assetName'] + ' must have a OptionID';
      }
      if (uniqueIDs.includes(option['id'])) {
        return option['assetName'] + ' must have a unique OptionID';
      }
      uniqueIDs.push(option['assetName']);
      if(typeof option['displayName'] !== "string" || option['displayName'] === '') {
        return option['assetName'] + ' must have a displayName';
      }
      if(typeof option['technicalName'] !== "string" || option['technicalName'] === '') {
        loadWarn( option['assetName'] + ' does not have a TechnicalName.  This will be a blank field on some reports.');
      }
      if(typeof option['collection'] !== "string" || option['collection'] === '') {
        loadWarn( option['assetName'] + ' does not have a Collection.  This will be a blank field on some reports.');
      }
      if(typeof option['vendor'] !== "string" || option['vendor'] === '') {
        loadWarn( option['assetName'] + ' does not have a Vendor.  This will be a blank field on some reports.');
      }
      if(typeof option['category'] !== "string" || option['category'] === '') {
        loadWarn( option['assetName'] + ' does not have a Category.  This will be a blank field on some reports.');
      }
      return true;
    }

    function loadError(err) {
      $scope.$broadcast("InfoConsole:Error", err);
      $scope.uploadEnabled = false;
    }
    function loadWarn(warning) {
      $scope.$broadcast("InfoConsole:Warn", warning);
    }
    function loadLog(message) {
      $scope.$broadcast("InfoConsole:Log", message);
    }
  }
})();
