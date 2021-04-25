const metronome = document.querySelector("#metronome-arm");
const body = document.body;
const h1 = document.querySelector("h1");
const leftClick = document.querySelector("#left-click");
const rightClick = document.querySelector("#right-click");
const fontColor = "#e4f876";
const backgroundColor = "#00191b"
const BPM_MIN = 1;
const BPM_MAX = 300;
const CLICK_DOT_TIMEOUT = 50;
const clickSound = new Audio('sounds/click.mp3');

var bpm;
var timeout;
var clickIntervalId;

updateClickInterval();
body.addEventListener("click", startStopMetronome);
body.addEventListener("wheel", changeBpm);

function updateClickInterval() {
    bpm = parseInt(h1.textContent);
    timeout = 60000 / bpm;
    clearInterval(clickIntervalId);
    clickIntervalId = setInterval(click, timeout);
}

function startStopMetronome() {
    if(metronome.classList.length === 0) {
        metronome.classList.add("right");
    } else {
        metronome.classList.remove("left");
        metronome.classList.remove("right");
    }
}

function changeBpm(event) {
    if(parseFloat(event.deltaY) > 0) {
        if(bpm > BPM_MIN) {
            bpm -= 1;
        }
    } else if(parseFloat(event.deltaY) < 0) {
        if(bpm < BPM_MAX) {
            bpm += + 1;
        }
    }

    h1.innerHTML = bpm;
    updateClickInterval();
    metronome.style.transition = "transform " + timeout + "ms linear"
}

function click() {
    if(metronome.classList.contains("left")) {
        moveMetronomeArm("left", "right", leftClick);
    } else if(metronome.classList.contains("right")) {
        moveMetronomeArm("right", "left", rightClick);
    }
}

function moveMetronomeArm(moveFrom, moveTo, dot) {
    metronome.classList.remove(moveFrom);
    metronome.classList.add(moveTo);
    dot.style.color = backgroundColor;
    clickSound.play();
    setTimeout(function() {
        dot.style.color = fontColor;
    }, CLICK_DOT_TIMEOUT);
}
