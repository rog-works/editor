'use strict';

let Entity = require('../entities/shell');
let Render = require('../helpers/render');
let router = require('express').Router();

router.post('/', (req, res) => {
	console.log(`index able!! ${req.body.query}`);
	let args = req.body.query.split(' ');
	let command = args.shift();
	let result = (new Entity()).run(command, args);
	Render.json(res, result);
});

module.exports = router;