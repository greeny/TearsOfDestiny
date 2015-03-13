(function (angular) {
    var game = angular.module('game');

    game.factory('menu', ['$http', 'storage', function ($http, storage) {

        var ready = false;
        var menuData = {};

        $http.get('data/menu.json?v=' + (new Date()).getTime()).success(function (data) {
            menuData = data;
            ready = true;
        });

        function getLevel(name) {
            return menuData.levels[name];
        }

        function getWonLevels() {
            return storage.load('wonLevels', {});
        }

        function hasLevelUnlocked(name, level) {
            if (name in getWonLevels()) {
                return true;
            }
            if (level.dependencies.length === 0) {
                return true;
            }
            for (var i in level.dependencies) {
                if (level.dependencies.hasOwnProperty(i)) {
                    if (!(level.dependencies[i] in getWonLevels())) {
                        return false;
                    }
                }
            }
            return true;
        }

        return {
            isReady: function () {
                return ready;
            },

            getLevels: function () {
                var result = {};
                var levels = menuData.levels;
                for (var k in levels) {
                    if (levels.hasOwnProperty(k)) {
                        if (hasLevelUnlocked(k, levels[k])) {
                            result[k] = levels[k];
                        }
                    }
                }
                return result;

                // TODO resolve dependencies
                // TODO add help texts
            }
        };
    }]);
})(angular);
