(function() {
    'use strict';

    angular.module('tcrApp')
        .component('shell', {
            templateUrl: 'shell/shell.component.html',
            controller: ShellCtrl
        });

    function ShellCtrl($mdSidenav) {
        var self = this;

        self.toggleList = toggleList;

        function toggleList() {
            $mdSidenav('left').toggle();
        }
    }
})();