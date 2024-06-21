const { PeerServer } = require('peer');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const peerServer = PeerServer({ port: 9000 });

let peers = [];

peerServer.on('connection', (client) => {
    console.log('Client connected:', client.id);
    peers.push(client.id);
    io.emit('update-peer-list', { peers: peers });
    console.log('Peers connected:', peers.length);
});

peerServer.on('disconnect', (client) => {
    console.log('Client disconnected:', client.id);
    peers = peers.filter(peerId => peerId !== client.id);
    io.emit('update-peer-list', { peers: peers, client: client });
});

io.on('connection', (socket) => {
    console.log('New socket connection');
    // socket.emit('update-peer-list', { peers: peers });

    socket.on('register-peer', (peerId) => {
        if (!peers.includes(peerId)) {
            console.log('Registering');
            peers.push(peerId);
            io.emit('update-peer-list', { peers: peers });
        }
    });
});

server.listen(3000, () => {
    console.log('Socket.IO server running on port 3000');
});
