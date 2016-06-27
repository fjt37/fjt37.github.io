$(document).ready(function() {

    var eggs = [
        $("<p id='egg0' class='space-under'>Side note: easter eggs are fun :)</p>"),
        $("<p id='egg1' class='space-under'>Also, I left out someone very important, but she knows who she is &hearts;</p>")
    ];

    $(".easter-egg").click(function() {
        console.log($(this).data("egg-num"));
        var egg = eggs[$(this).data("egg-num")];
        if ($("body").has(egg).length) {
            egg.remove();
        } else {
            $("body").append(egg);
        }
    });

})