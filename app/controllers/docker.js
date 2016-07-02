'use strict';

let Entity = require('../entities/docker');
let router = require('express').Router();

router.get('/', (req, res) => {
	console.log(`index able!! ${req.query.query}`);
	let args = req.query.query.split(' ');
	let command = args.shift();
	let result = Entity.command(command, args);
	res.sendJSON(result);
});

module.exports = router;