(function(Math) {
    'use strict';

    angular.module('tcrApp')
        .component('randomizer', {
            templateUrl: 'randomizer/randomizer.component.html',
            controller: RandomizerCtrl
        });

    function RandomizerCtrl(Schedule, $timeout, $mdDialog) {
        var self = this;

        self.selectedSchedule = null;

        self.gettingData = false;

        self.randomizerDone = false;

        self.randomize = function(formModel) {
            if(self.gettingData) return;

            self.gettingData = true;
            self.selectedSchedule = {};

            Schedule.getDataHTTPFirst(formModel).then(function(scheduleData) {
                self.scheduleData = scheduleData;
                var selectedIndex = Math.floor(Math.random() * self.scheduleData.length);
                self.gettingData = false;
                // randomly different schedules for 3 seconds
                self.randomizerDone = false;
                Promise.all(_runSlotMachineLook()).then(function() {
                    $timeout(function() {
                        // show randomly selected schedule
                        self.selectedSchedule = self.scheduleData[selectedIndex];
                        self.randomizerDone = true;
                    });
                });
            }).catch((error) => {
                var errorMessage = error && error.message ? error.message : 'Solar flares? Solar flares.';
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('An error occurred')
                        .ariaLabel('An error occurred')
                        .textContent(errorMessage)
                        .ok('Okay')
                        .openFrom('#filterSubmit')
                );
                self.gettingData = false;
            });
        };

        function _runSlotMachineLook() {
            self.selectedSchedule = self.scheduleData[Math.floor(Math.random() * self.scheduleData.length)];
            var totalWait = 5000;
            var wait = 0;
            var counter = 0;
            var allTimeouts = [];
            while (totalWait > wait) {
                wait += 50 + (counter * 50);
                var promise = $timeout(function() {
                    // make it more "random"
                    var newIndex = Math.floor(Math.random() * self.scheduleData.length);
                    if(newIndex !==  self.selectedSchedule) {
                        self.selectedSchedule = self.scheduleData[newIndex];
                    } else {
                        self.selectedSchedule = self.scheduleData[Math.floor(Math.random() * self.scheduleData.length)];
                    }
                }, wait);
                allTimeouts.push(promise);
                counter += 1;
            }
            return allTimeouts;
        }



    }
})(Math);
