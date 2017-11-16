(function() {
  'use strict';

  angular
  .module('FileSelect')
  .directive("fileSelect", FileSelect);

  FileSelect.$inject = [];
  /* @ngInject */
  function FileSelect() {
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
