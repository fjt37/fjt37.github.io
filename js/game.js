function create_game() {
    var canvas = $("#game > canvas")[0].getContext("2d");
}

$(document).ready(function() {

    var transition_duration = 400;

    $("#game-button").click(function() {
        if ($("#bio").is(":visible")) {
            $("#bio").slideUp(transition_duration, function() {
                $("#game").fadeIn(transition_duration);
                $("#game-button").text("Bio");
            });

        }
        else {
            $("#game").fadeOut(transition_duration, function () {
                $("#bio").slideDown(transition_duration);
                $("#game-button").text("Game");
            });
            create_game();
        }
    });

})