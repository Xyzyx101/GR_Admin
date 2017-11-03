'use strict';

describe('grAdminTool.version module', function() {
  beforeEach(module('grAdminTool.version'));

  describe('grAdminTool.version directive', function() {
    it('should print current version', function() {
      module(function($provide) {
        $provide.value('version', 'TEST_VER');
      });
      inject(function($compile, $rootScope) {
        var element = $compile('<span app-version></span>')($rootScope);
        expect(element.text()).toEqual('TEST_VER');
      });
    });
  });

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.0.1');
    }));
  });
});
