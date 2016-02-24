/// <reference path="../../../typings/Crafty.d.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

var GAME_WIDTH = 800;
var GAME_HEIGHT = 480;

//Crafty.init();

Crafty.init(GAME_WIDTH, GAME_HEIGHT);

var BACKGROUND_SPEED = 200;
var BACKGROUND_POS = GAME_WIDTH;

//var SEQUENCE = 0;

//var bg = Crafty.e('2D, DOM, Image, Tween')
//    .attr({w:GAME_WIDTH*2, h:GAME_HEIGHT})
//    .image('/assets/background.png', "repeat-x")
//    .tween({x: -GAME_WIDTH}, BACKGROUND_SPEED)
//    .bind("TweenEnd", function() {
//        this.attr({x:Crafty.viewport.x, y: Crafty.viewport.y});
//        this.tween({x: -GAME_WIDTH}, BACKGROUND_SPEED);
//    });

//$('canvas').css('background-position-x', GAME_WIDTH);
//BACKGROUND_POS = GAME_WIDTH;


function ts() {
    BACKGROUND_POS += BACKGROUND_SPEED / 100;
    //$('canvas').get(0).style.backgroundPositionX = (-(BACKGROUND_POS % GAME_WIDTH));
    $('canvas').css('background-position', (-(BACKGROUND_POS % GAME_WIDTH)) + 'px 0');
    //setTimeout(ts, 1000 / BACKGROUND_SPEED);
    setTimeout(ts, 10);
}

ts();

let socket = io.connect();

Crafty.viewport.clampToEntities = false;

Crafty.bind('KeyDown', e => {
    console.log('KEY', e.key);
    var key = e.key;

    if (key == 38)
        key = 32;

    if (key == 39)
        key = 16;

    if (key == 37)
        key = 17;

    socket.emit('keydown', key);
});

Crafty.addEvent(Crafty, Crafty.stage.elem, "mousedown", function () {
    socket.emit('keydown', 32);
});

let players = {};

let PLAYER_ID = window['PLAYER_ID'];

Crafty.sprite(88, 73, '/assets/planes/Planes/planeBlue1.png', {
    'PlayerSprite': [0, 0]
});

Crafty.sprite(108, 239, '/assets/planes/rockDown.png', {
    'BOTTOM_BLOCK_DIRT': [0, 0]
});

Crafty.sprite(108, 239, '/assets/planes/rock.png', {
    'TOP_BLOCK_DIRT': [0, 0]
});

function createPlayerEntity(name, data) {
    var nEnt = Crafty.e('2D, Canvas, Text').text(name).textColor('#FF0000');
    var pEnt = Crafty.e('2D, Canvas, Tween, Collision, Color, PlayerSprite').attr({w: 32, h: 32}).origin('center');
    pEnt.attach(nEnt);
    nEnt.attr({y: -17, x: -((nEnt.w - pEnt.w) / 2)});
    pEnt.checkHits('Solid');
    pEnt.bind("HitOn", function(hitData) {
        socket.emit('collide', pEnt['_pid'], hitData[0].obj._type);
    });
    return pEnt;
}

var MAIN_PLAYER = null;

setInterval(function () {
    if (MAIN_PLAYER)
        Crafty.viewport.x = -(MAIN_PLAYER.x - (Crafty.viewport.width / 2));
}, 1);

var entities = {};
function updateEntity(id, type, data) {
    var entity;

    if (typeof entities[id] == 'undefined') {
        entity = entities[id] = Crafty.e('2D, Canvas, Tween, Solid, Collision, ' + type + ', ' + id);

        //if(type == 'TOP_BLOCK_DIRT') {
        //
        //}
    } else
        entity = Crafty(id);



    entity._type = type;

    if (data.removed === true) {
        entity.destroy();
        entities[id] = null;
        delete entities[id];
        return;
    }

    if (data.attr)
        entity.attr(data.attr);
    if (data.tween)
        entity.tween(data.tween, 120);
}

function updatePlayer(id, name, data) {
    let player;
    if (typeof players[id] == 'undefined') {
        player = players[id] = createPlayerEntity(name, data);
        player._pid = id;
        if (PLAYER_ID == id) {
            //Crafty.viewport.follow(player, 0, 0);
            MAIN_PLAYER = player;
            player.z = 100;
            player._globalZ = 100;
        } else {
            player.alpha = 0.5;
        }
    } else
        player = players[id];

    if (PLAYER_ID == id) {
        BACKGROUND_SPEED = 50 * data.vspeed;
    }

    var tween_attributes = {x: data.x, y: data.y, rotation: data.rotation};
    var attributes = {};

    //if(data.tween_rot) {
    //    player.tween({rotation: data.rotation}, 100);
    //} else {
    //    attributes['rotation'] = data.rotation;
    //}

    player.attr(attributes).tween(tween_attributes, 200);
}

socket.on('death', (points) => {
    swal({
        title: 'You are dead! :(',
        text: 'You record '+points+' points',
        //type: "error",
        closeOnConfirm: true,
        confirmButtonText: 'Back to lobbies'
    }, function () {
        document.location.href = '/game/lobbies';
    });
});

socket.on('update', (players, ents) => {
    players.forEach(playerData => {
        updatePlayer(playerData.id, playerData.name, playerData.data);
    });

    let ids = [];

    ents.forEach(entityData => {
        ids.push(entityData.id);
        updateEntity(entityData.id, entityData.type, entityData.data);
    });

    for (let id in entities) {
        if (!entities.hasOwnProperty(id))
            continue;
        if(ids.indexOf(id) < 0) {
            console.log('remove',id);
            console.log('total:',Crafty('TOP_BLOCK_DIRT').length);
            entities[id].destroy();
            entities[id]=null;
            delete entities[id];
        }
    }
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
