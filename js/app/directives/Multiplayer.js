(function (angular) {
    var game = angular.module('game');

    game.directive('multiplayer', function() {
        return {
            restrict: 'A',
            templateUrl: 'templates/multiplayer.html?v=' + (new Date()).getTime()
        };
    });
})(angular);
