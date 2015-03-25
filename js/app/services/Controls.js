(function (angular) {
    var game = angular.module('game');

    game.factory('controls', [function () {
        var controls = {
            'up': 38,
            'down': 40,
            'left': 37,
            'right': 39,
            'toggle': 32,
            'ok': 13,
            'cancel': 27
        };

        return {
            resolve: function (keyCode) {
                if (typeof keyCode !== 'undefined') {
                    for (var k in controls) {
                        if (keyCode === controls[k] && controls.hasOwnProperty(k)) {
                            return k;
                        }
                    }
                }
                return undefined;
            },

            setControl: function (action, keyCode) {
                controls[action] = keyCode;
            },

            getControl: function (action) {
                return controls[action];
            }
        };
    }]);
})(angular);
