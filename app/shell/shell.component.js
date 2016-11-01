(function() {
    'use strict';

    angular.module('tcrApp')
        .component('shell', {
            templateUrl: 'shell/shell.component.html',
            controller: ShellCtrl
        });

    function ShellCtrl($mdSidenav, $rootScope, $state, Schedule) {
        var self = this;

        var cacheInitted = false;

        self.toggleList = toggleList;

        self.headerText = $state.current.data.displayName;

        self.isChangingState = false;

        self.currentState = $state.current.name;

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            self.headerText = toState.data.displayName;
            self.currentState = $state.current.name;
            self.isChangingState = false;
        });

        $rootScope.$on('$viewContentLoaded', function() {
            if(!cacheInitted) {
                Schedule.initCache().then(function() {
                    cacheInitted = true;
                });
            }
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