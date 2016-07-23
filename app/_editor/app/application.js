'use strict'

let Express = require('express');
let BodyParser = require('body-parser');
let Morgan = require('morgan');
let fs = require('fs');
let app = Express();
let stream = fs.createWriteStream('/var/log/app/editor.log');

app.use(Express.static('/opt/app/_editor/app/public'));
app.use(BodyParser.urlencoded({ extended: false }));
app.use(Morgan({ stream: stream }));

app.use('/', require('./controllers/index'));
app.use('/entry', require('./controllers/entry'));
app.use('/shell', require('./controllers/shell'));
// app.use('/log', require('./controllers/log'));
/*
let http = require('http').Server(app);
let io = require('socket.io')(http);

console.log('launch app');

io.on('connection', (socket) => {
	console.log('connect ' + Date.now());
	socket.on('chat', (msg) => {
		console.log('chat ' + msg);
		io.emit('chat', msg);
	});
});

console.log('launch socket.io');

module.exports = http;*/
module.exports = app;
