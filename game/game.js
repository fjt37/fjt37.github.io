// CONSTANTS //

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
    no_feet_delay : 80, // time to wait on frame with no feet frame between steps
    total_step_delay : 240, // time between steps, including no feet
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

BASE_SPEED = 7;

// VARS //
var canvas; // canvas to show the game (this will be a jquery object)
var ctx;    // 2d context of canvas
var predraw_canvas; // canvas to predraw each next frame of the game, to reduce screen flicker
var predraw_ctx;    // 2d context of predraw_canvas
var w; // one width unit = canvas width / 100
var h; // one height unit = canvas height / 100
var frame_delay = 30; // ms between frames
var playing = false; // whether the game is currently in action
var guy_animation = null; // interval for animating character
var game_update = null; // interval for updating game

// current state of character
var guy;

function animate_guy() {
    // set to picture with no feet
    guy.current_frame += 1;
    // after delay, go to next step
    setTimeout(function() {
        guy.current_frame = (guy.current_frame + 1) % 4;
    }, guy_frames.no_feet_delay);
}

function controls(e) {
    if (e.keyCode == 32 && !playing) { // spacebar
        start_game();
    //} else if (e.keyCode == 32) { // spacebar
    //    guy.dir = dirs.NONE;
    } else if (e.keyCode == 37 && playing && guy.dir != dirs.RIGHT) { // left arrow key
        guy.dir = dirs.LEFT;
    } else if (e.keyCode == 38 && playing && guy.dir != dirs.DOWN) { // up arrow key
        guy.dir= dirs.UP;
    } else if (e.keyCode == 39 && playing && guy.dir != dirs.LEFT) { // right arrow key
        guy.dir = dirs.RIGHT;
    } else if (e.keyCode == 40 && playing && guy.dir != dirs.UP) { // down arrow key
        guy.dir= dirs.DOWN;
    }
}

function create_game() {
    console.log("creating game...");
    playing = false;
    // create canvas
    canvas = $("<canvas></canvas>").appendTo($("#game"));
    canvas.attr('height', window.innerHeight * 0.4).attr('width', window.innerWidth * 0.5);
    ctx = canvas[0].getContext("2d");
    ctx.font = "20px Courier";
    ctx.textAlign = "center";
    w = canvas.attr('width') * 0.01;
    h = canvas.attr('height') * 0.01;
    // draw initial text
    ctx.fillText("Press the spacebar to begin.", 50 * w, 30);
    ctx.fillText("Use the arrow keys to change direction.", 50 * w, 60);
    ctx.fillText("Don't die!", 50 * w, 90);
    // initialize guy
    guy = {
        speed: BASE_SPEED,
        pos: [0, 0], // [x position (from left), y position (from top)] in px
        dir: dirs.UP, // [x direction(1 right, -1 left), y direction (1 up, -1 down)]
        current_frame: 0
    };
    guy.pos = [50 * w - 16, 100 * h - 40];
    console.log(guy_frames[dirs.UP][0]);
    ctx.drawImage(guy_frames[dirs.UP][0], guy.pos[0], guy.pos[1]);

    // create a second invisible canvas to predraw every frame on, helps reduce screen flash
    predraw_canvas = canvas.clone()[0];
    predraw_ctx = predraw_canvas.getContext("2d");
    predraw_ctx.fillStyle = "#FFF";

    $("#game").keydown(controls);
    console.log("game created");
}

function start_game() {
    playing = true;
    guy_animation = setInterval(animate_guy, guy_frames.total_step_delay);
    game_update = setInterval(update_game, frame_delay);
}

function update_game() {
    predraw_ctx.fillRect(0, 0, 100 * w, 100 * h);
    guy.pos[0] += dir_vectors[guy.dir][0] * guy.speed;
    guy.pos[1] -= dir_vectors[guy.dir][1] * guy.speed;
    predraw_ctx.drawImage(guy_frames[guy.dir][guy.current_frame], guy.pos[0], guy.pos[1]);
    ctx.drawImage(predraw_canvas, 0, 0);
}

function end_game() {
    console.log("ending game...");
    playing = false;
    clearInterval(guy_animation);
    clearInterval(game_update);
    $("#game").empty("canvas");
    console.log("game ended");
}