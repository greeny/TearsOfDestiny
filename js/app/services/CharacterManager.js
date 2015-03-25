(function (angular) {
    var game = angular.module('game');

    game.factory('characterManager', ['characterFactory', function (characterFactory) {
        var characters = {};
        var currentCharacter = undefined;

        return {
            purge: function () {
                currentCharacter = undefined;
                characters = {};
            },

            addCharacter: function (color, character) {
                if (!(color in characters)) {
                    characters[color] = characterFactory(color, character);
                    if (typeof currentCharacter === 'undefined') {
                        currentCharacter = color;
                    }
                }
            },

            getCharacter: function (color) {
                if (color in characters) {
                    return characters[color];
                }
            },

            setCurrentCharacter: function (color) {
                if (color in characters) {
                    var character = this.getCurrentCharacter();
                    if (character) {
                        var movingLeft = character.isMoving('left');
                        var movingRight = character.isMoving('right');
                        var jumping = character.isJumping();
                        character.setMoving('left', false);
                        character.setMoving('right', false);
                        character.setJumping(false);
                    }
                    currentCharacter = color;
                    if (character) {
                        var current = this.getCurrentCharacter();
                        current.setMoving('left', movingLeft);
                        current.setMoving('right', movingRight);
                        current.setJumping(jumping);
                    }
                }
            },

            getCurrentCharacter: function () {
                if (typeof currentCharacter !== 'undefined') {
                    return this.getCharacter(currentCharacter);
                }
            },

            getCharacters: function () {
                return characters;
            },

            setNextCharacter: function () {
                var next = false;
                var first = false;
                for (var key in characters) {
                    if (!first) {
                        first = key;
                    }
                    if (key === currentCharacter && characters.hasOwnProperty(key)) {
                        next = true;
                    } else if (next) {
                        next = false;
                        this.setCurrentCharacter(key);
                        break;
                    }
                }
                if (next) {
                    this.setCurrentCharacter(first);
                }
                return this;
            }
        };
    }]);
})(angular);
