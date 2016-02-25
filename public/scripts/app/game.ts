/// <reference path="../../../typings/Crafty.d.ts"/>
/// <reference path="../../../typings/tsd.d.ts"/>

var GAME_WIDTH = 800;
var GAME_HEIGHT = 480;

// COMPONENTS


;(function() {
    var sc_canvas = document.createElement('canvas'), // create an hidden canvas
        sc_ctx = sc_canvas.getContext('2d'),
        sc_drawFunc;
    //var $canvas = $(sc_canvas);
    //$canvas.css('position', 'absolute');
    //$canvas.css('left', '0');
    //$canvas.css('top', '0');
    //$canvas.css('width', GAME_WIDTH);
    //$canvas.css('height', GAME_HEIGHT);
    //$('body').append($canvas);

    // draw callback
    sc_drawFunc = function(){
        // sprite coordinates
        var co = this.__coord,
        // context 2d of hidden canvas
            ctx = sc_ctx;
        // draw the sprite on hidden canvas
        ctx.drawImage(this.img, //image element
            co[0], //x position on sprite
            co[1], //y position on sprite
            co[2], //width on sprite
            co[3], 0, 0, //height on sprite
            this._w, //width on canvas
            this._h //height on canvas
        );
        // Draw a rectangle over the sprite using a overlay
        ctx.save();
        ctx.globalCompositeOperation = "source-in";
        // paint the rectangle with a color
        ctx.fillStyle = this._color;
        ctx.beginPath();
        ctx.fillRect(0, 0, this._w, this._h);
        ctx.closePath();
        ctx.restore();
        // draw the hidden canvas on Crafty canvas
        Crafty.canvas.context.drawImage(sc_canvas, -16, -16);
    };

    // the component
    Crafty.c("SpriteColor", {
        _color: 'rgba(255,255,255,1)',

        init: function(){
            this.bind("Draw", sc_drawFunc)
                .bind("RemoveComponent", function(c) {
                    if (c === "SpriteColor") this.unbind("Draw", sc_drawFunc);
                });
        },

        /**@
         * #.spriteColor
         * @comp SpriteColor
         * @trigger Change - when the color is applied
         * @sign public this .spriteColor(String hexcolor, Number strength)
         * @param color - The color in HEXADECIMAL
         * @param strength - Level of opacity
         *
         * The argument must be a color readable depending on which browser you
         * choose to support. IE 8 and below doesn't support the rgb() syntax.
         *
         * @example
         * ~~~
         * Crafty.sprite(16, "http://craftyjs.com/demos/tutorial/sprite.png", {player:[0,3]});
         *
         * Crafty.e("2D, Canvas, player, SpriteColor")
         * 	.spriteColor("#FF0000",0.5); // red with 50% transparency
         * ~~~
         */
        spriteColor: function(color, strength){
            this._color = 'rgba('+color[0]+', '+color[1]+', '+color[2]+', '+strength+')';
            this.trigger("Change");
            return this;
        }
    });
})();

// COMPONENTS



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


var $points = Crafty.e('2D, Canvas, Text').attr({
    y: 40,
    x: 40
});

$points.text('0 points');
$points.textFont({
    size: '20px',
    weight: 'bold'
});

$points.z = 100000;
$points._globalZ = 100000;

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

Crafty.sprite(256, 256, '/assets/Solid/letter_G.png', {
    'BONUS_G': [0, 0]
});

Crafty.sprite(256, 256, '/assets/Solid/letter_S.png', {
    'BONUS_S': [0, 0]
});

Crafty.sprite(256, 256, '/assets/Solid/letter_X.png', {
    'BONUS_X': [0, 0]
});

Crafty.sprite(256, 256, '/assets/Solid/letter_R.png', {
    'BONUS_R': [0, 0]
});

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createPlayerEntity(name, data) {
    var nEnt = Crafty.e('2D, Canvas, Text').text(name).textColor('#FF0000');
    var pEnt = Crafty.e('2D, Canvas, Tween, Collision, SpriteColor, Solid, PlayerSprite').attr({w: 32, h: 32}).origin('center').spriteColor([rand(0,255), rand(0,255), rand(0,255)], 1);
    //pEnt.alpha = 0.8;
    pEnt.attach(nEnt);
    nEnt.attr({y: -17, x: -((nEnt.w - pEnt.w) / 2)});
    pEnt.checkHits('Solid');
    pEnt.bind("HitOn", function(hitData) {
        var target = hitData[0].obj._type;
        var target_pid = hitData[0].obj._pid;
        socket.emit('collide', pEnt['_pid'], target, target_pid);
        if(target != 'BOTTOM_BLOCK_DIRT' && target != 'TOP_BLOCK_DIRT' && target != 'PLAYER') {
            hitData[0].obj.destroy();
        }
    });
    return pEnt;
}

var MAIN_PLAYER = null;

setInterval(function () {
    if (MAIN_PLAYER) {
        Crafty.viewport.x = -(MAIN_PLAYER.x - (Crafty.viewport.width / 2));
        console.log('VIEWPORT UPDATE');
        $points.x = Math.abs(Crafty.viewport.x) + 40;
    }
}, 1);

setInterval(function() {
    Crafty('GameEntity').each(function() {
        if(this.x + GAME_WIDTH < Crafty.viewport.x) {
            this.destroy();
            console.log(Crafty('GameEntity').length);
        }
    });
}, 500);

var entities = {};
function updateEntity(id, type, data) {
    var entity;

    if (typeof entities[id] == 'undefined') {
        entity = entities[id] = Crafty.e('2D, Canvas, Tween, Solid, Collision, GameEntity, ' + type + ', ' + id);

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

    player._pid = id;
    player._type = 'PLAYER';

    if (PLAYER_ID == id) {
        BACKGROUND_SPEED = 50 * data.vspeed;
        $points.text(data.points + ' points');
    }

    var tween_attributes = {x: data.x, y: data.y, rotation: data.rotation};
    var attributes = {};

    console.log(data, data.rotate);

    var $canvas = $('canvas');

    if(data.rotate) {
        if(!$canvas.hasClass('rotate'))
            $canvas.addClass('rotate');
    } else {
        if($canvas.hasClass('rotate'))
            $canvas.removeClass('rotate');
    }

    //if(data.tween_rot) {
    //    player.tween({rotation: data.rotation}, 100);
    //} else {
    //    attributes['rotation'] = data.rotation;
    //}

    player.attr(attributes).tween(tween_attributes, 200);
}

socket.on('death', (points) => {
    //swal({
    //    title: 'You are dead! :(',
    //    text: 'You record '+points+' points',
    //    //type: "error",
    //    closeOnConfirm: true,
    //    confirmButtonText: 'Back to lobbies'
    //}, function () {
    //    document.location.href = '/game/lobbies';
    //});
    alert('You are dead! :(');
    document.location.href = '/game/lobbies';
});

socket.on('update', (players, ents) => {
    players.forEach(playerData => {
        updatePlayer(playerData.id, playerData.name, playerData.data);
    });

    //let ids = [];

    ents.forEach(entityData => {
        //ids.push(entityData.id);
        updateEntity(entityData.id, entityData.type, entityData.data);
    });

    /*for (let id in entities) {
        if (!entities.hasOwnProperty(id))
            continue;
        if(ids.indexOf(id) < 0) {
            console.log('remove',id);
            console.log('total:',Crafty('TOP_BLOCK_DIRT').length);
            entities[id].destroy();
            entities[id]=null;
            delete entities[id];
        }
    }*/
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
