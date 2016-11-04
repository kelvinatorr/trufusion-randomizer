(function() {
    'use strict';

    angular.module('tcrApp')
        .component('scheduleDisplay', {
            templateUrl: 'schedule-display/schedule-display.component.html',
            controller: ScheduleDisplay
        });

    function ScheduleDisplay(Schedule, $mdDialog, $mdToast, $timeout) {
        var $ctrl = this;

        var subscriptionEventCount = 0;

        var subscription;

        this.submit = submit;

        this.scheduleData = undefined;

        this.filter = {
            location: 'Eastern',
            date: new Date()
        };

        this.gettingData = true;

        this.$onInit = onInit;

        function onInit() {
            subscription  = Schedule.getData(this.filter).subscribe((x) => {
                subscriptionSuccess.call(this, x);
            }, () => {
                console.log('error occurred: http error');
            });

        }

        function submit(formModel) {
            if($ctrl.gettingData) return;
            // hide the list
            $ctrl.gettingData = true;
            $ctrl.scheduleData = undefined;
            // make the request
            subscription  = Schedule.getData(formModel).subscribe((data) => {
                subscriptionSuccess.call(this, data);
                this.filter = angular.copy(formModel);
                //show the list
            }, (error) => {
                if(this.scheduleData === undefined) {
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
                    $ctrl.gettingData = false;
                }

            });
        }

        function subscriptionSuccess(x) {
            if(x) {
                if(this.scheduleData === undefined) {
                    $timeout(() => this.scheduleData = x);
                } else if(!angular.equals(this.scheduleData, x)) {
                    this.scheduleData = x;
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Updated with new data from the server')
                            .hideDelay(3000)
                    );
                    console.log('data is different');
                    subscription.dispose();
                } else {
                    subscription.dispose();
                }
                this.gettingData = false;
            }
        }

    }
})();