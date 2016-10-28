(function(Math) {
    'use strict';

    angular.module('tcrApp')
        .component('randomizer', {
            templateUrl: 'randomizer/randomizer.component.html',
            controller: RandomizerCtrl
        });

    function RandomizerCtrl(Schedule) {
        var self = this;

        self.formModel = {
            location: 'Eastern',
            date: new Date()
        };

        self.scheduleData = Schedule.data;

        self.selectedSchedule = null;

        self.randomize = function(formModel) {
            Schedule.getData(formModel).then(function() {
                self.scheduleData = Schedule.data;
                var selectedIndex = Math.floor(Math.random() * self.scheduleData.length);
                // todo randomly different schedules for 3 seconds
                //
                self.selectedSchedule = self.scheduleData[selectedIndex];
            });
        }

    }
})(Math);
