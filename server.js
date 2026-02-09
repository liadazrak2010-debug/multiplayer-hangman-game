const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let players = {};
let currentWord = '';
let currentGuesses = [];

function getRandomWord() {
    const words = ['javascript', 'node', 'socket', 'express', 'hangman'];
    return words[Math.floor(Math.random() * words.length)];
}

// Serve static files if needed
app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New player connected: ' + socket.id);

    socket.on('joinGame', (playerName) => {
        players[socket.id] = playerName;
        socket.emit('welcome', `Welcome ${playerName}!`);
        io.emit('updatePlayers', Object.values(players));
    });

    socket.on('startGame', () => {
        currentWord = getRandomWord();
        currentGuesses = [];
        io.emit('gameStarted', currentWord);
    });

    socket.on('makeGuess', (letter) => {
        if (!currentGuesses.includes(letter)) {
            currentGuesses.push(letter);
            io.emit('newGuess', { letter, currentGuesses });
        }
    });

    socket.on('disconnect', () => {
        console.log('Player disconnected: ' + socket.id);
        delete players[socket.id];
        io.emit('updatePlayers', Object.values(players));
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});