(function(moment, idb) {
    'use strict';

    angular.module('tcrApp')
        .factory('Schedule', Schedule);

    function Schedule($q, $http) {
        const url = '//' + window.location.host + '/schedule.json?';

        const locations = ['Eastern', 'Blue Diamond', 'Summerlin'];

        const storeName = 'schedules';

        var dbPromise = null;

        return  {
            data: undefined,
            getData: getData,
            initCache: initCache
        };

        function getData(formParams) {
            var self = this;
            return $q(function(resolve, reject) {
                getDataHTTP(formParams).then(function(responseData) {
                    self.data = responseData;
                    resolve(self);
                    if(dbPromise) {
                        dbPromise.then(function(db) {
                            addToCache(db, formParams.location, responseData);
                        });
                    }
                }).catch(function() {
                    // see if it is in the cache
                    console.log('getting from cache');
                    return getDataCache(formParams).then(function(cacheData) {
                        if(cacheData !== undefined) {
                            self.data = JSON.parse(cacheData);
                            resolve(self);
                        } else {
                            reject({message: 'You are offline and there is no data cached for this day.'});
                        }
                    }).catch(reject);
                });
            });
        }

        function getDataHTTP(formParams) {
            return $q(function(resolve, reject) {
                var startDate = moment(formParams.date).format('YYYY-MM-DD');
                var getUrl = url + 'location=' + formParams.location + '&startDate=' + startDate;
                $http.get(getUrl).then(function(response) {
                    resolve(response.data);
                }).catch(reject);
            });
        }

        function getDataCache(formParams) {
            var getDataDBData = function(db) {
                var tx = db.transaction(storeName);
                var keyValStore = tx.objectStore(storeName);
                return keyValStore.get(formParams.location + '|' + moment(formParams.date).format('YYYY-MM-DD'));
            };

            if(dbPromise) {
                return dbPromise.then(getDataDBData);
            } else {
                return openDatabase().then(getDataDBData);
            }
        }

        function initCache() {
            // open the database
            return openDatabase().then(function(db) {
                return cleanCache().then(function() {
                    return db;
                });
            }).then(function(db) {
                if(!db) return;

                var promises = [];
                // get today plus 7 schedules
                locations.forEach(function(l) {
                    for(var i = 0; i < 4; i++) {
                        var paramMoment = moment().add(i, 'days');
                        var param = {location: l, date: paramMoment.toDate()};
                        promises.push(getDataHTTP(param).then(function(responseData) {
                            return addToCache(db,l, responseData);
                            //return store.put(JSON.stringify(responseData), l + '|' + paramMoment.format('YYYY-MM-DD'));
                        }));
                    }
                });
                return Promise.all(promises);
            }).then(function() {
                console.log('cache filled!');
                return;
            });
        }

        function addToCache(db,location, responseData) {
            var tx = db.transaction(storeName, 'readwrite');
            var store = tx.objectStore(storeName);
            store.put(JSON.stringify(responseData), location + '|' + responseData[0].calDate);
            return tx.complete;
        }

        function cleanCache() {
            const nowMoment = moment();
            return dbPromise.then(function(db) {
                const tx = db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                return store.openCursor();
            }).then(function logPerson(cursor) {
                if(!cursor) return;
                // check if key is in the past
                var keyDate = cursor.key.substr(cursor.key.indexOf('|') + 1);
                if(nowMoment.isAfter(keyDate, 'day') && !nowMoment.isSame(keyDate, 'day')) {
                    console.log('deleting');
                    cursor.delete();
                }
                return cursor.continue().then(logPerson);
            });
        }

        function openDatabase() {
            dbPromise = idb.open('trufusion-class-randomizer', 1, function(upgradeDb) {
                return upgradeDb.createObjectStore(storeName);
            });
            return dbPromise;

        }
    }
})(moment, idb);
