(function (angular) {
    var game = angular.module('game');

    game.factory('level', ['$interval', '$http', 'map', 'characterManager', 'pathingResolver', 'storage', function ($interval, $http, map, characterManager, pathingResolver, storage) {

        var loading = false;
        var name = '';
        var key = '';
        var description = '';
        var won = 0;
        var file = '';
        var openedMenu = false;

        function isReady() {
            return !loading;
        }

        function onTick() {
            if (isReady()) {
                var win = true;
                var characters = characterManager.getCharacters();
                for (var color in characters) {
                    if (characters.hasOwnProperty(color)) {
                        processTick(characters[color]);
                        if (!checkForWin(characters[color])) {
                            win = false;
                        }
                    }
                }
                if (win && won < 10) { // delayed victory message
                    won++;
                    if (won === 10) { // the actual victory
                        openedMenu = true;
                        var levels = storage.load('wonLevels', {});
                        levels[key] = 1;
                        storage.save('wonLevels', levels);
                    }
                }
            }
        }

        function processTick(character) {

            var delta;

            if (character.isMoving('left') && !character.isMoving('right')) {
                character.updatePosition(-pathingResolver.getLeftSpeed(character), 0);
            } else if (character.isMoving('right') && !character.isMoving('left')) {
                character.updatePosition(pathingResolver.getRightSpeed(character), 0);
            }

            if (character.isJumping() || character.getJumpSpeed() !== undefined) {
                if (character.getJumpSpeed() === undefined) {
                    character.setJumpSpeed(character.getColor() === 'yellow' ? 16 : 11);
                }

                if (character.getJumpSpeed() > 0) {
                    character.updatePosition(0, delta = -pathingResolver.getJumpHeight(character));
                    character.setJumpSpeed(character.getJumpSpeed() - 1);
                    if (delta < character.getJumpSpeed || delta === 0) {
                        character.setJumpSpeed(0);
                    }
                } else if (character.getJumpSpeed() < 0) {
                    character.updatePosition(0, delta = pathingResolver.getFallHeight(character));
                    character.setJumpSpeed(character.getJumpSpeed() - 1);
                    if (delta > -character.getJumpSpeed || delta === 0) {
                        character.setJumpSpeed(undefined);
                    }
                } else {
                    character.setJumpSpeed(-1);
                }
            } else {
                if (character.getJumpSpeed() === undefined) {
                    character.setJumpSpeed(0);
                }
                character.setJumpSpeed(character.getJumpSpeed() - 1);
                character.updatePosition(0, delta = pathingResolver.getFallHeight(character));
                if (delta > -character.getJumpSpeed || delta === 0) {
                    character.setJumpSpeed(undefined);
                }
            }
        }

        function checkForWin(character) {
            var point = map.getPoint(character.getMapX(), character.getMapY());
            return point.hasData('exit') && point.getData('exit') === character.getColor();
        }

        $interval(onTick, (1000 / 40));

        return {
            isWon: function () {
                return won >= 10;
            },

            isReady: function () {
                return isReady();
            },

            clearLevelData: function () {
                won = 0;
                name = '';
                key = '';
                description = '';
                openedMenu = false;
            },

            loadLevel: function (path) {
                this.clearLevelData();
                loading = true;
                file = path;
                $http.get(path).success(function (data) {
                    map.setMapData(data.map);
                    name = data.name;
                    key = data.key;
                    description = data.description;
                    characterManager.purge();
                    var ch = data.characters;
                    for (var color in ch) {
                        if (ch.hasOwnProperty(color)) {
                            characterManager.addCharacter(color, ch[color]);
                        }
                    }
                    loading = false;
                });
            },

            getName: function () {
                return name;
            },

            getFile: function () {
                return file;
            },

            getMap: function () {
                return map;
            },

            openMenu: function () {
                openedMenu = true;
            },

            toggleMenu: function () {
                openedMenu = !openedMenu;
            },

            closeMenu: function () {
                openedMenu = false;
            },

            hasOpenedMenu: function () {
                return openedMenu;
            }
        };
    }]);
})(angular);
