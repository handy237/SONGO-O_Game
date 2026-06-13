// État du jeu
let board = [
    [5,5,5,5,5,5,5], // Nord (joueur 0)
    [5,5,5,5,5,5,5]  // Sud (joueur 1)
];
let scores = [0, 0];   // graine collectées par chaque joueur
let currentPlayer = 0; // 0 = Nord, 1 = Sud
let gameOver = false;

// Éléments DOM
const northRow = document.getElementById('northRow');
const southRow = document.getElementById('southRow');
const turnMsg = document.getElementById('turnMsg');
const infoMsg = document.getElementById('infoMsg');
const scoreNordSpan = document.getElementById('scoreNord');
const scoreSudSpan = document.getElementById('scoreSud');

// Mise à jour de l'affichage
function renderBoard() {
    northRow.innerHTML = '';
    southRow.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        let cellNorth = document.createElement('div');
        cellNorth.className = 'cell';
        cellNorth.textContent = board[0][i];
        cellNorth.addEventListener('click', (function(idx) { return function() { playMove(0, idx); }; })(i));
        northRow.appendChild(cellNorth);
        
        let cellSouth = document.createElement('div');
        cellSouth.className = 'cell';
        cellSouth.textContent = board[1][i];
        cellSouth.addEventListener('click', (function(idx) { return function() { playMove(1, idx); }; })(i));
        southRow.appendChild(cellSouth);
    }
    scoreNordSpan.textContent = scores[0];
    scoreSudSpan.textContent = scores[1];
    turnMsg.textContent = gameOver ? "Partie terminée." : `Tour du Joueur ${currentPlayer === 0 ? 'Nord' : 'Sud'} (cliquez sur une case de votre rangée)`;
}

// Distribution des graines
// Ordre global des cases dans le sens horaire (sens unique)
// Chaque élément est [rangée, colonne] avec rangée 0 = Nord, 1 = Sud
const HORAIRE_ORDER = [
    [1,6], [1,5], [1,4], [1,3], [1,2], [1,1], [1,0], // Sud de droite à gauche
    [0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6]  // Nord de gauche à droite
];

// Distribution : on utilise l'ordre horaire
function distribute(player, startCol) {
    let seeds = board[player][startCol];
    if (seeds === 0) return null;
    board[player][startCol] = 0;

    // Trouver l'index de la case de départ dans l'ordre horaire
    let startIndex = -1;
    for (let i = 0; i < HORAIRE_ORDER.length; i++) {
        let [r, c] = HORAIRE_ORDER[i];
        if (r === player && c === startCol) {
            startIndex = i;
            break;
        }
    }
    if (startIndex === -1) return null;

    let pos = startIndex;
    let fullCycles = 0;
    while (seeds > 0) {
        pos = (pos + 1) % HORAIRE_ORDER.length;
        if (pos === 0) fullCycles++;
        let [row, col] = HORAIRE_ORDER[pos];
        board[row][col]++;
        seeds--;
    }
    let [lastRow, lastCol] = HORAIRE_ORDER[pos];
    return { lastRow, lastCol, fullCycles };
}
// Prise simple (sans chaîne pour l'instant)
function capture(opponent, lastCol, lastRow, fullCycles) {
    // Si la dernière case est dans le camp adverse (opponent) et que la case n'est pas la première adverse (col 0) sauf si fullCycles > 0
    if (lastRow === opponent) {
        let seedsInLast = board[opponent][lastCol];
        if (seedsInLast === 2 || seedsInLast === 3 || seedsInLast === 4) {  
            // Cas particulier : première case adverse et fullCycles == 0 -> pas de prise
            if (lastCol === 0 && fullCycles === 0) {
                return 0;
            }
            // Sinon, prise
            let taken = seedsInLast;
            board[opponent][lastCol] = 0;
            return taken;
        }
    }
    return 0;
}

// Vérifier la fin de partie (simplifié : si un score >= 40 ou total graines < 10)
function checkGameOver() {
    let totalSeeds = 0;
    for (let i = 0; i < 2; i++)
        for (let j = 0; j < 7; j++)
            totalSeeds += board[i][j];
    totalSeeds += scores[0] + scores[1];
    if (scores[0] >= 40 || scores[1] >= 40 || totalSeeds < 10) {
        gameOver = true;
        let winner = scores[0] >= 40 ? "Nord" : (scores[1] >= 40 ? "Sud" : "Match nul (moins de 10 graines)");
        infoMsg.textContent = `Fin de partie ! ${winner} gagne. Scores: Nord ${scores[0]} - Sud ${scores[1]}`;
        turnMsg.textContent = "Partie terminée. Cliquez sur Nouvelle partie.";
        return true;
    }
    return false;
}
// Exécuter un coup
function playMove(player, col) {
    if (gameOver) {
        infoMsg.textContent = "La partie est finie, cliquez sur 'Nouvelle partie'.";
        return;
    }
    if (player !== currentPlayer) {
        infoMsg.textContent = "Ce n'est pas votre tour !";
        return;
    }
    if (board[player][col] === 0) {
        infoMsg.textContent = "Cette case est vide, choisissez une autre.";
        return;
    }
    
    infoMsg.textContent = "";
    let result = distribute(player, col);
    if (!result) return;
    let { lastRow, lastCol, fullCycles } = result;
    
    // Prise
    let opponent = 1 - player;
    let taken = capture(opponent, lastCol, lastRow, fullCycles);
    if (taken > 0) {
        scores[player] += taken;
        infoMsg.textContent = `Prise de ${taken} graine(s) !`;
    }
    
    // Changer de joueur
    currentPlayer = opponent;
    
    renderBoard();
    if (checkGameOver()) {
        renderBoard();
    }
}

// Réinitialisation
function resetGame() {
    board = [
        [5,5,5,5,5,5,5],
        [5,5,5,5,5,5,5]
    ];
    scores = [0, 0];
    currentPlayer = 0;
    gameOver = false;
    infoMsg.textContent = "";
    renderBoard();
}

// Retour à l'accueil
function goHome() {
    window.location.href = "index.html";
}

// Écouteurs
document.getElementById('resetBtn').addEventListener('click', resetGame);
document.getElementById('homeBtn').addEventListener('click', goHome);

// Initialisation
resetGame();