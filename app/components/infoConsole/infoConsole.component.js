(function() {
  'use strict';

  angular
  .module('infoConsole')
  .component('infoConsole', {
    templateUrl: 'components/infoConsole/infoConsole.template.html',
    controller: InfoConsole,
  });

  InfoConsole.$inject = ['$scope', '$window'];

  /* @ngInject */
  function InfoConsole($scope, $window) {
    var self = this;
    self.messages = [];
    $scope.$on("InfoConsole:Log", function(ev, message) {
      self.messages.push({color:"{color:'primary'}", message:message});
      self.scrollToBottom();
    });
    $scope.$on("InfoConsole:Warn", function(ev, message) {
      self.messages.push({color:"{color:'yellow-800'}", message:message});
      self.scrollToBottom();
    });
    $scope.$on("InfoConsole:Error", function(ev, message) {
      self.messages.push({color:"{color:'red-600'}", message:message});
      self.scrollToBottom();
    });
    $scope.$on("InfoConsole:Clear", function() {
      self.messages = [];
      self.scrollToBottom();
    });

    self.scrollToBottom = function() {
      // the set timeout lets angular update the element
      $window.setTimeout(function(){
        var element = $window.document.getElementById('console-container');
        element.scrollTop = element.scrollHeight;
      }, 0);
    }
  }
})();
