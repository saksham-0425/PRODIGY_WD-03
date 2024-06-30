const board = document.getElementById('board');
const boxes = document.querySelectorAll('.box');
const singlePlayerButton = document.getElementById('singlePlayer');
const multiPlayerButton = document.getElementById('multiPlayer');
const shadowGameBoard = Array(9).fill(null);
let myPlayerOne = true;
let gameOver = false;
let singlePlayerMode = false;

singlePlayerButton.addEventListener('click', () => startGame(true));
multiPlayerButton.addEventListener('click', () => startGame(false));

function startGame(isSinglePlayer) {
    singlePlayerMode = isSinglePlayer;
    gameOver = false;
    myPlayerOne = true;
    shadowGameBoard.fill(null);
    boxes.forEach(box => box.innerText = '');
    board.classList.remove('hidden');
    setTimeout(() => board.classList.add('visible'), 10);  // Delay for smooth transition
}

function theGame(event) {
    const correctBox = event.target;

    if (correctBox.innerText.length > 0 || gameOver) return;

    const letter = theCharacters();
    correctBox.innerText = letter;
    const chosenIndex = parseInt(correctBox.dataset.boxNumber);
    shadowGameBoard[chosenIndex] = letter;

    if (checkForWinnerOrTie()) return;

    if (singlePlayerMode && !myPlayerOne) {
        setTimeout(aiMove, 500);  // Delay for better UX
    }
}

function checkForWinnerOrTie() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (shadowGameBoard[a] && shadowGameBoard[a] === shadowGameBoard[b] && shadowGameBoard[a] === shadowGameBoard[c]) {
            alert(`${shadowGameBoard[a]} is the winner!`);
            gameOver = true;
            return true;
        }
    }

    if (shadowGameBoard.every(spot => spot !== null)) {
        alert('It\'s a tie!');
        gameOver = true;
        return true;
    }

    return false;
}

function theCharacters() {
    if (myPlayerOne) {
        myPlayerOne = false;
        return 'X';
    } else {
        myPlayerOne = true;
        return 'O';
    }
}

function aiMove() {
    const availableSpots = shadowGameBoard
        .map((spot, index) => (spot === null ? index : null))
        .filter(index => index !== null);

    const randomIndex = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    const correctBox = document.querySelector(`.box[data-box-number='${randomIndex}']`);
    
    if (correctBox) {
        correctBox.innerText = 'O';
        shadowGameBoard[randomIndex] = 'O';
        myPlayerOne = true;
        checkForWinnerOrTie();
    }
}

board.addEventListener('click', theGame);