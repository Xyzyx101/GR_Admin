(function() {
  'use strict';

  angular
  .module('project')
  .component('configureOptions', {
    templateUrl: 'project/configureOptions.template.html',
    controller: ConfigureOptionsController
  });

  ConfigureOptionsController.$inject = ['$q', '$scope', 'ProjectConfig'];

  /* @ngInject */
  function ConfigureOptionsController($q, $scope, ProjectConfig) {
    var self = this;
    $scope.id = $scope.$parent.id;
    $scope.config = {};
    ProjectConfig.Load($scope.id)
    .then(function(projectConfig) {
      $scope.config = projectConfig;
    });

    self.save = function() {
      // TODO verify config is good before save
      verifyConfig()
      .then(function(message) {
        infoLog(message);
      }).then(function() {
        return ProjectConfig.Save($scope.id, $scope.config);
      }).then(function(message) {
        infoLog(message);
      }).catch(function(err) {
        infoError(err);
      });
    }

    function verifyConfig() {
      var deferred =  $q.defer();
      infoLog('Verifying Config...');
      infoWarn('TODO this verification process is incomplete and does nothing...');
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
