(function (angular, window, Modernizr) {
    var game = angular.module('game');

    game.factory('webSocket', function () {

        var socket;
        var connected = false;
        var connecting = false;
        var chatMessages = [];
        var id = 1;

        var callbacks = [];

        function isAvailable() {
            return Boolean(window.WebSocket);
        }

        function onOpen() {
            connecting = false;
            connected = true;
        }

        function onClose() {
            connected = false;
        }

        function onMessage(e) {
            var message = JSON.parse(e.data);
            dump(message);
            switch (message.type) {
                case 'chat':
                    chatMessages.unshift(message.data);
                    break;
                default:
                    if (message.type in callbacks) {
                        for (var i in callbacks[message.type]) {
                            if (callbacks[message.type].hasOwnProperty(i)) {
                                var callback = callbacks[message.type][i];
                                callback(message.data);
                            }
                        }
                    }
            }
        }

        function onError() {
            connecting = false;
        }

        function connect() {
            connecting = true;
            socket = new WebSocket('ws://' + window.location.hostname + ':8080');
            socket.onopen = onOpen;
            socket.onclose = onClose;
            socket.onmessage = onMessage;
            socket.onerror = onError;
        }

        function disconnect() {
            if (connected) {
                socket.close();
            }
        }

        return {
            connect: connect,
            disconnect: disconnect,
            message: '',
            isAvailable: isAvailable,

            isConnected: function () {
                return connected;
            },

            isConnecting: function () {
                return connecting;
            },

            getChatMessages: function () {
                return chatMessages;
            },

            sendChatMessage: function () {
                var data = {
                    chat: this.message,
                    user: 'user-' + id,
                    mobile: Modernizr.touch
                };
                this.message = '';
                chatMessages.unshift(data);
                this.send('chat', data);
            },

            send: function (type, data) {
                if (!this.isConnected() && !this.isConnecting()) {
                    connect();
                }

                var message = {
                    type: type,
                    data: data
                };
                socket.send(JSON.stringify(message));
            },

            registerHandler: function (type, callback) {
                if (!(type in callbacks)) {
                    callbacks[type] = [];
                }
                callbacks[type].push(callback);
            }
        };
    });
})(angular, window, Modernizr);
