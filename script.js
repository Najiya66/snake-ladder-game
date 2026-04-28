document.addEventListener("DOMContentLoaded", () => {

let board = document.getElementById("board");

let pos1 = 0;
let pos2 = 0;
let turn = 1;

let p1Started = false;
let p2Started = false;

let player1Name = "Player 1";
let player2Name = "Player 2";

/* 🎧 SOUNDS */
let diceSound = new Audio("sounds/dice-roll.mp3");
let ladderSound = new Audio("sounds/ladder.mp3");
let snakeSound = new Audio("sounds/snake.mp3");
let enterSound = new Audio("sounds/enter.mp3");

diceSound.volume = 0.6;
ladderSound.volume = 0.7;
snakeSound.volume = 0.7;
enterSound.volume = 0.7;

/* 🐍🪜 PATHS */
let paths = {
    4:[4,5,15,14],
    9:[9,12,30,31],
    25:[25,26,34,33,32],
    28:[28,34,47,55,65,76,84],
    51:[51,52,68,67],
    71:[71,90,91],
    21:[21,39,42],
    80:[80,82,90],

    17:[17,4,5,6,7],
    62:[62,59,42,39,22,29,19],
    54:[54,47,34],
    87:[87,74,66,55,45,36,24],
    93:[93,88,73],
    95:[95,86,75],
    98:[98,83,79],
    65:[65,56,44]
};

/* 🧩 PLACE FUNCTION */
function placePlayer(player, pos) {
    let cell = document.getElementById("cell" + pos);
    if (cell) cell.appendChild(player);
}

/* 🏠 START GAME */
document.getElementById("startBtn").addEventListener("click", () => {

    player1Name = document.getElementById("p1name").value || "Player 1";
    player2Name = document.getElementById("p2name").value || "Player 2";

    document.getElementById("name1").innerText = player1Name;
    document.getElementById("name2").innerText = player2Name;

    document.getElementById("homeScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";

    updateUI();
});

/* 🎲 DICE CLICK */
document.getElementById("diceContainer").addEventListener("click", rollDice);

/* 🧱 BOARD */
for (let row = 9; row >= 0; row--) {

    let cells = [];

    for (let col = 1; col <= 10; col++) {
        let num = row * 10 + col;
        cells.push(num);
    }

    if (row % 2 === 0) cells.reverse();

    cells.forEach(i => {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.id = "cell" + i;
        cell.innerText = i;
        board.appendChild(cell);
    });
}

/* PLAYERS */
let p1 = document.createElement("div");
p1.className = "p1";

let p2 = document.createElement("div");
p2.className = "p2";

/* START POSITION */
placePlayer(p1, 1);
placePlayer(p2, 1);

/* UI */
function updateUI() {
    document.getElementById("p1pos").innerText =
        p1Started ? "Position: " + pos1 : "Not Started";

    document.getElementById("p2pos").innerText =
        p2Started ? "Position: " + pos2 : "Not Started";

    document.getElementById("turn").innerText =
        turn === 1 ? "Turn: " + player1Name : "Turn: " + player2Name;
}

/* 🎉 CONFETTI */
function launchConfetti() {
    confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
    });
}

/* 🎲 MAIN GAME */
async function rollDice() {

    /* 🔊 dice sound */
    diceSound.currentTime = 0;
    diceSound.play();

    let cube = document.getElementById("diceCube");
    let text = document.getElementById("dice");

    cube.style.transform =
        `rotateX(${Math.random()*720}deg) rotateY(${Math.random()*720}deg)`;

    text.innerText = "Rolling...";

    await new Promise(r => setTimeout(r, 900));

    let dice = Math.floor(Math.random()*6)+1;
    text.innerText = "You got: " + dice;

    /* PLAYER 1 */
    if (turn === 1) {

        /* 🚀 START RULE */
        if (!p1Started) {
            if (dice === 1) {
                p1Started = true;
                pos1 = 1;
                placePlayer(p1, pos1);

                enterSound.currentTime = 0;
                enterSound.play();

                text.innerText = player1Name + " entered 🎉";
            } else {
                text.innerText = player1Name + " needs 1 to start!";
                turn = 2;
                updateUI();
                return;
            }
        } else {

            pos1 += dice;
            if (pos1 > 100) pos1 = 100;

            placePlayer(p1, pos1);

            /* 🪜 LADDER / 🐍 SNAKE */
            if (paths[pos1]) {

                if (pos1 < paths[pos1].at(-1)) {
                    ladderSound.currentTime = 0;
                    ladderSound.play();
                } else {
                    snakeSound.currentTime = 0;
                    snakeSound.play();
                }

                pos1 = paths[pos1].at(-1);
                placePlayer(p1, pos1);
            }

            if (pos1 === 100) {
                launchConfetti();
                alert(player1Name + " Wins 🏆");
                return;
            }
        }

        turn = 2;
    }

    /* PLAYER 2 */
    else {

        if (!p2Started) {
            if (dice === 1) {
                p2Started = true;
                pos2 = 1;
                placePlayer(p2, pos2);

                enterSound.currentTime = 0;
                enterSound.play();

                text.innerText = player2Name + " entered 🎉";
            } else {
                text.innerText = player2Name + " needs 1 to start!";
                turn = 1;
                updateUI();
                return;
            }
        } else {

            pos2 += dice;
            if (pos2 > 100) pos2 = 100;

            placePlayer(p2, pos2);

            if (paths[pos2]) {

                if (pos2 < paths[pos2].at(-1)) {
                    ladderSound.currentTime = 0;
                    ladderSound.play();
                } else {
                    snakeSound.currentTime = 0;
                    snakeSound.play();
                }

                pos2 = paths[pos2].at(-1);
                placePlayer(p2, pos2);
            }

            if (pos2 === 100) {
                launchConfetti();
                alert(player2Name + " Wins 🏆");
                return;
            }
        }

        turn = 1;
    }

    updateUI();
}

});