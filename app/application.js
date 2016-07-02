'use strict'

let Express = require('express');
let BodyParser = require('body-parser');
let app = Express();

app.use(Express.static('/opt/app/public'));
app.use(BodyParser.urlencoded({ extended: false }));

app.use('/', require('./controllers/index'));
app.use('/file', require('./controllers/file'));
//app.use('/git', require('./controllers/git'));
app.use('/docker', require('./controllers/docker'));
//app.use('/log', require('./controllers/log'));

module.exports = app;
