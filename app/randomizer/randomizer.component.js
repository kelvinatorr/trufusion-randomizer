(function() {
    'use strict';

    angular.module('tcrApp')
        .component('randomizer', {
            templateUrl: 'randomizer/randomizer.component.html',
            controller: RandomizerCtrl
        });

    function RandomizerCtrl() {
        this.formModel = {
            location: 'Eastern',
            date: new Date()
        };
    }
})();
