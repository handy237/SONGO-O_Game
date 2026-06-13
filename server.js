const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// État initial du jeu
let gameState = {
    board: [
        [5,5,5,5,5,5,5],
        [5,5,5,5,5,5,5]
    ],
    scores: [0,0],
    currentPlayer: 0,
    gameOver: false
};

// Ordre horaire unique (sens horaire)
const HORAIRE_ORDER = [
    [1,6],[1,5],[1,4],[1,3],[1,2],[1,1],[1,0],
    [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]
];

function distribute(board, player, startCol) {
    let seeds = board[player][startCol];
    if (seeds === 0) return null;
    board[player][startCol] = 0;
    let startIndex = HORAIRE_ORDER.findIndex(cell => cell[0]===player && cell[1]===startCol);
    if (startIndex === -1) return null;
    let pos = startIndex;
    let fullCycles = 0;
    while (seeds > 0) {
        pos = (pos+1) % HORAIRE_ORDER.length;
        if (pos === 0) fullCycles++;
        let [r,c] = HORAIRE_ORDER[pos];
        board[r][c]++;
        seeds--;
    }
    let [lastRow, lastCol] = HORAIRE_ORDER[pos];
    return { lastRow, lastCol, fullCycles };
}

function capture(board, scores, player, lastRow, lastCol, fullCycles) {
    let opponent = 1 - player;
    if (lastRow === opponent) {
        let seeds = board[opponent][lastCol];
        if (seeds === 2 || seeds === 3 || seeds === 4) {
            if (lastCol === 0 && fullCycles === 0) return 0;
            board[opponent][lastCol] = 0;
            scores[player] += seeds;
            return seeds;
        }
    }
    return 0;
}

function checkGameOver(state) {
    let total = state.board[0].reduce((a,b)=>a+b,0) + state.board[1].reduce((a,b)=>a+b,0) + state.scores[0] + state.scores[1];
    if (state.scores[0] >= 40 || state.scores[1] >= 40 || total < 10) {
        state.gameOver = true;
        return true;
    }
    return false;
}

// Routes API
app.get('/api/state', (req, res) => {
    res.json(gameState);
});

app.post('/api/play', (req, res) => {
    const { player, col } = req.body;
    if (gameState.gameOver) return res.json(gameState);
    if (player !== gameState.currentPlayer) return res.json(gameState);
    if (gameState.board[player][col] === 0) return res.json(gameState);

    const result = distribute(gameState.board, player, col);
    if (result) {
        capture(gameState.board, gameState.scores, player, result.lastRow, result.lastCol, result.fullCycles);
        gameState.currentPlayer = 1 - player;
        checkGameOver(gameState);
    }
    res.json(gameState);
});

app.post('/api/reset', (req, res) => {
    gameState = {
        board: [[5,5,5,5,5,5,5],[5,5,5,5,5,5,5]],
        scores: [0,0],
        currentPlayer: 0,
        gameOver: false
    };
    res.json(gameState);
});

// Servir la page HTML (optionnel, pour simplifier)
app.use(express.static('.'));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur Songo démarré sur http://localhost:${PORT}`);
});