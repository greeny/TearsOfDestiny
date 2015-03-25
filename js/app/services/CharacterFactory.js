(function (angular) {
    var game = angular.module('game');

    game.factory('characterFactory', function () {
        return function (color, data) {
            var x = typeof data.x === 'undefined' ? 0 : parseInt(data.x) * 50 + 9;
            var y = typeof data.y === 'undefined' ? 0 : parseInt(data.y) * 50 + 18;

            var position = {
                x: x,
                y: y
            };
            var moving = {
                left: false,
                right: false
            };
            var jumping = false;
            var jumpSpeed = undefined;
            return {
                getX: function () {
                    return position.x;
                },

                getY: function () {
                    return position.y;
                },

                getMapX: function () {
                    return parseInt((position.x + 24) / 50);
                },

                getMapY: function () {
                    return parseInt((position.y + 24) / 50);
                },

                updatePosition: function (x, y) {
                    position.x += x;
                    position.y += y;
                    return this;
                },

                setMapPosition: function (x, y) {
                    position.x = x * 50 + 9;
                    position.y = y * 50 + 18;
                    return this;
                },

                isJumping: function () {
                    return jumping;
                },

                setJumping: function (value) {
                    jumping = value;
                    return this;
                },

                isMoving: function (direction) {
                    if (['left', 'right'].indexOf(direction) > -1) {
                        return moving[direction];
                    }
                    return false;
                },

                setMoving: function (direction, value) {
                    if (['left', 'right'].indexOf(direction) > -1) {
                        moving[direction] = value;
                    }
                    return this;
                },

                setJumpSpeed: function (value) {
                    jumpSpeed = value;
                    return this;
                },

                getJumpSpeed: function () {
                    return jumpSpeed;
                },

                getColor: function () {
                    return color;
                },

                getCssClasses: function () {
                    var classes = {
                        character: 1,
                        standby: typeof this.getJumpSpeed() === 'undefined',
                        jumping: this.getJumpSpeed() > 0,
                        falling: this.getJumpSpeed() < 0,
                        'moving-left': this.isMoving('left'),
                        'moving-right': this.isMoving('right')
                    };
                    classes[this.getColor()] = 1;
                    return classes;
                }
            };
        };
    });
})(angular);
