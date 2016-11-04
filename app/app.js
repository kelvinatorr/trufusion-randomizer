(function () {
    var app = angular.module('tcrApp', ['ngMaterial', 'ngAria', 'ngAnimate', 'ui.router']);

    app.config(['$compileProvider', '$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$mdIconProvider', '$mdThemingProvider', AppConfig]);

    function AppConfig($compileProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $mdIconProvider, $mdThemingProvider) {
        $urlMatcherFactoryProvider.caseInsensitive(true);
        // ignore trailing slashes.
        $urlMatcherFactoryProvider.strictMode(false);

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                template: '<shell></shell>'
            })
            .state('randomizer', {
                parent: 'app',
                url: '/randomizer',
                template: '<randomizer></randomizer>',
                data: {
                    displayName: 'TF Random Class Picker',
                    action: 'randomize'
                }
            })
            .state('scheduleDisplay', {
                parent: 'app',
                url: '/schedule',
                template: '<schedule-display></schedule-display>',
                data: {
                    displayName: 'TF Schedule',
                    action: 'view'
                }
            });


        $urlRouterProvider.otherwise('/app/randomizer');

        $mdIconProvider
            .icon("menu", "./assets/svg/menu.svg", 24);

        $mdThemingProvider.theme('default')
            .primaryPalette('cyan')
            .accentPalette('deep-orange');

        // Remove debug info when in production.
        if (window.location.host.split(':')[0] != 'localhost') $compileProvider.debugInfoEnabled(false);
    }

})();
