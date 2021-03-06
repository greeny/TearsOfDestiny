(function (angular) {
    var game = angular.module('game');

    game.factory('map', ['$http', 'blockFactory', function ($http, blockFactory) {

        var mapData = {};
        var mapView = {};
        var texts = [];

        function parseMap(data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    parseMapPiece(data[key]);
                }
            }
            var result = [];
            for (key in mapData) {
                if (mapData.hasOwnProperty(key)) {
                    var cords = key.split('|');
                    var x = parseInt(cords[0]);
                    var y = parseInt(cords[1]);
                    if (!(y in result)) {
                        result[y] = [];
                    }
                    result[y][x] = mapData[key];
                }
            }
            mapView = result;
        }

        function parseMapPiece(data) {
            var type = data.type;
            var value = data.value;
            var x = data.x;
            var y = data.y;
            switch (type) {
                case 'block':
                    parseBlock(value, x, y);
                    break;
                case 'map':
                    var map = data.map;
                    for (var mapY in value) {
                        if (value.hasOwnProperty(mapY)) {
                            for (var mapX in value[mapY]) {
                                if (value[mapY].hasOwnProperty(mapX)) {
                                    parseBlock(map[value[mapY][mapX]], x + parseInt(mapX), y + parseInt(mapY));
                                }
                            }
                        }
                    }
                    break;
                case 'custom':
                    var name = data.name;
                    mapData[x + '|' + y] = blockFactory.parse(name, value);
                    break;
                case 'text':
                    texts.push({
                        value: data.value,
                        x: data.x * 50,
                        y: data.y * 50 + 10
                    });
            }
        }

        function parseBlock(name, x, y) {
            mapData[x + '|' + y] = blockFactory.create(name);
        }

        return {
            clearMapData: function () {
                mapData = {};
                mapView = {};
                texts = [];
            },

            setMapData: function (data) {
                this.clearMapData();
                parseMap(data);
                return this;
            },

            getPoint: function (x, y) {
                var key = x + '|' + y;
                if (key in mapData && mapData.hasOwnProperty(key)) {
                    return mapData[key];
                } else {
                    return null;
                }
            },

            getMapView: function () {
                return mapView;
            },

            getMapData: function () {
                return mapData;
            },

            getTexts: function () {
                return texts;
            }
        };
    }]);
})(angular);
