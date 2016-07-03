'use strict';

let Entity = require('../entities/entry');
let Render = require('../helpers/render');
let router = require('express').Router();

router.get('/', (req, res) => {
	console.log('index able!!');
	Render.json(res, Entity.entries());
});

router.get('/:path([\\w\\-./]+)', (req, res) => {
	console.log('show able!!', req.params.path);
	Render.json(res, Entity.at(req.params.path));
});

router.post('/', (req, res) => {
	console.log(`create able!! ${req.body.content}`);
	Render.json(res, Entity.create(req.params.path));
});

router.put('/:path([\\w\\-./]+)', (req, res) => {
	console.log(`update able!! ${req.params.path} ${req.body.content}`);
	Render.json(res, Entity.update(req.params.path, req.body.content));
});

router.options('/:path([\\w\\-./]+)/:to([\\w\\-./]+)', (req, res) => {
	console.log(`rename able!! ${req.params.path} ${req.body.to}`);
	Render.json(res, Entity.rename(req.params.path, req.body.to));
});

router.delete('/:path([\\w\\-./]+)', (req, res) => {
	console.log('destroy able!!', req.params.path);
	Render.json(res, Entity.destroy(req.params.path));
});

module.exports = router;