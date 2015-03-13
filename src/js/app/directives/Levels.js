(function (angular) {
    var game = angular.module('game');

    game.directive('levels', function() {
        return {
            restrict: 'A',
            templateUrl: 'templates/levels.html?v=' + (new Date()).getTime()
        };
    });
})(angular);
