let board = document.getElementById("board");

// 🐍 snakes & 🪜 ladders
let jump = {
    3: 22,
    5: 8,
    11: 26,
    17: 4,
    19: 7,
    27: 1,
    32: 50,
    36: 44,
    48: 30,
    62: 81,
    71: 92,
    88: 24
};

// 🎮 player positions
let pos1 = 1;
let pos2 = 1;

// 🔄 turn
let turn = 1;

// 🧱 CREATE BOARD (WITH SNAKE & LADDER COLORS + EMOJI)
for (let i = 100; i >= 1; i--) {
    let cell = document.createElement("div");
    cell.className = "cell";
    cell.id = "cell" + i;
    cell.innerText = i;

    // 🪜 ladder cells
    if ([3,5,11,32,62,71].includes(i)) {
        cell.style.background = "#22c55e";
        cell.innerText += " 🪜";
    }

    // 🐍 snake cells
    if ([17,19,27,48,88].includes(i)) {
        cell.style.background = "#ef4444";
        cell.innerText += " 🐍";
    }

    board.appendChild(cell);
}

// 🔴 PLAYER 1
let p1 = document.createElement("div");
p1.className = "p1";

// 🔵 PLAYER 2
let p2 = document.createElement("div");
p2.className = "p2";

// start position
document.getElementById("cell1").appendChild(p1);
document.getElementById("cell1").appendChild(p2);


// 🚶 STEP-BY-STEP MOVEMENT (ANIMATION)
async function moveStep(player, start, end) {
    let step = start < end ? 1 : -1;

    for (let i = start; i !== end + step; i += step) {
        await new Promise(resolve => setTimeout(resolve, 120));

        let cell = document.getElementById("cell" + i);
        cell.appendChild(player);
    }
}


// 🎲 DICE FUNCTION (FULL GAME LOGIC)
async function rollDice() {
    let dice = Math.floor(Math.random() * 6) + 1;

    document.getElementById("dice").innerText = "🎲 Dice: " + dice;

    if (turn === 1) {

        let start = pos1;
        let end = pos1 + dice;

        if (end > 100) end = 100;

        // 🚶 walk
        await moveStep(p1, start, end);

        pos1 = end;

        // 🐍🪜 snake or ladder
        if (jump[pos1]) {
            let finalPos = jump[pos1];

            await new Promise(r => setTimeout(r, 300));

            if (finalPos > pos1) {
                document.getElementById("dice").innerText = "🪜 Climbing Ladder!";
            } else {
                document.getElementById("dice").innerText = "🐍 Bitten by Snake!";
            }

            await moveStep(p1, pos1, finalPos);
            pos1 = finalPos;
        }

        if (pos1 === 100) {
            alert("Player 1 Wins 🏆");
            return;
        }

        turn = 2;
        document.getElementById("turn").innerText = "Turn: Player 2 🔵";

    } else {

        let start = pos2;
        let end = pos2 + dice;

        if (end > 100) end = 100;

        await moveStep(p2, start, end);

        pos2 = end;

        if (jump[pos2]) {
            let finalPos = jump[pos2];

            await new Promise(r => setTimeout(r, 300));

            if (finalPos > pos2) {
                document.getElementById("dice").innerText = "🪜 Climbing Ladder!";
            } else {
                document.getElementById("dice").innerText = "🐍 Bitten by Snake!";
            }

            await moveStep(p2, pos2, finalPos);
            pos2 = finalPos;
        }

        if (pos2 === 100) {
            alert("Player 2 Wins 🏆");
            return;
        }

        turn = 1;
        document.getElementById("turn").innerText = "Turn: Player 1 🔴";
    }
}