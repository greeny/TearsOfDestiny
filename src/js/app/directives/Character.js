(function (angular) {
    var game = angular.module('game');

    game.directive('character', function() {
        return {
            restrict: 'A',
            templateUrl: 'templates/character.html',
            scope: {
                character: '=character',
                color: '=color'
            }
        };
    });
})(angular);
