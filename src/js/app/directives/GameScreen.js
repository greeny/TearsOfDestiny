(function (angular) {
    var game = angular.module('game');

    game.directive('gameScreen', function() {
        return {
            restrict: 'A',
            templateUrl: 'templates/gameScreen.html?v=' + (new Date()).getTime()
        };
    });
})(angular);
