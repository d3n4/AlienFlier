var express = require('express');
var router = express.Router();

function getIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

function startup(app) {

    function getPlayer(req) {
        return app.game.getPlayer(getIp(req));
    }

    router.get('/lobbies', function (req, res, next) {
        var player = getPlayer(req);
        res.render('lobbies', {title: 'Lobby', lobbies: app.game.lobbies, player: player});
    });

    router.post('/set', function (req, res, next) {
        var name = req.body.name;
        if (!name || name.length < 1 || name.length > 12 || !name.match(/([\w]+)/i))
            return res.json({success: false});

        var player = getPlayer(req);

        player.name = name;

        player.firstConnect = false;
        console.log(player);

        return res.json({success: true});
    });

    router.get('/leave', function (req, res, next) {
        var player = getPlayer(req);
        player.leaveLobby();
        res.redirect('/game/lobbies');
    });

    router.get('/create', function (req, res, next) {
        var player = getPlayer(req);
        if (player.lobby) {
            res.render('error', {
                message: "You already connected to lobby",
                lobby: player.lobby.id
            });
            return;
        }

        res.render('create', {title: 'Create lobby'});
    });

    router.post('/create', function (req, res, next) {
        var player = getPlayer(req);
        if (player.lobby) {
            res.render('error', {
                message: "You already connected to lobby",
                lobby: player.lobby.id
            });
            return;
        }
        var lobby = app.game.createLobby(req.body.name || 'unnamed', player);
        res.redirect('/game/lobby/' + lobby.id);
    });

    router.get('/play/:lobby_id', function (req, res, next) {
        var lobby = app.game.getLobby(req.params.lobby_id);
        if (!lobby)
            return res.render('error', {
                message: "Lobby is already closed or does not exists",
                lobby_list: true
            });

        var player = getPlayer(req);

        if (!lobby.is_playing) {
            if (lobby.owner.id == player.id) {
                lobby.start();
            } else
                return res.render('error', {
                    message: "Lobby is not started yet",
                    lobby: lobby
                });
        }

        if (lobby.players.indexOf(player) < 0)
            return res.render('error', {
                message: "Lobby is already started",
                lobby_list: true
            });

        res.render('game', {player: player});
    });

    router.get('/lobby/:lobby_id', function (req, res, next) {
        var lobby = app.game.getLobby(req.params.lobby_id);
        if (!lobby)
            return res.render('error', {
                message: "Lobby is already closed or does not exists",
                lobby_list: true
            });

        var player = getPlayer(req);

        if(lobby.is_playing)
            return res.redirect('/game/play/' + lobby.id);

        if (player.lobby && player.lobby.id != lobby.id)
            return res.render('error', {
                message: "You are currently connected to another lobby: " + player.lobby.name,
                lobby: player.lobby
            });

        if (!lobby.join(player))
            return res.render('error', {
                message: "Lobby is already full :(",
                lobby_list: true
            });
        var owner = false;
        if (lobby.owner.id == player.id)
            owner = true;

        res.render('gameLobby', {title: 'Game', lobby: lobby, players: lobby.players, owner: owner});
    });

    return router;
}

module.exports = startup;
