const score1Display = document.querySelector("#score1");
const score2Display = document.querySelector("#score2");
const playingTo = document.querySelector("select");
const player1Btn = document.querySelector("#player1");
const player2Btn = document.querySelector("#player2");
const resetBtn = document.querySelector("#reset");

let score1;
let score2;
let maxScore;
reset();
player1Btn.addEventListener("click", incrementScore1);
player2Btn.addEventListener("click", incrementScore2);
resetBtn.addEventListener("click", reset);

playingTo.addEventListener("change", (event) => {
    reset();
});

function reset() {
    score1 = 0;
    score2 = 0;
    maxScore = parseInt(playingTo.value);
    score1Display.classList.remove("has-text-success");
    score1Display.classList.remove("has-text-danger");
    score2Display.classList.remove("has-text-success");
    score2Display.classList.remove("has-text-danger");
    update();
}

function update() {
    score1Display.innerHTML = `${score1}`;
    score2Display.innerHTML = `${score2}`;
    player1Btn.disabled = isGameOver();
    player2Btn.disabled = isGameOver();

    if (didPlayer1Win()) {
        score1Display.classList.add("has-text-success");
        score2Display.classList.add("has-text-danger");
    } else if (didPlayer2Win()) {
        score1Display.classList.add("has-text-danger");
        score2Display.classList.add("has-text-success");
    }
}

function isGameOver() {
    return didPlayer1Win() || didPlayer2Win();
}

function didPlayer1Win() {
    return score1 === maxScore;
}

function didPlayer2Win() {
    return score2 === maxScore;
}

function incrementScore1() {
    score1++;
    update();
}

function incrementScore2() {
    score2++;
    update();
}
