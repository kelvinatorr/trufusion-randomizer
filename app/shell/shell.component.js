(function() {
    'use strict';

    angular.module('tcrApp')
        .component('shell', {
            templateUrl: 'shell/shell.component.html',
            controller: ShellCtrl
        });

    function ShellCtrl($mdSidenav, $rootScope, $state, $timeout) {
        var self = this;

        self.toggleList = toggleList;

        self.headerText = $state.current.data.displayName;

        self.isChangingState = false;

        self.currentState = $state.current.name;

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            $timeout(function() {
                self.headerText = toState.data.displayName;
                self.currentState = $state.current.name;
                self.isChangingState = false;
            }, 4000);

        });

        $rootScope.$on('$stateChangeStart', function() {
           // hide the ui-view and show the spinner
            self.isChangingState = true;
        });

        function toggleList() {
            $mdSidenav('left').toggle();
        }


    }
})();