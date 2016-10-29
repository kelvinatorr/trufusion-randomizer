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

    function ClassFilter() {
        this.formModel = {
            location: 'Eastern',
            date: new Date()
        };


    }
})();