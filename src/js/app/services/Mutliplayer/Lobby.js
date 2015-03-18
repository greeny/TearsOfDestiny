(function (angular, Modernizr) {
    var game = angular.module('game');

    game.factory('lobby', ['webSocket', function (webSocket) {

        var messages = [];
        var online = [];
        var typing = {};

        webSocket.registerHandler('login', function (data) {
            data.type = 'login';
            online[data.id] = data.user;
            if (data.user) {
                messages.push(data);
            }
        });

        webSocket.registerHandler('logout', function (data) {
            data.type = 'logout';
            data.user = online[data.id];
            delete online[data.id];
            if (data.user) {
                messages.push(data);
            }
        });

        webSocket.registerHandler('lobby-chat', function (data) {
            data.type = 'chat';
            if (data.user) {
                messages.push(data);
            }
            delete typing[online[data.id]];
        });

        webSocket.registerHandler('lobby-chat-start-typing', function (data) {
            typing[online[data.id]] = true;
        });

        webSocket.registerHandler('lobby-chat-stop-typing', function (data) {
            delete typing[online[data.id]];
        });

        webSocket.registerHandler('info', function (data) {
            online = data.connections;
        });

        return {

            loggedIn: false,
            typing: false,
            chatMessage: '',

            login: function (user) {
                if (user) {
                    user = user.trim();
                }

                if(user) {
                    webSocket.send('login', {
                        user: user
                    });
                    online = [];
                    messages = [];
                    typing = {};
                    this.loggedIn = true;
                } else {
                    alert('Please enter username.');
                }
            },

            isReady: function () {
                var ready = webSocket.isConnected();
                if (!ready && !webSocket.isConnecting()) {
                    webSocket.connect();
                }
                return webSocket.isConnected();
            },

            logout: function () {
                webSocket.send('logout', {});
                this.loggedIn = false;
                online = [];
                messages = [];
                typing = {};
            },

            getMessages: function () {
                return messages;
            },

            getOnlineUsers: function () {
                return online;
            },

            getTypingUsers: function () {
                return Object.keys(typing);
            },

            sendChatMessage: function (user) {
                if (this.chatMessage.trim()) {
                    var data = {
                        user: user,
                        message: this.chatMessage.trim(),
                        mobile: Modernizr.touch
                    };
                    webSocket.send('lobby-chat', data);
                    data.type = 'chat';
                    messages.push(data);
                    this.chatMessage = '';
                    this.typing = false;
                }
            },

            sendStartTyping: function () {
                if (!this.typing) {
                    this.typing = true;
                    webSocket.send('lobby-chat-start-typing', {});
                }
                if (this.chatMessage.trim() === '') {
                    this.sendStopTyping();
                }
            },

            sendStopTyping: function () {
                if (this.typing) {
                    this.typing = false;
                    webSocket.send('lobby-chat-stop-typing', {});
                }
            }
        };
    }]);
})(angular, Modernizr);
