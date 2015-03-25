(function (angular) {
    var game = angular.module('game');

    game.factory('pathingResolver', ['map', function (map) {

        function isStandingOnOneBlock(character) {
            var leftX = character.getX() - 1;
            var rightX = character.getX() + 31;
            return toMapCords(leftX) === toMapCords(rightX);
        }

        function hasOneBlockOnSide(character) {
            var topY = character.getY() - 1;
            var bottomY = character.getY() + 31;
            return toMapCords(topY) === toMapCords(bottomY);
        }


        function isBlockPassable(character, x, y) {
            var block = map.getPoint(x, y);
            if (!block) {
                return false;
            }
            return block.isPassable(character.getColor());
        }

        function toMapCords(value) {
            return parseInt(value / 50);
        }

        function toBrowserCords(value) {
            return parseInt(value * 50);
        }

        return {
            getFallHeight: function (character) {
                var bottom = character.getY() + 32;
                var fall = 0;
                var y = character.getMapY();
                var remainingSpeed = -character.getJumpSpeed();
                var delta;

                while (remainingSpeed > 0) {
                    if (isStandingOnOneBlock(character)) {
                        var x = character.getMapX();
                        if (!isBlockPassable(character, x, toMapCords(bottom))) {
                            return fall;
                        }
                    } else {
                        var leftX = toMapCords(character.getX());
                        var rightX = toMapCords(character.getX() + 32);
                        if (!(
                            isBlockPassable(character, leftX, toMapCords(bottom)) &&
                            isBlockPassable(character, rightX, toMapCords(bottom))
                        )) {
                            return fall;
                        }
                    }

                    delta = toBrowserCords(y + 1) - bottom;
                    if (delta >= remainingSpeed) {
                        return fall + remainingSpeed;
                    } else {
                        remainingSpeed -= delta;
                        fall += delta;
                        bottom += delta;
                        y++;
                    }
                }

                return fall;
            },

            getJumpHeight: function (character) {
                var top = character.getY();
                var jump = 0;
                var y = character.getMapY();
                var remainingSpeed = character.getJumpSpeed();
                var delta;

                while (remainingSpeed > 0) {
                    if (isStandingOnOneBlock(character)) {
                        var x = character.getMapX();
                        if (!isBlockPassable(character, x, toMapCords(top))) {
                            return jump;
                        }
                    } else {
                        var leftX = toMapCords(character.getX());
                        var rightX = toMapCords(character.getX() + 32);
                        if (!(
                            isBlockPassable(character, leftX, toMapCords(top)) &&
                            isBlockPassable(character, rightX, toMapCords(top))
                        )) {
                            return jump;
                        }
                    }

                    delta = top - toBrowserCords(y - 1);
                    if (delta >= remainingSpeed) {
                        return jump + remainingSpeed;
                    } else {
                        remainingSpeed -= delta;
                        jump += delta;
                        top -= delta;
                        y--;
                    }
                }

                return jump;
            },

            getLeftSpeed: function (character) {
                var y = character.getMapY();
                var speed = 7;
                var x;

                var delta = character.getX() - toBrowserCords(x = toMapCords(character.getX()));
                if (delta >= speed) {
                    return speed;
                } else {
                    if (hasOneBlockOnSide(character)) {
                        return isBlockPassable(character, x - 1, y) ? speed : delta;
                    } else {
                        var topY = toMapCords(character.getY() - 1);
                        var bottomY = toMapCords(character.getY() + 31);
                        return (
                            isBlockPassable(character, x - 1, topY) &&
                            isBlockPassable(character, x - 1, bottomY)
                        ) ? speed : delta;
                    }
                }
            },

            getRightSpeed: function (character) {
                var y = character.getMapY();
                var speed = 7;
                var x;

                var delta = toBrowserCords(x = toMapCords(character.getX())) + 18 - character.getX();
                if (delta < 0) {
                    delta = toBrowserCords(x = toMapCords(character.getX()) + 1) + 18 - character.getX();
                }
                if (delta >= speed) {
                    return speed;
                } else {
                    if (hasOneBlockOnSide(character)) {
                        return isBlockPassable(character, x + 1, y) ? speed : delta;
                    } else {
                        var topY = toMapCords(character.getY() - 1);
                        var bottomY = toMapCords(character.getY() + 31);
                        return (
                            isBlockPassable(character, x + 1, topY) &&
                            isBlockPassable(character, x + 1, bottomY)
                        ) ? speed : delta;
                    }
                }
            }
        };
    }]);
})(angular);
