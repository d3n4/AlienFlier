"use strict";

var uuid = require('node-uuid');

var GAME_WIDTH = 800;
var GAME_HEIGHT = 480;

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


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
            this.level = 1;
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

        collide(pid, target) {
            if (this.lobby)
                this.lobby.collide(pid, target);
        }
    }

    class Lobby {
        constructor(name, owner) {
            this.id = uuid.v1();
            this.name = name;
            this.max_players = 6;
            this.players = [owner];
            this.entities = [];
            this.owner = owner;
            this.is_playing = false;
            this.visible = true;
            owner.lobby = this;
            this.gameThread = null;
            this.ticks = 0;
            this.tickrate = 100;
            this.time = 0;
            this.sequence = 30;

            this.lobbyUpdate();
        }

        renderWorld() {
            var self = this;
            var players = [];

            this.players.forEach(function (e) {
                players.push({id: e.id, name: e.name, data: e.data});
            });

            this.players.forEach(function (e) {
                if (e.socket) {
                    e.socket.emit('update', players, self.entities);
                }
            });

            players = null;
        }

        initializeWorld() {
            this.players.forEach(function (e, i) {
                e.data = {
                    x: 0,
                    y: GAME_HEIGHT / 2 - 32,//100 + i * 32,

                    rotation: 0,

                    force_x: 5,
                    force_y: 3,
                    vy: 0,
                    vx: 0,
                    _vy: 0,
                    _vx: 0,
                    _vdx: 0,
                    _vdy: 0,

                    vspeed: 0,

                    speed: 15,
                    gravity: 15
                };
            });
        }

        getPlayer(id) {
            var player = null;
            this.players.forEach(function (e) {
                if (id == e.id)
                    player = e;
            });
            return player;
        }

        createEntity(type, data) {
            this.entities.push({
                id: uuid.v1(),
                type: type,
                data: data
            });
        }

        die(player) {
            this.leave(player);

            if (player.socket) {
                player.socket.emit('death', player.points);
            }
        }

        collide(pid, target) {
            if (target == 'BOTTOM_BLOCK_DIRT' || target == 'TOP_BLOCK_DIRT') {
                var player = this.getPlayer(pid);
                console.log('player died', pid, target, player);
                if (player) {
                    this.die(player);
                }
            }
        }

        update(deltaTime) {

            var self = this;

            this.level = Math.round(this.ticks / 100);

            let position = {
                max: {
                    x: 0,
                    y: 0
                },

                min: {
                    x: null,
                    y: null
                }
            };

            this.players.forEach(e => {

                let last_x = e.data.x;

                if (e.points < self.ticks)
                    e.points = self.ticks;

                e.data.speed = 15 + Math.round(self.level / 2);

                e.data.y += e.data.gravity * deltaTime;
                e.data.x += e.data.speed * deltaTime;

                if (e.data.vx) {
                    if (e.data.vx < 0) {
                        e.data._vx = e.data.vx * -1;
                        e.data._vdx = -1;
                    }
                    if (e.data.vx > 0) {
                        e.data._vx = e.data.vx;
                        e.data._vdx = 1;
                    }

                    e.data.vx = 0;
                }
                if (e.data.vy) {
                    if (e.data.vy < 0) {
                        e.data._vy = e.data.vy * -1;
                        e.data._vdy = -1;
                    }
                    if (e.data.vy > 0) {
                        e.data._vy = e.data.vy;
                        e.data._vdy = 1;
                    }

                    e.data.vy = 0;
                }

                if (e.data._vx > 0) {
                    e.data._vx -= e.data.force_x * deltaTime;
                    e.data.x += (e.data.force_x * deltaTime) * e.data._vdx;
                }
                if (e.data._vy > 0) {
                    e.data._vy -= e.data.force_y * e.data.gravity * deltaTime;
                    e.data.y += (e.data.force_y * e.data.gravity * deltaTime) * e.data._vdy;
                }

                if (e.data.y > (GAME_HEIGHT - 32)) {
                    e.data.y = GAME_HEIGHT - 32;
                }

                // viewport based now
                //if (e.data.x > (GAME_WIDTH / 2 - 16)) {
                //    e.data.x = (GAME_WIDTH / 2 - 16);
                //}

                if (e.data.y < 0) {
                    e.data.y = 0;
                }

                var input = e.inputPool.shift();

                if (e.data.rotation < 45) {
                    e.data.rotation += 15;
                }

                // jump
                if (input == 32) {
                    e.data.vy = -100;
                    e.data.rotation = -60;//315;
                    e.data.tween_rot = true;
                }

                if (input == 16) {
                    e.data.vx = 50;
                }

                if (input == 17) {
                    e.data.vx = -50;
                }

                e.data.vspeed = ((e.data.x - last_x) / 5) + 1;
                //e.data.vspeed = (e.data._vx / 50 * e.data._vdx) + 1;
                //if (e.data.vspeed < 0.75)
                //    e.data.vspeed = 0.75;

                if (e.data.x > position.max.x)
                    position.max.x = e.data.x;
                if (e.data.y > position.max.y)
                    position.max.y = e.data.y;

                if (e.data.x < position.min.x || position.min.x === null)
                    position.min.x = e.data.x;
                if (e.data.y < position.min.y || position.min.y === null)
                    position.min.y = e.data.y;
            });

            this.entities.forEach(function (entity) {
                if (entity.data.attr.x + GAME_WIDTH < position.min.x) {
                    self.entities.splice(self.entities.indexOf(entity), 1);
                }
            });

            let BLOCK_WIDTH = 108,
                BLOCK_HEIGHT = 239;

            function createBlock(offset, specified) {
                var attr = {};

                if (specified) {
                    attr = {
                        y: -offset,
                        x: position.max.x + GAME_WIDTH
                    };

                    self.createEntity('TOP_BLOCK_DIRT', {
                        collide: true,
                        attr: attr
                    });
                } else {
                    attr = {
                        y: GAME_HEIGHT - BLOCK_HEIGHT + offset,
                        x: position.max.x + GAME_WIDTH
                    };

                    self.createEntity('BOTTOM_BLOCK_DIRT', {
                        collide: true,
                        attr: attr
                    });
                }

                return attr;
            }

            if ((this.ticks % this.sequence) == 0) {

                if (this.level <= 1) {
                    createBlock(20, rand(0, 1));
                } else if (this.level <= 3) {
                    createBlock(10, rand(0, 1));
                    this.sequence = 15;
                } else { //if (this.level <= 6) {
                    createBlock(5, rand(0, 1));
                    this.sequence = 10;
                    //} else {
                    //    this.sequence = 20 - this.level;
                    //    if(this.sequence < 8)
                    //        this.sequence = 8;
                    //
                    //    var i = rand(45, 120);
                    //    var f = rand(0, 20);
                    //    var h = rand(0, 80);
                    //    if(f < 3) {
                    //        createBlock(100 - h, 1);
                    //        createBlock(h, 0);
                    //    } else if (f <= 5) {
                    //        createBlock(45, 1);
                    //        createBlock(45, 0);
                    //    } else if (f <= 7) {
                    //        createBlock(60, 1);
                    //        createBlock(60, 0);
                    //    } else if (f > 8) {
                    //        createBlock(i, 1);
                    //        createBlock(i, 0);
                    //    }
                }

                //} else if (this.level <= 200) {
                //    this.sequence = rand(15, 25) - Math.round(this.level / 20);
                //
                //    var f = rand(0, 10);
                //    var i = rand(0, 80);
                //    if (f <= 3) {
                //        createBlock(100 - i, rand(0,1));
                //        createBlock(i, rand(0,1));
                //    }
                //    else if (f > 3) {
                //        createBlock(100 - i, 1);
                //        createBlock(i, 0);
                //    } else
                //        createBlock(0, rand(0, 1))
                //
                //}

            }

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
                this.ticks++;
                this.time += this.tickrate;
                let current_time = +new Date();
                this.update((current_time - last_update) / 100);
                last_update = current_time;
            }, this.tickrate);
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

            if (player.id == this.owner.id && !this.is_playing) {
                return this.destroy();
            }

            var _pIndex = this.players.indexOf(player);

            if (_pIndex < 0)
                return;

            this.players.splice(_pIndex, 1);

            player.lobby = null;

            if (this.players.length < 1) {
                return this.destroy();
            }

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

                socket.on('collide', function (pid, target) {
                    if (typeof self.players[ip] !== 'undefined') {
                        self.players[ip].collide(pid, target);
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
