(function (angular) {
    var game = angular.module('game');

    game.controller('GameController', ['$scope', 'game', function ($scope, game) {

        $scope.state = 'game';

        $scope.getCharacter = function () {
            return game.getCharacterManager().getCurrentCharacter();
        };

        $scope.getCharacters = function () {
            return game.getCharacterManager().getCharacters();
        };

        $scope.ready = false;
        $scope.focus = false;
        $scope.blockerWord = 'start';
        $scope.map = false;

        $scope.currentLevel = undefined;

        $scope.isReady = function () {
            return game.getLevel().isReady();
        };

        $scope.isWon = function () {
            return game.getLevel().isWon();
        };

        $scope.getMap = function () {
            if ($scope.isReady()) {
                return game.getLevel().getMap().getMapView();
            }
            return {};
        };

        $scope.onBlockerClicked = function () {
            $scope.focus = true;
            $scope.blockerWord = 'continue';
        };

        $scope.onLostFocus = function () {
            //$scope.focus = false;
        };

        $scope.onKeyDown = function ($event) {
            game.onKeyDown($event);
        };

        $scope.onKeyUp = function ($event) {
            game.onKeyUp($event);
        };

        game.getLevel().loadLevel('data/levels/level01.json?v=' + $.now());

    }]);
})(angular);
