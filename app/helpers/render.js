'use strict';

let Render = {
	_sendProxy: (res, body) => {
		console.log(body);
		if (body !== null) {
			res.send(body);
		} else {
			res.sendStatus(404);
		}
	},
	notFound: (res) => {
		res.sendStatus(404);
	},
	json: (res, body) => {
		res.contentType('application/json');
		Render._sendProxy(res, JSON.stringify(body));
	},
	csv: (res, body) => {
		let CSV = require('./csv');
		res.contentType('text/csv');
		Render._sendProxy(res, CSV.stringify(body));
	}
};

module.exports = Render;