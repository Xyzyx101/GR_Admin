(function() {
  'use strict';

  angular
  .module('project')
  .component('configureOptions', {
    templateUrl: 'project/configureOptions.template.html',
    controller: ConfigureOptionsController
  });

  ConfigureOptionsController.$inject = ['$q', '$scope', 'ProjectConfig', 'MasterList', 'ProjectMasterList'];

  /* @ngInject */
  function ConfigureOptionsController($q, $scope, ProjectConfig, MasterList, ProjectMasterList) {
    var self = this;
    $scope.id = $scope.$parent.id;
    $scope.config = {};
    ProjectConfig.Load($scope.id)
    .then(function(projectConfig) {
      $scope.config = projectConfig;
      convertStorageTypesToDisplay($scope.config);
    });

    $scope.masterList = {'optionList': []};

    MasterList.Download();
    $scope.$on("MasterList:Changed", function() {
      let masterList = MasterList.GetList() || {'optionList' : []};
      $scope.masterList['optionList'] = $scope.masterList['optionList'].concat(masterList['optionList']);
    });
    ProjectMasterList.Download();
    $scope.$on("ProjectMasterList:Changed", function() {
      let projectMasterList = ProjectMasterList.GetList() || {'optionList' : []};
      $scope.masterList['optionList'] = $scope.masterList['optionList'].concat(projectMasterList['optionList']);
    });

    /***************
    The two conversion functions below 'convertStorageTypesToDisplay' and 'convertDisplayTypesToStorage' are required
    because when the user is configuring palettes and fixtures I need access to complete option and fixture objects
    so I can display the name etc.  The data saved in the db replaces these duplicate objects with just the id as a string.
    The string id are replaced with the duplicate object when the config is pulled back out of the database.
    ****************/

    function convertStorageTypesToDisplay(config) {
      if(config.fixtures) {
        for(let fixIdx = 0; fixIdx < config.fixtures.length; ++fixIdx) {
          let fixture = config.fixtures[fixIdx];
          if(fixture.defaultOption && typeof fixture.defaultOption  === 'string') {
            let option = getOptionByID(fixture.defaultOption);
            if(option !== null) {
              fixture.defaultOption = option;
            }
          }
          if(fixture.options) {
            for(let optionIdx = 0; optionIdx < fixture.options.length; ++optionIdx) {
              if(fixture.options[optionIdx] && typeof fixture.options[optionIdx] === 'string') {
                let option = getOptionByID(fixture.options[optionIdx]);
                if(option !== null) {
                  fixture.options[optionIdx] = option;
                }
              }
            }
          }
        }
      }
      if(config.palettes) {
        for(let paletteIdx = 0; paletteIdx < config.palettes.length; ++paletteIdx) {
          let palette = config.palettes[paletteIdx];
          if(palette.selections) {
            for(let selectionIdx = 0; selectionIdx < palette.selections.length; ++selectionIdx) {
              if(typeof palette.selections[selectionIdx].fixture === 'string') {
                let fixture = getFixtureByID(palette.selections[selectionIdx].fixture);
                if(fixture !== null) {
                  palette.selections[selectionIdx].fixture = fixture;
                }
              }
              if(typeof palette.selections[selectionIdx].option === 'string') {
                let option = getOptionByID(palette.selections[selectionIdx].option);
                if(option !== null) {
                  palette.selections[selectionIdx].option = option;
                }
              }
            }
          }
        }
      }
    }

    function convertDisplayTypesToStorage(config) {
      if(config.fixtures) {
        for(let i = 0; i < config.fixtures.length; ++i) {
          let fixture = config.fixtures[i];
          if(fixture.defaultOption) {
            fixture.defaultOption = fixture.defaultOption.id;
          }
          if(fixture.options) {
            for(let j = 0; j < fixture.options.length; ++j) {
              fixture.options[j] = fixture.options[j].id;
            }
          }
        }
      }
      if(config.palettes) {
        for(let i = 0; i < config.palettes.length; ++i) {
          let palette = config.palettes[i];
          if(palette.selections) {
            for(let j = 0; j < palette.selections.length; ++j) {
              if(palette.selections[j].option) {
                palette.selections[j].option = palette.selections[j].option.id;
              }
              palette.selections[j].fixture = palette.selections[j].fixture.id;
            }
          }
        }
      }
    }

    function getOptionByID(id) {
      if($scope.masterList['optionList']) {
        for(let i = 0; i < $scope.masterList['optionList'].length; ++i) {
          if($scope.masterList['optionList'][i].id === id) {
            return $scope.masterList['optionList'][i];
          }
        }
      }
      return null;
    }

    function getFixtureByID(id) {
      if($scope.config && $scope.config.fixtures) {
        for(let i = 0; i < $scope.config.fixtures.length; ++i) {
          if($scope.config.fixtures[i].id === id) {
            return $scope.config.fixtures[i];
          }
        }
      }
      return null;
    }

    self.save = function() {
      convertDisplayTypesToStorage($scope.config);
      verifyConfig()
      .then(function(message) {
        infoLog(message);
      }).then(function() {
        return ProjectConfig.Save($scope.id, $scope.config);
      }).then(function(message) {
        infoLog(message);
      }).catch(function(err) {
        infoError(err);
        infoError('Save aborted');
      }).finally(function() {
        convertStorageTypesToDisplay($scope.config);
      });
    }

    // It is expected that the data will be converted to the storage version before this test
    function verifyConfig() {
      var deferred =  $q.defer();
      $scope.$broadcast("InfoConsole:Clear");
      infoLog('Verifying Config...');
      if($scope.config.fixtures && $scope.config.fixtures.length > 0) {
        let uniqueFixIds = [];
        for(let fixIdx = 0; fixIdx < $scope.config.fixtures.length; ++fixIdx) {
          const fixture = $scope.config.fixtures[fixIdx];
          if(!/^[a-z\d-]+$/.test(fixture.id)) {
            infoError(fixture.id + ' is an invalid ID.  Should contain lowercase letters, numbers, and dashes only');
            deferred.reject('Verification Failed!');
          }
          if(uniqueFixIds.indexOf(fixture.id) !== -1) {
            infoError(fixture.id + ' is not unique');
            deferred.reject('Verification Failed!');
          }
          uniqueFixIds.push(fixture.id);
          if(!fixture.displayText) {
            infoWarn(fixture.id + ' has a blank display text field.  This will show up as a blank button and is probably wrong.');
          }
          if(!fixture.categoryText) {
            infoWarn(fixture.id + ' has a blank category text field.  This will go in a default category and is probably wrong.');
          }
          if(fixture.options.length == 0) {
            infoError(fixture.id + ' has no options assigned');
            deferred.reject('Verification Failed!');
          }
          if(!fixture.defaultOption) {
            infoLog(fixture.id + ' has no default option.  The first option in the list will be used as default.');
          }
          for(let optionIdx = 0; optionIdx < fixture.options.length; ++optionIdx) {
            let option = getOptionByID(fixture.options[optionIdx]);
            if(fixture.type != option.type) {
              infoError(fixture.id + ' with type ' + fixture.type + ' contains option ' + option.displayName + ' with invalid type ' + option.type);
              deferred.reject('Verification Failed!');
            }
          }
        }
      } else {
        infoError('Config contains no fixtures.  This will do nothing.');
        deferred.reject('Verification Failed!');
      }

      if($scope.config.palettes && $scope.config.palettes.length > 0 ) {
        let uniquePaletteIds = [];
        let hasDefaultPalette = false;
        for(let paletteIdx = 0; paletteIdx < $scope.config.palettes.length; ++paletteIdx) {
          const palette = $scope.config.palettes[paletteIdx];
          if(!/^[a-z\d-]+$/.test(palette.id)) {
            infoError(palette.id + ' is an invalid ID.  Should contain lowercase letters, numbers, and dashes only');
            deferred.reject('Verification Failed!');
          }
          if(uniquePaletteIds.indexOf(palette.id) !== -1) {
            infoError(palette.id + ' is not unique');
            deferred.reject('Verification Failed!');
          }
          uniquePaletteIds.push(palette.id);
          if(palette.default) {
            hasDefaultPalette = true
          }
        }
        if(!hasDefaultPalette) {
          infoLog("No default palette set.  The palette will fall back to the first one in the list.")
        }
      } else {
        infoLog('Config contains no palettes.  All fixtures will use default options.')
      }
      deferred.resolve('Verification Passed');
      return deferred.promise;
    }

    function infoLog(message) {
      $scope.$broadcast("InfoConsole:Log", message);
    }
    function infoWarn(warning) {
      $scope.$broadcast("InfoConsole:Warn", warning);
    }
    function infoError(err) {
      $scope.$broadcast("InfoConsole:Error", err);
    }
  }
})();
