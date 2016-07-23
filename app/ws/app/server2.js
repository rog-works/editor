'use strict'

let Express = require('express');
let app = Express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

console.log('launch app');

io.on('connection', (socket) => {
	console.log('connect ' + Date.now());
	socket.on('chat', (msg) => {
		console.log('chat ' + msg);
		socket.broadcast.emit('chat', msg);
	});
});

console.log('launch socket.io');

http.listen(process.env.PORT, () => {
    console.log('listen on ws');
});
