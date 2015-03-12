(function (angular) {
    var game = angular.module('game');

    game.directive('menu', function() {
        return {
            restrict: 'A',
            templateUrl: 'templates/menu.html'
        };
    });
})(angular);
