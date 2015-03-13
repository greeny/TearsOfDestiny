(function (angular) {
    var game = angular.module('game');

    game.directive('character', function() {
        return {
            restrict: 'A',
            templateUrl: 'templates/character.html?v=' + (new Date()).getTime(),
            scope: {
                character: '=character',
                color: '=color'
            }
        };
    });
})(angular);
