(function() {
  'use strict';

  angular
  .module('project')
  .component('fixture', {
    templateUrl: 'project/fixture.template.html',
    controller: FixtureController
  });

  FixtureController.$inject = ['$scope', 'MasterList', 'ProjectMasterList'];

  /* @ngInject */
  function FixtureController($scope, MasterList, ProjectMasterList) {
    var self = this;
    var projectId = $scope.$parent.id

    self.createFixture = function() {
      if(typeof $scope.$parent.config.fixtures === 'undefined') {
        $scope.$parent.config.fixtures = [];
      }
      var newFixture = {
        id: uniqueFixtureId(),
        displayText: 'New Fixture',
        categoryText: '',
        options: [],
        defaultOption: ''
      }
      $scope.$parent.config.fixtures.push(newFixture);
    }
    self.deleteFixture = function() {
      if(self.selectedFixture == null) { return; }
      var idx = $scope.$parent.config.fixtures.indexOf(self.selectedFixture);
      $scope.$parent.config.fixtures.splice(idx, 1);
      self.selectedFixture = null;
    }
    function uniqueFixtureId() {
      var newIdx = 0;
      var id = 'fixture' + newIdx;
      var uniqueName;
      while(!uniqueName) {
        uniqueName = true;
        for(let i=0; i < $scope.$parent.config.fixtures.length; ++i) {
          if($scope.$parent.config.fixtures[i].id == id) {
            id = 'fixture' + ++newIdx;
            uniqueName = false
            break;
          }
        }
      }
      return id;
    }

    self.selectedFixture = null;
    self.selectFixture = function(fixture) {
      self.selectedFixture = fixture;
      self.selectedFixture.options = self.selectedFixture.options || [];
      self.fixtureGridOptions.data = self.selectedFixture.options;
    }

    self.addOptions = function() {
      if(self.selectedFixture == null) { return; }
      for(let i = 0; i<self.selectedMasterOptions.length; ++i) {
        const option = self.selectedMasterOptions[i];
        let alreadyInList = false;
        for(let j = 0; j<self.selectedFixture.options.length; ++j) {
          if(self.selectedFixture.options[j].id == option.id) {
            alreadyInList = true;
            break;
          }
        }
        if(!alreadyInList) {
          self.selectedFixture.options.push(option);
        }
      }
      self.fixtureGridApi.selection.clearSelectedRows();
      $scope.selectedFixtureOptions = [];
    }
    self.removeOptions = function() {
      if(self.selectedFixture == null) { return; }
      for(let i = 0; i<$scope.selectedFixtureOptions.length; ++i) {
        const option = $scope.selectedFixtureOptions[i];
        const optionIdx = self.selectedFixture.options.indexOf(option);
        if(optionIdx !== -1) {
          self.selectedFixture.options.splice(optionIdx, 1);
        }
      }
      self.fixtureGridApi.selection.clearSelectedRows();
      $scope.selectedFixtureOptions = [];
    }
    self.setDefaultOption = function() {
      if(self.selectedFixture == null) { return; }
      if($scope.selectedFixtureOptions.length > 0) {
        self.selectedFixture.defaultOption = $scope.selectedFixtureOptions[0];
      }
    }

    self.fixtureTypes = ['MaterialOption', 'ModelOption', 'InstancedModelOption'];

    self.masterGridOptions = {
      data: [],
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableSelectAll: true,
      selectionRowHeaderWidth: 30,
      rowHeight: 25,
      showGridFooter:true,
      columnDefs: [
        { field: 'id', enableHiding: false, cellTooltip: true, width: '5%', enableColumnResizing: true},
        { field: 'assetName', enableHiding: false, cellTooltip: true, width: '20%', enableColumnResizing: true, enableFiltering: true },
        { field: 'type',enableHiding: false, cellTooltip: true, width: '10%', maxWidth: 200, minWidth: 70,enableColumnResizing: true},
        { field: 'category', enableHiding: false, cellTooltip: true, width: '12%',enableColumnResizing: true},
        { field: 'displayName', enableHiding: false, cellTooltip: true, width: '18%',enableColumnResizing: true },
        { field: 'technicalName', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'collection', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'vendor', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true}
      ]
    };
    self.masterGridOptions.data = $scope.$parent.masterList['optionList'];
    $scope.$on("MasterList:Changed", function() {
        self.masterGridOptions.data = $scope.$parent.masterList['optionList'];
    });
    $scope.$on("ProjectMasterList:Changed", function() {
      self.masterGridOptions.data = $scope.$parent.masterList['optionList'];
    })

    self.selectedMasterOptions = [];
    self.masterGridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.masterGridApi = gridApi;
      self.masterGridApi.selection.on.rowSelectionChanged($scope,function(row){
        updateSelectedOptions(self.selectedMasterOptions, [row]);
      });
      self.masterGridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        updateSelectedOptions(self.selectedMasterOptions, rows);
      });
    };

    function updateSelectedOptions(array, rows) {
      for(let i=0; i<rows.length;++i) {
        if(rows[i].isSelected) {
          array.push(rows[i].entity);
        } else {
          const idx = array.indexOf(rows[i].entity);
          if(idx != -1) {
            array.splice(idx, 1);
          }
        }
      }
    }

    self.fixtureGridOptions = {
      data: [],
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      enableSelectAll: true,
      selectionRowHeaderWidth: 30,
      rowHeight: 25,
      showGridFooter:true,
      columnDefs: [
        { field: 'displayName', enableHiding: false, cellTooltip: true, width: '30%',enableColumnResizing: true },
        { field: 'category', enableHiding: false, cellTooltip: true, width: '15%',enableColumnResizing: true},
        { field: 'technicalName', enableHiding: false, cellTooltip: true, width: '16%',enableColumnResizing: true},
        { field: 'collection', enableHiding: false, cellTooltip: true, width: '16%',enableColumnResizing: true},
        { field: 'vendor', enableHiding: false, cellTooltip: true, width: '15%',enableColumnResizing: true},
        { field: 'type',enableHiding: false, cellTooltip: true, width: '8%', maxWidth: 200, minWidth: 70,enableColumnResizing: true}
      ]
    };

    $scope.selectedFixtureOptions = [];
    self.fixtureGridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.fixtureGridApi = gridApi;
      self.fixtureGridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'option row selected ' + row.isSelected;
        updateSelectedOptions($scope.selectedFixtureOptions, [row]);
      });

      self.fixtureGridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        var msg = 'option rows changed ' + rows.length;
        updateSelectedOptions($scope.selectedFixtureOptions, rows);
      });
    };
  }
})();
