(function() {
  'use strict';

  angular
  .module('admin')
  .component('masterList', {
    templateUrl: 'admin/masterList.template.html',
    controller: MasterListController
  })
  .directive("grFileSelect", GRFileSelect);

  MasterListController.$inject = ['$scope', '$q', '$window', 'MasterList', 'FileSaver', 'Blob'];

  /* @ngInject */
  function MasterListController($scope, $q, $window, MasterList, FileSaver, Blob) {
    MasterList.Download();
    $scope.$on("MasterList:Changed", function() {
      $scope.masterList = MasterList.GetList() || {'OptionList' : {}};
      $scope.gridOptions.data = $scope.masterList['OptionList'];
    });

    $scope.gridOptions = {
      enableFiltering: true,
      enableSorting: true,
      columnDefs: [
        { field: 'OptionID', enableHiding: false, cellTooltip: true, width: '10%', enableColumnResizing: true},
        { field: 'AssetName', enableHiding: false, cellTooltip: true, width: '20%', enableColumnResizing: true, enableFiltering: true },
        { field: 'OptionType',enableHiding: false, cellTooltip: true, width: '10%', maxWidth: 200, minWidth: 70,enableColumnResizing: true},
        { field: 'Category', enableHiding: false, cellTooltip: true, width: '12%',enableColumnResizing: true},
        { field: 'OptionDisplayName', enableHiding: false, cellTooltip: true, width: '18%',enableColumnResizing: true },
        { field: 'TechnicalName', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'Collection', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'Vendor', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true}
      ]
    };
    $scope.prettyJson = true;
    $scope.saveMasterList = function() {
      var json = angular.toJson($scope.masterList, true);
      var file = new Blob([ json ], {
        type : 'application/json'
      });
      FileSaver.saveAs(file, 'MasterOptionList.json');
    }

    $scope.uploadFile = null;
    $scope.uploadEnabled = false;
    $scope.uploadMasterList = function() {
      MasterList.Upload($scope.masterList);
    }
    $scope.loadFile = function(file) {
      readJsonData(file)
      .then(verifyJsonData)
      .then(function(dataObj) {
        $scope.masterList = dataObj["OptionList"];
        $scope.gridOptions.data = $scope.masterList['OptionList'];
        loadLog('File verified');
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
        if(Array.isArray(dataObj['OptionList'])) {
          tmpList = dataObj['OptionList'];
          loadLog("OptionList is an array");
        } else {
          deferred.reject("OptionList is not an array");
          return;
        }
        var optionIdx = 0;
        var intervalId = $window.setInterval(function() {
          var optionStatus = verifyOption(tmpList[optionIdx]);
          if(optionStatus === true) {
            loadLog(tmpList[optionIdx]['AssetName'] + ' verified');
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
      if (typeof option['AssetName'] !== "string" || option['AssetName'] === '') {
        return 'Option : ' + optionCount + ' must have a name';
      }
      if(typeof option['OptionType'] !== "string") {
        return option['AssetName'] + ' must have a option type';
      }
      if( option['OptionType'] !== "MaterialOption" && option['OptionType'] !== "ModelOption" && option['OptionType'] !== "InstancedModelOption") {
        return option['AssetName'] + ' has an invalid option type';
      }
      if(typeof option['OptionID'] !== "string" || option['OptionID'] === '') {
        return option['AssetName'] + ' must have a OptionID';
      }
      if (uniqueIDs.includes(option['OptionID'])) {
        return option['AssetName'] + ' must have a unique OptionID';
      }
      uniqueIDs.push(option['AssetName']);
      if(typeof option['OptionDisplayName'] !== "string" || option['OptionDisplayName'] === '') {
        return option['AssetName'] + ' must have a OptionDisplayName';
      }
      if(typeof option['TechnicalName'] !== "string" || option['TechnicalName'] === '') {
        loadWarn( option['AssetName'] + ' does not have a TechnicalName.  This will be a blank field on some reports.');
      }
      if(typeof option['Collection'] !== "string" || option['Collection'] === '') {
        loadWarn( option['AssetName'] + ' does not have a Collection.  This will be a blank field on some reports.');
      }
      if(typeof option['Vendor'] !== "string" || option['Vendor'] === '') {
        loadWarn( option['AssetName'] + ' does not have a Vendor.  This will be a blank field on some reports.');
      }
      if(typeof option['Category'] !== "string" || option['Category'] === '') {
        loadWarn( option['AssetName'] + ' does not have a Category.  This will be a blank field on some reports.');
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

  GRFileSelect.$inject = [];
  /* @ngInject */
  function GRFileSelect() {
    return {
      link: function($scope,el){
        el.bind("change", function(e){
          $scope.uploadEnabled = false;
          $scope.$broadcast("InfoConsole:Clear");
          if (!window.File || !window.FileReader || !window.Blob) {
            loadError("File upload is not supported in your browser");
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
