'use strict';

let Entity = require('../entities/entry');
let Render = require('../helpers/render');
let router = require('express').Router();

const PATH_REGULAR = '[\\w\\-.%]+';

router.get('/', (req, res) => {
	console.log('index able!! ' + req.query.dir);
	let dir = req.query.dir || '';
	Render.json(res, Entity.entries(dir));
});

router.get(`/:path(${PATH_REGULAR})`, (req, res) => {
	console.log('show able!!', req.params.path);
	Render.json(res, Entity.at(req.params.path));
});

router.post('/', (req, res) => {
	console.log(`create able!! ${req.body.path}`);
	Render.json(res, Entity.create(req.body.path));
});

router.put(`/:path(${PATH_REGULAR})`, (req, res) => {
	console.log(`update able!! ${req.params.path} ${req.body.content}`);
	Render.json(res, Entity.update(req.params.path, req.body.content));
});

router.put(`/:path(${PATH_REGULAR})/rename`, (req, res) => {
	console.log(`rename able!! ${req.params.path} ${req.query.to}`);
	Render.json(res, Entity.rename(req.params.path, req.query.to));
});

router.delete(`/:path(${PATH_REGULAR})`, (req, res) => {
	console.log('destroy able!!', req.params.path);
	Render.json(res, Entity.destroy(req.params.path));
});

module.exports = router;