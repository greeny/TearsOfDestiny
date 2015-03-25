(function (angular) {
    var game = angular.module('game');

    game.factory('game', ['characterManager', 'controls', 'level', function (characterManager, controls, level) {

        function normalizeEvent($event) {
            if ($event.which === 187) {
                $event.which = 49; // for 1 or + key on CZ keyboard
            }
            return $event;
        }

        function resolveAction(action, isKeyDown) {
            switch (action) {
                case 'left':
                case 'right':
                    characterManager.getCurrentCharacter().setMoving(action, isKeyDown);
                    break;
                case 'up':
                    characterManager.getCurrentCharacter().setJumping(isKeyDown);
                    break;
                case 'toggle':
                    if (isKeyDown) {
                        characterManager.setNextCharacter();
                    }
                    break;
                case 'cancel':
                    if (isKeyDown) {
                        level.toggleMenu();
                    }
                    break;
            }
        }

        return {
            onKeyDown: function ($event) {
                $event = normalizeEvent($event);
                var action = controls.resolve($event.which);
                if (action) {
                    $event.preventDefault();
                    resolveAction(action, true);
                }
            },

            onKeyUp: function ($event) {
                $event = normalizeEvent($event);
                var action = controls.resolve($event.which);
                if (action) {
                    $event.preventDefault();
                    resolveAction(action, false);
                }
            },

            getCharacterManager: function () {
                return characterManager;
            },

            getLevel: function () {
                return level;
            },

            startLevel: function (file) {
                this.getLevel().loadLevel(file);
            },

            openMenu: function () {
                level.openMenu();
            },

            hasOpenedMenu: function () {
                return level.hasOpenedMenu();
            },

            closeMenu: function () {
                level.closeMenu();
            }
        };
    }]);
})(angular);
