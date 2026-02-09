// multiplayer-hangman-game game logic script

// Socket.IO setup
const socket = io();

// Game state management
let gameState = {
    word: '', // the word to guess
    attempts: [], // letters guessed
    maxAttempts: 6 // maximum incorrect attempts
};

// Function to start the game
function startGame() {
    // initialization logic here
    socket.emit('startGame');
}

// Event handler for receiving game data
socket.on('gameData', (data) => {
    gameState.word = data.word;
    gameState.attempts = data.attempts;
    renderGame();
});

// Event handler for letter guesses
function guessLetter(letter) {
    if (!gameState.attempts.includes(letter)) {
        gameState.attempts.push(letter);
        socket.emit('guess', letter);
    }
}

// UI interaction function for rendering game state
function renderGame() {
    const displayWord = gameState.word.split('').map(letter => {
        return gameState.attempts.includes(letter) ? letter : '_';
    }).join(' ');

    document.getElementById('word-display').innerText = displayWord;
    document.getElementById('attempts').innerText = `Attempts: ${gameState.attempts.join(', ')}`;

    if (gameState.attempts.length >= gameState.maxAttempts) {
        // Handle game over logic
        alert('Game Over!');
    }
}

// Start the game when the script is loaded
startGame();