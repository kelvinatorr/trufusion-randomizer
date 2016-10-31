(function() {
    'use strict';

    angular.module('tcrApp')
        .component('scheduleDisplay', {
            templateUrl: 'schedule-display/schedule-display.component.html',
            controller: ScheduleDisplay
        });

    function ScheduleDisplay(Schedule, $mdDialog) {
         var $ctrl = this;

        this.submit = submit;

        this.scheduleData = Schedule.data;

        this.filter = {
            location: 'Eastern',
            date: new Date()
        };

        this.gettingData = false;

        function submit(formModel) {
            if($ctrl.gettingData) return;
            // hide the list
            $ctrl.gettingData = true;
            // make the request
            Schedule.getData(formModel).then(function() {
                $ctrl.scheduleData = Schedule.data;
                $ctrl.filter = formModel;
                //show the list
            }).catch(function() {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('An error occurred')
                        .ariaLabel('An error occurred')
                        .ok('Okayyy')
                        .openFrom('#filterSubmit')
                );
            }).then(function() {
                $ctrl.gettingData = false;
            });
        }


    }
})();