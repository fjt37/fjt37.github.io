// CONSTANTS //

var game_states = {
    NONE    : 0,
    CREATED : 1,
    PLAYING : 2,
    PAUSED  : 3,
    OVER    : 4
};

var dirs = {
    //NONE  : "NONE",
    LEFT  : "LEFT",
    RIGHT : "RIGHT",
    UP    : "UP",
    DOWN  : "DOWN"
};

var dir_vectors = {
    //NONE  : [ 0,  0],
    LEFT  : [-1,  0],
    RIGHT : [ 1,  0],
    UP    : [ 0,  1],
    DOWN  : [ 0, -1]
};

var guy_frames = {
    NO_FEET_DELAY : 80, // time to pend on frame with no feet
    FEET_DELAY : 130, // time to spend on each frame with feet
    LEFT : [
        $("<img src='game/assets/left_guy.png'>")[0],
        $("<img src='game/assets/left_guy_step_1.png'>")[0],
        $("<img src='game/assets/left_guy.png'>")[0],
        $("<img src='game/assets/left_guy_step_2.png'>")[0]
    ],
    RIGHT : [
        $("<img src='game/assets/right_guy.png'>")[0],
        $("<img src='game/assets/right_guy_step_1.png'>")[0],
        $("<img src='game/assets/right_guy.png'>")[0],
        $("<img src='game/assets/right_guy_step_2.png'>")[0]
    ],
    UP : [
        $("<img src='game/assets/up_guy.png'>")[0],
        $("<img src='game/assets/up_guy_step_1.png'>")[0],
        $("<img src='game/assets/up_guy.png'>")[0],
        $("<img src='game/assets/up_guy_step_2.png'>")[0]
    ],
    DOWN : [
        $("<img src='game/assets/down_guy.png'>")[0],
        $("<img src='game/assets/down_guy_step_1.png'>")[0],
        $("<img src='game/assets/down_guy.png'>")[0],
        $("<img src='game/assets/down_guy_step_2.png'>")[0]
    ]

};

var BASE_SPEED = 7;
var FRAME_DELAY = 30; // ms between frames

// VARS //
var canvas; // canvas to show the game (this will be a jquery object)
var ctx;    // 2d context of canvas
var predraw_canvas; // canvas to predraw each next frame of the game, to reduce screen flicker
var predraw_ctx;    // 2d context of predraw_canvas
var w; // one width unit = canvas width / 100
var h; // one height unit = canvas height / 100
var guy_animation = 0; // interval id for animating character
var game_update = 0; // interval id for updating game
var font_size;

var game_state = game_states.NONE; // should be set to a value of game_states

// current state of character
var guy;

// prints a string to the canvas
function ctx_write(s, x, y) {
    ctx.fillText(s, x, y);
    // ctx.strokeText(s, x, y);
}

function game_controls(e) {
    e.preventDefault();
    if (e.keyCode == 32 && game_state == game_states.CREATED) { // spacebar
        start_game();
    }
    else if (e.keyCode == 32 && game_state == game_states.PLAYING) { // spacebar
        pause_game();
    }
    else if (e.keyCode == 32 && game_state == game_states.PAUSED) { // spacebar
        resume_game();
    }
    else if (e.keyCode == 37 && game_state == game_states.PLAYING && guy.dir != dirs.RIGHT) { // left arrow key
        guy.dir = dirs.LEFT;
    }
    else if (e.keyCode == 38 && game_state == game_states.PLAYING && guy.dir != dirs.DOWN) { // up arrow key
        guy.dir= dirs.UP;
    }
    else if (e.keyCode == 39 && game_state == game_states.PLAYING && guy.dir != dirs.LEFT) { // right arrow key
        guy.dir = dirs.RIGHT;
    }
    else if (e.keyCode == 40 && game_state == game_states.PLAYING && guy.dir != dirs.UP) { // down arrow key
        guy.dir= dirs.DOWN;
    }
}

function create_game() {
    console.log("creating game...");
    // create canvas
    canvas = $("<canvas></canvas>").appendTo($("#game"));
    canvas.attr('height', window.innerHeight * 0.4).attr('width', window.innerWidth * 0.5);
    ctx = canvas[0].getContext("2d");
    w = canvas.attr('width') * 0.01;
    h = canvas.attr('height') * 0.01;
    font_size = Math.min(w * 3, h * 6);
    ctx.font = font_size + "px Courier";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#FFF";
    ctx.fillStyle = "#000";
    // initialize guy
    guy = {
        speed: BASE_SPEED, // pc to move each frame
        pos: [0, 0], // [x position (from left), y position (from top)] in px
        dir: dirs.UP, // [x direction(1 right, -1 left), y direction (1 up, -1 down)]
        current_frame: 0, // current anumation frame
    };
    // create a second invisible canvas to predraw every frame on, helps reduce screen flicker
    predraw_canvas = canvas.clone()[0];
    predraw_ctx = predraw_canvas.getContext("2d");
    predraw_ctx.fillStyle = "#FFF";

    game_state = game_states.CREATED;

    guy_animation = setTimeout(animate_guy, 0);
    game_update = setInterval(update_game, FRAME_DELAY);
}

function animate_guy() {
    // go to next frame
    guy.current_frame = (guy.current_frame + 1) % 4;
    // determine animation speed (delay each frame by a factor of frame_speed)
    var frame_speed = 1;
    if (game_state == game_states.CREATED)
        frame_speed =3;
    // after delay, recurse
    var this_frame_delay = guy.current_frame % 2 ? guy_frames.FEET_DELAY : guy_frames.NO_FEET_DELAY;
    guy_animation = setTimeout(animate_guy, this_frame_delay * frame_speed);
}

function update_game() {
    if (game_state == game_states.CREATED) {
        ctx_write("Press the spacebar to begin.", 50 * w, 10 + font_size);
        ctx_write("Use the arrow keys to change direction.", 50 * w, 40 + font_size);
        ctx_write("Don't hit anything!", 50 * w, 70 + font_size);
        guy.pos = [50 * w - 16, 100 * h - 40];
        ctx.drawImage(guy_frames[dirs.UP][guy.current_frame], guy.pos[0], guy.pos[1]);
    }
    else if (game_state == game_states.PAUSED) {
        ctx_write("PAUSED", w * 50, h * 50 - font_size / 2);
        return;
    }
    else if (game_state == game_states.OVER) {
        ctx_write("GAME OVER", w * 50, h * 50 - font_size / 2);
        return;
    }
    else {
        // clear screen
        predraw_ctx.fillRect(0, 0, 100 * w, 100 * h);
        // move character
        guy.pos[0] += dir_vectors[guy.dir][0] * guy.speed;
        guy.pos[1] -= dir_vectors[guy.dir][1] * guy.speed;
        // draw character
        predraw_ctx.drawImage(guy_frames[guy.dir][guy.current_frame], guy.pos[0], guy.pos[1]);
    }

    // draw predrawn canvas on game canvas
    // this way, the whole frame paints at once, and without any flash of white
    ctx.drawImage(predraw_canvas, 0, 0);
}

function start_game() {
    game_state = game_states.PLAYING;
    clearTimeout(guy_animation);
    guy_animation = setTimeout(animate_guy, 0);
}

function pause_game() {
    game_state = game_states.PAUSED;
}

function resume_game() {
    game_state = game_states.PLAYING;
}

function quit_game() {
    game_state = game_states.NONE;
    clearTimeout(guy_animation);
    clearInterval(game_update);
    $("#game > canvas").remove();
}