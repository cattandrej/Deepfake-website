console.log("HELLO");
updateAutoMargin();

const _sections = [
    "first",
    "second",
    "third",
    "forth",
    "fifth",
    "sixth",
    "seventh"
];

//
// CONST VARIABLES
// 
const _visible = "visible";
const _hidden = "hidden";

// resizable: div element can change size
const _resizable = "resizable";
// resizable: div element cannot change size
const _fixed = "fixed";

//
// SECTIONS DECLARATION
//
class Section {
    constructor(id, type, status) {
        this.id = id;
        this.type = type;
        this.status = status;
        this.dir = 1;
    }
}

//
// SECTIONS BEHAVIOUR DESCRIPTION
//
var sectionList = [
    new Section(_sections[0], _fixed, _visible),
    new Section(_sections[1], _fixed, _visible),
    new Section(_sections[2], _fixed, _visible),
    new Section(_sections[3], _resizable, _visible),
    new Section(_sections[4], _fixed, _visible),
    new Section(_sections[5], _fixed, _visible),
    new Section(_sections[6], _resizable, _visible)
]

//
// LOCK SCROLLING TO PAGES
//
var delta = 0;
var wheelEventTime = Date.now();

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
            if (currentSection < _sections.length - 1) {
                currentSection++;
            }
        }

        if (delta < 0) {
            if (currentSection > 0) {
                currentSection--;
            }
        }

        scroll_to(_sections[currentSection]);
    }
    wheelEventTime = Date.now();
});

//
// SCREEN RESIZING AND
// VIEWPORT VW CALCULATION
//
var body = $("div");
var vw = $( window ).width() / 100;
var amount = vw * 5;

$(window).resize(function() {
    var tmp = vw;
    vw = $(window).width() / 100;

    amount = vw * (amount / tmp);

    updateAutoMargin();
});


var dir = 1;

var isHidden = false;

//
// SCROLLING AND RESIZING ANIMATION
//
$(document).ready(function () {
    $(".button, #plus, #minus").click(function (event) {

        var id = event.target.id;
        if (event.target.id === "plus" || event.target.id === "minus") {
            id = $(this).closest('div').attr('id');
        }
        console.log(id);


        //
        // RESIZING
        //
        //console.log($(".video-main#" + id).css('width'));


        // SELECTING CURRENT SECTION
        var i = 0;
        while (sectionList[i].id != id) {
            i++;
        }

        console.log(event.target.id + ": I've found section number " + i + " whit id " + id);

        $( "div.button#" + id + " > p#plus" ).toggle();
        $( "div.button#" + id + " > p#minus" ).toggle();

        if (sectionList[i].type === _fixed) {
            console.log("I AM FIXED!");

            //
            // SCROLLING
            //
            $("#" + id).stop().animate({ scrollLeft: (7 * amount * sectionList[i].dir) }, 250, 'swing', function () {
            });

            sectionList[i].dir *= (-1);
        } else {
            console.log(sectionList[i]);
            console.log("I AM RESIZABLE!");

            if (sectionList[i].status === _visible) {
                $(".video-main#" + id).css("width","55vw");
                $(".wide#" + id).css("width","115vw");  
                sectionList[i].status = _hidden;

            } else {
                $(".video-main#" + id).css("width","90vw");
                $(".wide#" + id).css("width","150vw");
                sectionList[i].status = _visible;
            }
        }
    });
});


//
// ICON DESCRIPTION ANIMATION
//
var id;

$('.icon').mouseenter(function (event) {
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

function updateAutoMargin() {
    var margin = (window.innerHeight - (($(window).width() * 9) / 16)) / 2;
    console.log("H = " + window.innerHeight + "; W = " + $(window).width());
    console.log(margin);
    $(".auto-margin").css("height", margin + "px");
}