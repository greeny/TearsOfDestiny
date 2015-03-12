(function (angular) {
    var game = angular.module('game');

    game.directive('wrapper', function() {
        return {
            restrict: 'A',
            templateUrl: 'templates/wrapper.html'
        };
    });
})(angular);
