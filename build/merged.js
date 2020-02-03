 
 
// ---------- ./src/vars.js
// ---------- 
let PLAYER = 0;
let CARGO = 1;

let DOOR0 = 2;
let DOOR1 = 3;

let MOB0 = 4;
let MOB1 = 5;
let MOB2 = 6;
let MOB3 = 7;

let MISC0 = 8;
let MISC1 = 9;
let MISC2 = 10;

let ITEM0 = 11;
let ITEM1 = 12;
let ITEM2 = 13;
let ITEM3 = 14;

let POT = 15;
let KEY = 16;

let WALL = 98;
let EMPTY = 99;

// -------------------

let canvas = document.getElementsByTagName('canvas')[0];
let ctx = canvas.getContext('2d');

let map = new Array(100).fill(EMPTY);

let colors = [ '#0BF8F1', '#F61677', '#FFF' ];

let spriteSheet = '00011001000110010011110101000101010101100111010101100100111011100000000000110000101101111011011100000000111111110000000001000010111111111000000110111101101001011011110110111001101111011011110111111111100000011000000110000001100000011000000110000001100000010000000000000000011000101011110100010100000110000000000000000000000000000000000000011010000110100000001000010111001010100110100000100100001111010001100100000010001110010111010101100110111001010001100000100010001110110001101100101010011011000110101011101010000000000010000000110000011100000111000001110000011111001111111100000000000000000001000000111000011011000111011011111011111111110000000000000000001111000001100000011000000110000011110001111110000000000011111100010001001100010011000100110001001100010011111111100111101001011000000110000001100000010100001001000010001111000000000000010001000011100000110000010010011000001000000000000000000010000001011000010001001000100010001001000100011001000001100000000000000000000001110000001000000111000001110000011100000000000000100000010100000101000000100000001000000010000000110000000000'.split("");

let size = 10;
let base = 8;
let scale = 3;

let currentRoom = {
    d1: { x: 0, y: 0 },
    d0: { x: 0, y: 0 },
    m: [ ]
}

let mobs = {};
let player = { 
    x: 0, 
    y: 0, 
    m: (c, r) => {
        if (map[r * size + c] == EMPTY) {
            player.s(c, r);
        } else if (mobs[r * size + c]) {
            console.log('attack');
        }
    },

    s: (c, r) => {
        map[player.y * size + player.x] = EMPTY;
        player.x = c;
        player.y = r;
        map[player.y * size + player.x] = PLAYER;
    }
}; 
// ---------- ./src/util.js
// ---------- 
let rand = (min, max) => Math.floor(Math.random() * (max - min)) + min;

let setAreaOnArr = (x, y, w, h, value) => {
    for (let i = y; i < y + h; i++) {
        for (let j = x; j < x + w; j++) {
            map[i * size + j] = value;
        }
    }
}

let getAvailablePos = () => {
    let pos = [];
    map.map((e, i) => {
        if (e == EMPTY) {
            pos.push({
                x: i % size,
                y: Math.floor(i / size)
            })
        }
    });

    return pos;
} 
// ---------- ./src/room.js
// ---------- 
let createRoom = () => {
    setAreaOnArr(0, 0, size, size, WALL);
    setAreaOnArr(1, 1, 8, 8, EMPTY);

    let pos = getAvailablePos().filter(e => e.x > 1 && e.x < 8 && e.y > 1 && e.y < 8);

    for (let i = 0; i < rand(3, 5); i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        // console.log(rand(10, 15), randPos.y * size + randPos.x, randPos)
        map[randPos.y * size + randPos.x] = rand(MISC0, MISC2);
    }

    for (let i = 0; i < rand(1, 4); i++) {
        let randPos = pos.splice(rand(0, pos.length), 1)[0];
        // console.log(rand(10, 15), randPos.y * size + randPos.x, randPos)
        map[randPos.y * size + randPos.x] = rand(MOB0, MOB3);
        mobs[randPos.y * size + randPos.x] = {
            h: 10,
            k: 0
        }
    }

    let door1y = rand(1, 7);
    let door0y = rand(1, 7);

    map[door1y * size + 0] = DOOR1;
    map[door0y * size + 9] = DOOR0;

    map[door1y * size + 1] = PLAYER;
    player.x = 1;
    player.y = door1y;

    currentRoom = {
        d1: { x: 0, y: door1y },
        d0: { x: 9, y: door0y },
        m: map
    }
} 
// ---------- ./src/controls.js
// ---------- 
// window.addEventListener('keydown', e => {
//     if (!e.repeat) {
//         console.log('fire');
//     }
// });

window.onkeydown = e => {
    if (!e.repeat) {

        //right
        /*|| e.keyCode == 68*/
        if (e.keyCode == 39) {
            player.m(player.x + 1, player.y);
        } else if (e.keyCode == 37 /*|| e.keyCode == 65*/) {
            //left
            player.m(player.x - 1, player.y);
        } else if (e.keyCode == 38 /*|| e.keyCode == 87*/) {
            //up
            player.m(player.x, player.y - 1);
        } else if (e.keyCode == 40 /*|| e.keyCode == 83*/) {
            //down
            player.m(player.x, player.y + 1);
        }
    }
} 
// ---------- ./src/sprites.js
// ---------- 
let drawSprite = (x, y, index, color) => {
    for (let i = 0; i < 64; i++) {
        if (spriteSheet[index * 64 + i] != "0") ctx.fillStyle = color;
        else ctx.fillStyle = '#000';

        let _x = (i % base) * scale + x * scale * base;
        let _y = Math.floor(i / base) * scale + y * scale * base;
        ctx.fillRect(_x, _y, scale, scale);
        // let _x = i % base + x;
        // let _y = Math.floor(i / base) + y;
        // console.log(spriteSheet[index * 64 + i], _x, _y);
    }
} 
// ---------- ./src/main.js
// ---------- 
createRoom();

// drawSprite(1, 1, PLAYER, colors[0]);
// drawSprite(9, 1, DOOR1, colors[1]);
// console.log(map)

let loop = () => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = colors[2];
    ctx.fillRect(base * scale / 2, base * scale / 2, 9 * base * scale, 9 * base * scale);
    ctx.fillStyle = "#000";
    ctx.fillRect(base * scale / 2 + 2, base * scale / 2 + 2, 9 * base * scale - 4, 9 * base * scale - 4);

    currentRoom.m.map((e, i) => {
        if (e != EMPTY) {
            let color = colors[2];

            if (e == PLAYER || e == CARGO) color = colors[0];
            if (e > 3 && e < 8) color = colors[1];

            if (e != WALL) drawSprite(i % 10, Math.floor(i / 10), e, color);
        }
    });

    requestAnimationFrame(loop);
}
console.log(player, mobs);
loop();