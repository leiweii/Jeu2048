const container = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const newGameBtn = document.getElementById('new-game-btn');
const switchGridBtn = document.getElementById('switch-grid');
const fireworks = document.getElementById('fireworks');

let size = 4;
let board = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;

const moveSound = new Audio('assets/sounds/move.mp3');
const mergeSound = new Audio('assets/sounds/merge.mp3');
const winSound = new Audio('assets/sounds/win.mp3');
const loseSound = new Audio('assets/sounds/lose.mp3');

function initBoard() {
    board = Array(size).fill().map(() => Array(size).fill(0));
    addRandomTile();
    addRandomTile();
    updateBoard();
}

function addRandomTile() {
    let empty = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === 0) empty.push({ r, c });
        }
    }
    if (empty.length > 0) {
        let { r, c } = empty[Math.floor(Math.random() * empty.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.forEach((row, r) => {
        row.forEach((value, c) => {
            const tile = document.createElement('div');
            tile.className = 'tile';
            if (value !== 0) {
                tile.textContent = value;
                tile.classList.add('tile-new');
            }
            container.appendChild(tile);
        });
    });
    scoreDisplay.textContent = score;
    bestScoreDisplay.textContent = bestScore;
}

function slide(row) {
    let arr = row.filter(val => val);
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] *= 2;
            score += arr[i];
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
            }
            arr[i + 1] = 0;
            mergeSound.play();
        }
    }
    arr = arr.filter(val => val);
    while (arr.length < size) {
        arr.push(0);
    }
    return arr;
}

function move(direction) {
    let rotated = board;
    if (direction === 'up') rotated = transpose(rotated);
    if (direction === 'down') rotated = transpose(rotated).map(row => row.reverse());
    if (direction === 'right') rotated = rotated.map(row => row.reverse());

    let moved = false;
    rotated = rotated.map(row => {
        const original = [...row];
        const newRow = slide(row);
        if (JSON.stringify(original) !== JSON.stringify(newRow)) moved = true;
        return newRow;
    });

    if (direction === 'up') rotated = transpose(rotated);
    if (direction === 'down') rotated = transpose(rotated).map(row => row.reverse());
    if (direction === 'right') rotated = rotated.map(row => row.reverse());

    board = rotated;

    if (moved) {
        moveSound.play();
        addRandomTile();
        updateBoard();
        checkVictory();
        checkGameOver();
    }
}

function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function checkVictory() {
    for (let row of board) {
        for (let tile of row) {
            if (tile === 2048) {
                fireworks.innerHTML = '<h1>✨ Bravo 2048 ! ✨</h1>';
                fireworks.style.display = 'block';
                winSound.play();
                setTimeout(() => fireworks.style.display = 'none', 3000);
                return;
            }
        }
    }
}

function checkGameOver() {
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] === 0) return;
            if (r < size - 1 && board[r][c] === board[r + 1][c]) return;
            if (c < size - 1 && board[r][c] === board[r][c + 1]) return;
        }
    }
    loseSound.play();
    setTimeout(() => alert("Game Over!"), 200);
}

newGameBtn.addEventListener('click', () => {
    score = 0;
    initBoard();
});

switchGridBtn.addEventListener('click', () => {
    size = size === 4 ? 5 : 4;
    score = 0;
    initBoard();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') move('left');
    else if (e.key === 'ArrowRight') move('right');
    else if (e.key === 'ArrowUp') move('up');
    else if (e.key === 'ArrowDown') move('down');
});

initBoard();
