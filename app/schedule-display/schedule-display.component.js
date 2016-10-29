(function() {
    'use strict';

    angular.module('tcrApp')
        .component('scheduleDisplay', {
            templateUrl: 'schedule-display/schedule-display.component.html',
            controller: ScheduleDisplay
        });

    function ScheduleDisplay(Schedule) {
        this.submit = function(formModel) {
            console.log('submitted');
        };

        this.scheduleData = Schedule.data;
    }
})();