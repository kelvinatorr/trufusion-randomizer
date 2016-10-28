(function(moment) {
    'use strict';

    angular.module('tcrApp')
        .factory('Schedule', Schedule);

    function Schedule($q, $http) {
        var url = '//' + window.location.host + '/schedule.json?';

        return  {
            data: undefined,
            getData: getData
        };

        function getData(formParams) {
            var self = this;
            return $q(function(resolve, reject) {
                var startDate = moment(formParams.date).format('YYYY-MM-DD');
                var getUrl = url + 'location=' + formParams.location + '&startDate=' + startDate;
                $http.get(getUrl).then(function(response) {
                    self.data = response.data;
                    resolve(self);
                }).catch(reject);
            });
        }
    }
})(moment);
