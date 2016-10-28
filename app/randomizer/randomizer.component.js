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

        self.selectedSchedule = null;

        self.gettingData = false;

        self.randomize = function(formModel) {
            if(self.gettingData) return;

            self.gettingData = true;

            Schedule.getData(formModel).then(function() {
                self.scheduleData = Schedule.data;
                var selectedIndex = Math.floor(Math.random() * self.scheduleData.length);
                self.gettingData = false;
                // todo randomly different schedules for 3 seconds
                // show randomly selected schedule
                self.selectedSchedule = self.scheduleData[selectedIndex];
            });

        }

    }
})(Math);
