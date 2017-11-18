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

    MasterList.Download();
    $scope.$on("MasterList:Changed", function() {
      let masterList = MasterList.GetList() || {'OptionList' : {}};
      self.masterGridOptions.data = self.masterGridOptions.data.concat(masterList['OptionList']);
    });
    ProjectMasterList.Download();
    $scope.$on("ProjectMasterList:Changed", function() {
      let projectMasterList = ProjectMasterList.GetList() || {'OptionList' : {}};
      self.masterGridOptions.data = self.masterGridOptions.data.concat(projectMasterList['OptionList']);
    });

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
      console.log('deleteFixture');
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
        if(self.selectedFixture.options.indexOf(option) === -1) {
          self.selectedFixture.options.push(option);
        }
      }
    }
    self.removeOptions = function() {
      if(self.selectedFixture == null) { return; }
      for(let i = 0; i<self.selectedFixtureOptions.length; ++i) {
        const option = self.selectedFixtureOptions[i];
        const optionIdx = self.selectedFixture.options.indexOf(option);
        if(optionIdx !== -1) {
          self.selectedFixture.options.splice(optionIdx, 1);
        }
      }
      console.log('removeOptions');
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
        { field: 'OptionID', enableHiding: false, cellTooltip: true, width: '5%', enableColumnResizing: true},
        { field: 'AssetName', enableHiding: false, cellTooltip: true, width: '20%', enableColumnResizing: true, enableFiltering: true },
        { field: 'OptionType',enableHiding: false, cellTooltip: true, width: '10%', maxWidth: 200, minWidth: 70,enableColumnResizing: true},
        { field: 'Category', enableHiding: false, cellTooltip: true, width: '12%',enableColumnResizing: true},
        { field: 'OptionDisplayName', enableHiding: false, cellTooltip: true, width: '18%',enableColumnResizing: true },
        { field: 'TechnicalName', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'Collection', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'Vendor', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true}
      ]
    };

    self.selectedMasterOptions = [];
    self.masterGridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'master row selected ' + row;
        updateSelectedOptions(self.selectedMasterOptions, [row]);
        self.selectedMasterRows = [row];
        console.log(self.selectedMasterOptions);
      });
      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        var msg = 'master rows changed ' + rows.length;
        updateSelectedOptions(self.selectedMasterOptions, rows);
        self.selectedMasterRows = rows;
        console.log(self.selectedMasterOptions);
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
        { field: 'OptionID', enableHiding: false, cellTooltip: true, width: '5%', enableColumnResizing: true},
        { field: 'AssetName', enableHiding: false, cellTooltip: true, width: '20%', enableColumnResizing: true, enableFiltering: true },
        { field: 'OptionType',enableHiding: false, cellTooltip: true, width: '10%', maxWidth: 200, minWidth: 70,enableColumnResizing: true},
        { field: 'Category', enableHiding: false, cellTooltip: true, width: '12%',enableColumnResizing: true},
        { field: 'OptionDisplayName', enableHiding: false, cellTooltip: true, width: '18%',enableColumnResizing: true },
        { field: 'TechnicalName', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'Collection', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true},
        { field: 'Vendor', enableHiding: false, cellTooltip: true, width: '10%',enableColumnResizing: true}
      ]
    };

    self.selectedFixtureOptions = [];
    self.fixtureGridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'option row selected ' + row.isSelected;
        updateSelectedOptions(self.selectedFixtureOptions, [row]);
        console.log(self.selectedFixtureOptions);
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        var msg = 'option rows changed ' + rows.length;
        updateSelectedOptions(self.selectedFixtureOptions, rows);
        console.log(self.selectedFixtureOptions);
      });
    };
  }
})();
