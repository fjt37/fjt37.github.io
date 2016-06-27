$(document).ready(function() {

    var set_url = function() {
        var url = $("#url").val();
        // create an a tag with the url as its link, parses it for you
        var link = $("<a>", {href: url});
        console.log(link);
        link = link[0];
        if (link.hostname == "www.youtube.com" && link.pathname == "watch") {
            console.log($("#video"));
            $("#video").attr("src", url);
            console.log("url set to: " + url);
        }
        else
            console.log("not set to: " + url);
    };

    $("#url").keypress(function(e) {
        if (e.which == 13)
            set_url();
    })

    $("#loop-it").click(set_url);

});