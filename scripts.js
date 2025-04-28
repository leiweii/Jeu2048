const container = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

let board = [];
let score = 0;

// Initialize board
function initBoard() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    addRandomTile();
    addRandomTile();
    updateBoard();
}

// Add a random tile (2 or 4)
function addRandomTile() {
    let emptyTiles = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({ r, c });
            }
        }
    }
    if (emptyTiles.length > 0) {
        let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Update the board view
function updateBoard() {
    container.innerHTML = '';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] !== 0) {
                const tile = document.createElement('div');
                tile.classList.add('tile', 'tile-' + board[r][c]);
                tile.innerText = board[r][c];
                tile.style.top = `${r * 100}px`;
                tile.style.left = `${c * 100}px`;
                tile.classList.add('new');
                container.appendChild(tile);
            }
        }
    }
    scoreDisplay.innerText = "Score : " + score;
}

// Handle swipe
function move(dir) {
    let rotated = rotateBoard(dir);
    let moved = false;

    for (let r = 0; r < 4; r++) {
        let row = rotated[r].filter(val => val);
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row[i + 1] = 0;
            }
        }
        row = row.filter(val => val);
        while (row.length < 4) {
            row.push(0);
        }
        rotated[r] = row;
    }

    let newBoard = rotateBoardBack(rotated, dir);

    if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
        board = newBoard;
        moved = true;
    }

    if (moved) {
        addRandomTile();
        updateBoard();
        checkGameOver();
    }
}

// Rotate board based on direction
function rotateBoard(dir) {
    let newBoard = board.map(row => [...row]);
    if (dir === 'up') {
        newBoard = transpose(newBoard);
    } else if (dir === 'down') {
        newBoard = transpose(newBoard).map(row => row.reverse());
    } else if (dir === 'right') {
        newBoard = newBoard.map(row => row.reverse());
    }
    return newBoard;
}

// Rotate back
function rotateBoardBack(rotated, dir) {
    let newBoard = rotated.map(row => [...row]);
    if (dir === 'up') {
        newBoard = transpose(newBoard);
    } else if (dir === 'down') {
        newBoard = transpose(newBoard.map(row => row.reverse()));
    } else if (dir === 'right') {
        newBoard = newBoard.map(row => row.reverse());
    }
    return newBoard;
}

// Transpose matrix
function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

// Check if game is over
function checkGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return;
            if (r < 3 && board[r][c] === board[r + 1][c]) return;
            if (c < 3 && board[r][c] === board[r][c + 1]) return;
        }
    }
    setTimeout(() => {
        alert('Game Over! Your score: ' + score);
    }, 100);
}

// Listen for key events
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
});

// Restart button
restartBtn.addEventListener('click', () => {
    score = 0;
    initBoard();
});

// Start the game
initBoard();
