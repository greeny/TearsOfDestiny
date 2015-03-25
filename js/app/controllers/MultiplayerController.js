(function (angular) {
    var game = angular.module('game');

    game.controller('MultiplayerController', ['$scope', 'lobby', function ($scope, lobby) {

        $scope.username = '';
        $scope.lobby = lobby;

    }]);
})(angular);
