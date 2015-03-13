(function (angular) {
    var game = angular.module('game');

    game.factory('menu', ['$http', function ($http) {

        var ready = false;
        var menuData = {};

        $http.get('data/menu.json?v=' + (new Date()).getTime()).success(function (data) {
            menuData = data;
            ready = true;
        });

        return {
            isReady: function () {
                return ready;
            },

            getLevels: function () {
                // TODO resolve dependencies
                // TODO add help texts
                return menuData.levels;
            }
        };
    }]);
})(angular);
