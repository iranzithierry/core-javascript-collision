// kill $(lsof -t -i:5000)

const http = require('http');
const express = require('express');
const globalSocketIo = require('./io');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected on socket:', socket.id);
    globalSocketIo(socket, io);
});
server.listen(5000, () => {
    console.log('listening on *:5000');
});
