$(document).ready(function() {

    var transition_duration = 400;

    $("#game-button").click(function() {
        // hide bio and show game
        if ($("#bio").is(":visible")) {
            create_game(); // see game/game.js
            $("#bio").slideUp(transition_duration, function() {
                $("#game").fadeIn(transition_duration);
                $("#game-button").text("Bio")
            });

        }
        // hide game and show bio
        else { 
            $("#game").fadeOut(transition_duration, function () {
                $("#bio").slideDown(transition_duration);
                $("#game-button").text("Game");
            });
        }
    });

})