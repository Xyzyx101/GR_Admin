'use strict';

angular.module('grAdminTool.version.version-directive', [])
.directive('appVersion', ['version', function(version) {
  return function(scope, elm, attrs) {
    elm.text(version);
  };
}]);
