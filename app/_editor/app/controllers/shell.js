'use strict';

let Entity = require('../entities/shell');
let Render = require('../helpers/render');
let router = require('express').Router();

router.post('/', (req, res) => {
	console.log(`index able!! ${req.body.query} ${req.query.dir}`);
	let dir = req.query.dir || '';
	let args = req.body.query.split(' ');
	let command = args.shift();
	let options = {cwd: `/opt/app${dir}`};
	let result = (new Entity()).run(command, args, options);
	Render.json(res, result);
});

module.exports = router;