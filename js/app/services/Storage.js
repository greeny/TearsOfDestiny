(function (angular, localStorage) {
    var game = angular.module('game');

    game.factory('storage', ['$cookies', function ($cookies) {

        /*var date = new Date();
        date.setFullYear(date.getFullYear() + 5);
        $cookiesProvider.defaults.expires = date;*/

        function isLocalStorageAvailable() {
            return typeof Storage !== 'undefined';
        }

        return {
            save: function (key, value) {
                if (isLocalStorageAvailable()) {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    $cookies.setObject(key, value);
                }
            },

            load: function (key, def) {
                var item;
                if (isLocalStorageAvailable()) {
                    item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : def;
                } else {
                    item = $cookies.getObject(key);
                    return item ? item : def;
                }
            },

            clear: function (key) {
                if (isLocalStorageAvailable()) {
                    localStorage.removeItem(key);
                } else {
                    $cookies.remove(key);
                }
            }
        };
    }]);
})(angular, localStorage);
