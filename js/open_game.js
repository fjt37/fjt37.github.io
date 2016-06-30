$(document).ready(function() {

    var transition_duration = 400;

    $("#game-button").click(function() {
        // if game not being played, show game
        if ($("#bio").is(":visible")) {
            create_game(); // see game/game.js
            $("#bio").slideUp(transition_duration, function() {
                $("#game").fadeIn(transition_duration);
                $("#game-button").text("Quit")
                $("#game")[0].focus();
            });

        }
        // otherwise, quit game and go back to bio
        else { 
            $("#game").fadeOut(transition_duration, function () {
                $("#bio").slideDown(transition_duration);
                $("#game-button").text("Game");
                end_game(); // see game/game.js
            });
        }
    });

    $("#game").on("keydown", game_controls); // see game/game.js

})