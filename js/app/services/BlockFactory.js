(function (angular) {
    var game = angular.module('game');

    game.factory('blockFactory', ['$http', function ($http) {

        var blockData = undefined;
        var ready = false;

        $http.get('assets/data/blocks.json').success(function (data) {
            blockData = data;
            ready = true;
        });

        function createBlockObject(name, data) {
            var passable = data.passable;
            var burnable = data.burnable;
            var cssClasses = data.cssClasses;
            data = data.data;

            return {
                getName: function () {
                    return name;
                },

                isPassable: function (color) {
                    if (typeof passable === 'boolean') {
                        return passable;
                    } else {
                        return (color in passable ? passable[color] : false);
                    }
                },

                isBurnable: function () {
                    return burnable;
                },

                getCssClasses: function () {
                    var classes = ['block'];
                    if (typeof cssClasses === 'string') {
                        classes.push(cssClasses);
                    } else {
                        for (var k in cssClasses) {
                            if (cssClasses.hasOwnProperty(k)) {
                                classes.push(cssClasses[k]);
                            }
                        }
                    }
                    return classes;
                },

                hasData: function (key) {
                    return (key in data && data.hasOwnProperty(key));
                },

                getData: function (key) {
                    return (this.hasData(key) ? data[key] : null);
                }
            };
        }

        return {
            isReady: function () {
                return ready;
            },

            parse: function (name, data) {
                return createBlockObject(name, data);
            },

            create: function (name) {
                var data;
                if (typeof name !== 'undefined' && name in blockData && blockData.hasOwnProperty(name)) {
                    data = blockData[name];
                } else {
                    data = {
                        passable: true,
                        burnable: false,
                        cssClasses: 'air',
                        data: {}
                    };
                    name = null;
                }
                return createBlockObject(name, data);
            }
        };
    }]);
})(angular);
