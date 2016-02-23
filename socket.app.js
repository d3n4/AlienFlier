"use strict";

var uuid = require('node-uuid');

var GAME_WIDTH = 800;
var GAME_HEIGHT = 480;

function app(server, app) {

    class Player {
        constructor(ip, sid) {
            this.id = uuid.v1();
            this.ip = ip;
            this.sid = sid;
            this.name = 'Player #' + sid;
            this.socket = null;
            this.lobby = null;
            this.points = 0;
            this.firstConnect = true;
            this.data = {};
            this.inputPool = [];
        }

        leaveLobby() {
            if (this.lobby) {
                this.lobby.leave(this);
            }
        }

        keyDown(key) {
            if (this.lobby)
                this.lobby.keyDown(this, key);
        }

        update() {

        }
    }

    class Lobby {
        constructor(name, owner) {
            this.id = uuid.v1();
            this.name = name;
            this.max_players = 6;
            this.players = [owner];
            this.owner = owner;
            this.is_playing = false;
            this.visible = true;
            owner.lobby = this;
            this.gameThread = null;

            this.lobbyUpdate();
        }

        renderWorld() {
            var players = [];

            this.players.forEach(function (e) {
                players.push({id: e.id, data: e.data});
            });

            this.players.forEach(function (e) {
                if (e.socket) {
                    e.socket.emit('update', players);
                }
            });

            players = null;
        }

        initializeWorld() {
            this.players.forEach(function (e, i) {
                e.data = {
                    x: 0,
                    y: 100 + i * 32,


                    force: 35,
                    vy: 0,
                    vx: 0,
                    _vy: 0,
                    _vx: 0,
                    _vdx: 0,
                    _vdy: 0,

                    speed: 30,
                    gravity: 90
                };
            });
        }

        update(deltaTime) {

            this.players.forEach(e => {

                e.data.y += e.data.gravity * deltaTime;
                e.data.x += e.data.speed * deltaTime;

                if (e.data.vx) {
                    if(e.data.vx < 0) {
                        e.data._vx = e.data.vx * -1;
                        e.data._vdx = -1;
                    }
                    if(e.data.vx > 0) {
                        e.data._vx = e.data.vx;
                        e.data._vdx = 1;
                    }

                    e.data.vx = 0;
                }
                if (e.data.vy) {
                    if(e.data.vy < 0) {
                        e.data._vy = e.data.vy * -1;
                        e.data._vdy = -1;
                    }
                    if(e.data.vy > 0) {
                        e.data._vy = e.data.vy;
                        e.data._vdy = 1;
                    }

                    e.data.vy = 0;
                }

                if(e.data._vx > 0) {
                    e.data._vx -= e.data.force * deltaTime;
                    e.data.x += (e.data.force * deltaTime) * e.data._vdx;
                }
                if(e.data._vy > 0) {
                    e.data._vy -= e.data.force * deltaTime;
                    e.data.y += (e.data.force * deltaTime) * e.data._vdy;
                }

                if(e.data.y > (GAME_HEIGHT - 32)) {
                    e.data.y = GAME_HEIGHT - 32;
                    console.log('player die');
                }

                var input = e.inputPool.shift();

                // jump
                if (input == 32) {
                    e.data.vy = -30;
                }
            });

            this.renderWorld();
        }

        keyDown(player, key) {
            player.inputPool.push(key);
        }

        lobbyUpdate() {
            app.game.io.sockets.emit('lobbyUpdate', {
                id: this.id,
                name: this.name,
                players: this.players.length,
                max_players: this.max_players,
                visible: this.visible
            });
        }

        start() {
            this.is_playing = true;
            this.visible = false;
            this.players.forEach(function (e) {
                if (e.socket)
                    e.socket.emit('start', e.lobby.id);
                e.data = {};
                e.inputPool = [];
            });

            this.initializeWorld();

            this.lobbyUpdate();

            let last_update = +new Date();
            this.gameThread = setInterval(() => {
                let current_time = +new Date();
                this.update((current_time - last_update) / 100);
                last_update = current_time;
            }, 33);
        }

        join(player) {
            if (this.players.length >= this.max_players)
                return false;
            if (this.players.indexOf(player) > -1)
                return true;
            this.players.push(player);
            player.lobby = this;

            var playersList = this.players.map(e => {
                var p = {};
                p.id = e.sid;
                p.name = e.name;
                p.points = e.points;
                return p;
            });

            this.players.forEach(function (e) {
                if (e.socket) {
                    e.socket.emit('lobbyPlayersUpdate', playersList);
                }
            });

            this.lobbyUpdate();

            return true;
        }

        leave(player) {
            if (player.id == this.owner.id) {
                return this.destroy();
            }

            var _pIndex = this.players.indexOf(player);

            if (_pIndex < 0)
                return;

            this.players.splice(_pIndex, 1);

            player.lobby = null;

            var playersList = this.players.map(e => {
                var p = {};
                p.id = e.sid;
                p.name = e.name;
                p.points = e.points;
                return p;
            });

            this.players.forEach(function (e) {
                if (e.socket) {
                    e.socket.emit('lobbyPlayersUpdate', playersList);
                }
            });

            this.lobbyUpdate();
        }

        destroy() {
            if (!app.game.lobbies[this.id]) return;
            for (var playerIndex in this.players) {
                if (!this.players.hasOwnProperty(playerIndex)) continue;
                var player = this.players[playerIndex];
                player.lobby = null;
            }

            if (this.gameThread)
                clearInterval(this.gameThread);

            this.players = null;
            this.owner.lobby = null;
            this.owner = null;
            delete app.game.lobbies[this.id];

            app.game.io.sockets.emit('lobbyDestroy', {
                id: this.id
            });
        }
    }

    class Game {
        constructor() {
            var io = require('socket.io')(server);
            var self = this;

            io.on('connection', function (socket) {
                var ip = socket.request.connection.remoteAddress;

                if (typeof self.players[ip] !== 'undefined') {
                    self.players[ip].socket = socket;
                }

                socket.on('update', function (packet) {
                    if (typeof self.players[ip] !== 'undefined') {
                        self.players[ip].update(packet);
                    }
                });

                socket.on('keydown', function (key) {
                    if (typeof self.players[ip] !== 'undefined') {
                        self.players[ip].keyDown(key);
                    }
                });

                socket.on('disconnect', function () {
                    if (typeof self.players[ip] !== 'undefined') {
                        self.players[ip].socket = null;
                    }
                });
            });

            this.sid = 0;
            this.players = {};

            this.io = io;
            this.lobbies = {};
        }

        getPlayer(ip) {
            if (typeof this.players[ip] == 'undefined')
                return this.players[ip] = new Player(ip, ++this.sid);
            return this.players[ip];
        }

        getLobby(id) {
            if (typeof this.lobbies[id] !== 'undefined')
                return this.lobbies[id];
            return null;
        }

        createLobby(name, owner) {
            let lobby = new Lobby(name, owner);
            return this.lobbies[lobby.id] = lobby;
        }
    }

    app.game = new Game();
}

module.exports = app;
