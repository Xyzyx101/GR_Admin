(function() {
  'use strict';

  angular
  .module('project')
  .component('palette', {
    templateUrl: 'project/palette.template.html',
    controller: PaletteController
  });

  PaletteController.$inject = ['$scope'];

  /* @ngInject */
  function PaletteController($scope) {
    var self = this;
    var projectId = $scope.$parent.id

    self.createPalette = function() {
      if(typeof $scope.$parent.config.palettes === 'undefined') {
        $scope.$parent.config.palettes = [];
      }
      var newPalette = {
        id: uniquePaletteId(),
        displayText: 'New Palette',
        default : false,
        selections: []
      }
      $scope.$parent.config.palettes.push(newPalette);
      self.selectedPalette = newPalette;
      addAllFixtures(newPalette);
    }
    self.deleteFixture = function() {
      if(self.selectedFixture == null) { return; }
      var idx = $scope.$parent.config.palettes.indexOf(self.selectedPalette);
      $scope.$parent.config.palettes.splice(idx, 1);
      self.selectedPalette = null;
    }
    function uniquePaletteId() {
      var newIdx = 0;
      var id = 'palette' + newIdx;
      var uniqueName;
      while(!uniqueName) {
        uniqueName = true;
        for(let i=0; i < $scope.$parent.config.palettes.length; ++i) {
          if($scope.$parent.config.palettes[i].id == id) {
            id = 'palette' + ++newIdx;
            uniqueName = false
            break;
          }
        }
      }
      return id;
    }

    function addAllFixtures(palette) {
      for(let i = 0; i < $scope.$parent.config.fixtures.length; ++i ) {
        const fixture = $scope.$parent.config.fixtures[i];
        let paletteHasFixture = false;
        for(let j = 0; j < palette.selections.length; ++j) {
          const selection = palette.selections[j];
          if(selection.fixture.id == fixture.id) {
            paletteHasFixture = true;
            break;
          }
        }
        if(!paletteHasFixture) {
          palette.selections.push({'fixture' : fixture, 'option' : null});
        }
      }
    }

    self.selectedPalette = null;
    self.selectPalette = function(palette) {
      self.selectedPalette = palette;
    }

    self.selectedFixture = null;
    self.selectFixture = function(clickedFixture) {
      for(let i = 0; i < $scope.$parent.config.fixtures.length; ++i ) {
        const fixture = $scope.$parent.config.fixtures[i];
        if(clickedFixture.id == fixture.id) {
          // we also set clickedFixture because the user may have changed the fixture on the other tab.
          self.selectedFixture = clickedFixture = fixture;
        }
      }
      self.fixtureGridOptions.data = self.selectedFixture.options;
    }

    self.setDefaultPalette = function() {
      for(let i=0; i < $scope.$parent.config.palettes.length; ++i) {
          $scope.$parent.config.palettes[i].default = ($scope.$parent.config.palettes[i].id == self.selectedPalette.id);
      }
    }

    self.fixtureGridOptions = {
      data: [],
      enableFiltering: true,
      enableSorting: true,
      enableRowSelection: true,
      selectionRowHeaderWidth: 30,
      rowHeight: 25,
      multiSelect: false,
      columnDefs: [
        { field: 'OptionDisplayName', enableHiding: false, cellTooltip: true, width: '23%',enableColumnResizing: true },
        { field: 'OptionType',enableHiding: false, cellTooltip: true, width: '10%', maxWidth: 200, minWidth: 70,enableColumnResizing: true},
        { field: 'Category', enableHiding: false, cellTooltip: true, width: '17%',enableColumnResizing: true},
        { field: 'TechnicalName', enableHiding: false, cellTooltip: true, width: '15%',enableColumnResizing: true},
        { field: 'Collection', enableHiding: false, cellTooltip: true, width: '15%',enableColumnResizing: true},
        { field: 'Vendor', enableHiding: false, cellTooltip: true, width: '15%',enableColumnResizing: true}
      ]
    };

    self.selectedFixtureOption = null;
    self.fixtureGridOptions.onRegisterApi = function(gridApi){
      self.fixtureGridApi = gridApi;
      self.fixtureGridApi.selection.on.rowSelectionChanged($scope,function(row) {
        self.selectedFixtureOption = row.isSelected ? row.entity : null;
        console.log(self.selectedFixtureOption);
      });
    };

    self.addOption = function(selection) {
      if(self.selectedFixtureOption !== null) {
        selection.option = self.selectedFixtureOption
      }
    };
    self.removeOption = function(selection) {
      selection.option = null;
    };
  }
})();
