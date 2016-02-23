/// <reference path="../../../typings/Crafty.d.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

Crafty.init();


let socket = io.connect();

Crafty.bind('KeyDown', e => {
    socket.emit('keydown', e.key);
});

let players = {};

let PLAYER_ID = window['PLAYER_ID'];

function createPlayerEntity(data) {
    return Crafty.e('2D, Canvas, Color').attr({w: 32, h: 32}).color('red');
}

function updatePlayer(id, name, data) {
    let player;
    if (typeof players[id] == 'undefined') {
        player = players[id] = createPlayerEntity(data);
        if (PLAYER_ID == id) {
            Crafty.viewport.follow(player, 0, 0);
            player.z = 100;
            player._globalZ = 100;
        } else {
            player.alpha = 0.5;
        }
    } else
        player = players[id];

    player.attr({x: data.x, y: data.y});
}

socket.on('update', e => {
    e.forEach(playerData => {
        updatePlayer(playerData.id, 'test', playerData.data);
    });
});

//let last_update = +new Date();

//function getDelta(): number {
//    let current_time = +new Date();
//    let dt = ((current_time - last_update) / 100);
//    last_update = current_time;
//    return dt;
//}

//function readInput(deltaTime: number): void {
//    //INPUT.JUMP = Crafty.
//}
//
//function sendInput(deltaTime: number): void {
//
//}
//
//function calculateData(input: Object, deltaTime: number): void {
//
//}
//
//function renderScene(deltaTime: number): void {
//
//}
//
//{
//
//    let NetworkLoop = setInterval(() => {
//        var deltaTime = getDelta();
//        readInput(deltaTime);
//        sendInput(deltaTime);
//        renderScene(deltaTime);
//    }, 33);
//}
