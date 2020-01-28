console.log("HELLO");

var iconTypes = ["asdf",
];

var delta = 0;
var wheelEventTime = Date.now();

var sections = ["first",
    "second",
    "third",
    "forth"];
var currentSection = 0;

function scroll_to(id) {
    $('html,body').animate({
        scrollTop: $('#' + id).offset().top
    }, 'slow');
}

window.addEventListener("wheel", event => {

    if (Date.now() - wheelEventTime > 500) {
        delta = Math.sign(event.deltaY);
        console.log(event.deltaY);

        if (delta > 0) {
            if (currentSection < sections.length - 1) {
                currentSection++;
            }
        }

        if (delta < 0) {
            if (currentSection > 0) {
                currentSection--;
            }
        }

        scroll_to(sections[currentSection]);
    }
    wheelEventTime = Date.now();
});

var body = $("div");

var amount = 2000;
var dir = 1;

$(document).ready(function () {
    $(".button").click(function (event) {
        var id = event.target.id;

        console.log(id);
        $("#" + id).stop().animate({ scrollLeft: (amount * dir) }, 500, 'swing', function () {
        });
        dir *= (-1);
    });
});

var id;

$('.icon').mouseenter(function () {
    console.log("ICON ENTER");

    id = event.target.id;

    $(".icon-desc#" + id).css("height", "auto");
    $(".icon-desc#" + id).css("padding", "1.25vw");
    console.log("mouseenter ON " + id);
}).mouseleave(function () {
    $(".icon-desc#" + id).css("height", "0px");
    $(".icon-desc#" + id).css("padding", "0px 1.25vw 0px 1.25vw");
    console.log("mouseleave ON " + id);
});