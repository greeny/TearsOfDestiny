(function (angular) {
    var game = angular.module('game');

    game.controller('GameController', ['$scope', 'game', 'menu', 'settings', '$timeout', function ($scope, game, menu, settings, $timeout) {

        $scope.state = 'menu';
        $scope.map = false;

        $scope.game = game;
        $scope.menu = menu;
        $scope.settings = settings;

        $scope.onMenuClick = function (action) {
            $scope.state = action;
        };

        $scope.startLevel = function (file) {
            game.startLevel('data/' + file + '.json?v=' + (new Date()).getTime());
            $scope.state = 'game';
        };

        $scope.getCurrentCharacter = function () {
            return game.getCharacterManager().getCurrentCharacter();
        };

        $scope.getCharacters = function () {
            return game.getCharacterManager().getCharacters();
        };

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

        $scope.deleteProgress = function () {
            settings.clearLevels();
            game.getLevel().clearLevelData();
            game.getLevel().getMap().clearMapData();
        };

        $scope.onLostFocus = function () {
            if ($scope.state === 'game') {
                $timeout(function () {
                    game.openMenu();
                }, 250);
            }
        };

        $scope.onKeyDown = function ($event) {
            if ($scope.state === 'game' && !game.getLevel().hasOpenedMenu()) {
                game.onKeyDown($event);
            }
        };

        $scope.onKeyUp = function ($event) {
            if ($scope.state === 'game' && !game.getLevel().hasOpenedMenu()) {
                game.onKeyUp($event);
            }
        };

    }]);
})(angular);
