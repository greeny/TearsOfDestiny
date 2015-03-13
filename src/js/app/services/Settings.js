(function (angular) {
    var game = angular.module('game');

    game.factory('settings', ['storage', function (storage) {

        return {
            clearLevels: function () {
                if (confirm('Do you really want to delete your progress?')) {
                    storage.clear('wonLevels');
                    alert('Progress deleted.');
                }
            }
        };
    }]);
})(angular);
