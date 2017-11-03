(function() {
    'use strict';

    angular
        .module('grAdminTool.version', [
            'grAdminTool.version.version-directive'
        ])
        .value('version', '0.0.1');
})();
