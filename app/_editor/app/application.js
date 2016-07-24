'use strict'

let Express = require('express');
let BodyParser = require('body-parser');
let Morgan = require('morgan');
let fs = require('fs');
let app = Express();
// XXX ignore file mode...
let stream = fs.createWriteStream('/var/log/app/editor.log', { mode: 0o666 });

app.use(Express.static('/opt/app/_editor/app/public'));
app.use(BodyParser.urlencoded({ extended: false }));
app.use(Morgan({ stream: stream }));

app.use('/', require('./controllers/index'));
app.use('/entry', require('./controllers/entry'));
app.use('/shell', require('./controllers/shell'));

module.exports = app;
