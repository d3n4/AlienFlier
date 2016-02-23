/// <reference path="../../../typings/tsd.d.ts"/>

// Lobby events controller

var socket = io.connect();

socket.on('start', id => {
    document.location.href = '/game/play/' + id;
});

socket.on('lobbyPlayersUpdate', e => {
    console.log('lobbyPlayersUpdate', e);
    let lobbyElement = $('.gameLobby > tbody');

    let html = '';
    e.forEach(function (u) {
        html += `<tr id="player-${u.id}">
            <td width="1%">
                ${u.id}
            </td>
            <td>
                ${u.name}
            </td>
            <td width="1%">
                ${u.points}
            </td>
        </tr>`;
    });

    lobbyElement.html(html);

});

socket.on('lobbyUpdate', e => {
    var lobby_tpl = `<tr id="lobby-${e.id}">
                <td>
                    ${e.name}
                </td>
                <td>
                    ${e.players}/${e.max_players}
                </td>
                <td width="1%">
                    <a href="/game/lobby/${e.id}" class="btn btn-default">
                        Join
                    </a>
                </td>
            </tr>`;
    var $lobby = $('#lobby-' + e.id);
    if ($lobby.length) {
        $lobby.replaceWith(lobby_tpl);
    } else {
        $lobby = $(lobby_tpl);
        $('.lobby-list').append($lobby);
    }

    if (!e.visible) {
        $lobby.hide();
    }
});

socket.on('lobbyDestroy', (e) => {
    $('#lobby-' + e.id).remove();
    if (e.id == window['LOBBY_ID']) {
        swal({
            title: "Lobby was destroyed",
            text: "Lobby leader leave",
            type: "error",
            closeOnConfirm: true,
        }, function () {
            document.location.href = '/game/lobbies';
        });
    }
});
