var canvas;

var guy_frames = [
    {
        img: $("<img src='game/assets/guy.png'>")[0],
        duration: 50
    },{
        img: $("<img src='game/assets/guy_step_left.png'>")[0],
        duration: 200
    },{
        img: $("<img src='game/assets/guy.png'>")[0],
        duration: 50
    },{
        img: $("<img src='game/assets/guy_step_right.png'>")[0],
        duration: 200
    }
]

function animate_guy(frame) {
    canvas.drawImage(guy_frames[frame]['img'], 10, 10);
    setTimeout(function() {
        animate_guy((frame + 1) % 4);
    }, guy_frames[frame]['duration']);
}

function create_game() {
    console.log("creating game");
    canvas = $("#game > canvas")[0].getContext("2d")
    console.log(canvas);
    animate_guy(0);
}