/**
 * Created by Kelvin on 10/29/2016.
 */
(function() {
    'use strict';

    angular.module('tcrApp')
        .component('classFilter', {
            templateUrl: 'class-filter/class-filter.component.html',
            controller: ClassFilter,
            bindings: {
                submit: '&'
            }
        });

    function ClassFilter($state) {
        this.formModel = {
            location: 'Eastern',
            date: new Date()
        };

        this.action = $state.current.data.action;

        this.previousDay = function() {
            this.formModel.date = moment(this.formModel.date).add(-1, 'd').toDate();
        };

        this.nextDay = function() {
            this.formModel.date = moment(this.formModel.date).add(1, 'd').toDate();
        };


    }
})();