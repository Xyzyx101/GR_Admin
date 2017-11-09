'use strict';

describe('InfoConsole', function() {
  beforeEach(module('infoConsole'));

  describe('infoConsole controller', function() {

    var ctrl, scope;
    beforeEach(inject(function($componentController, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $componentController('infoConsole', {
        $scope: scope
      });
    }));

    if('Should exist', function() {
      expect(scope).toBeDefined();
      expect(ctrl).toBeDefined();
    })

    it('Should add messages', function() {
      expect(ctrl.messages.length).toBe(0);
      var message = "bacon"
      scope.$broadcast("InfoConsole:Log", message);
      expect(ctrl.messages.length).toBe(1);
      expect(ctrl.messages[0].message).toBe(message);
      expect(ctrl.messages[0].color).toBe("{color:'primary'}");
    });

    it('Should add warnings', function() {
      expect(ctrl.messages.length).toBe(0);
      var message = 'beans';
      scope.$broadcast("InfoConsole:Warn", message);
      expect(ctrl.messages.length).toBe(1);
      expect(ctrl.messages[0].message).toBe(message);
      expect(ctrl.messages[0].color).toBe("{color:'yellow-800'}");
    });

    it('Should add errors', function() {
      expect(ctrl.messages.length).toBe(0);
      var message = 'whiskey';
      scope.$broadcast("InfoConsole:Error", message);
      expect(ctrl.messages.length).toBe(1);
      expect(ctrl.messages[0].message).toBe(message);
      expect(ctrl.messages[0].color).toBe("{color:'red-600'}");
    });

    it('Should clear', function() {
      expect(ctrl.messages.length).toBe(0);
      scope.$broadcast("InfoConsole:Log", "Bacon");
      expect(ctrl.messages.length).toBe(1);
      scope.$broadcast("InfoConsole:Clear");
      expect(ctrl.messages.length).toBe(0);
    });
  });
});
