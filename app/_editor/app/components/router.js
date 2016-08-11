'use strict';

const Projector = require('../components/projector');
const Render = require('../helpers/render');

class Router {
	constructor () {
		this.req = null;
		this.res = null;
	}

	bind () {
		const self = this;
		const router = require('express').Router();
		for (const route of self._routes()) {
			router[route.method](route.path, (req, res) => {
				self._dispatch(route.on, route.args, req, res);
			});
		}
		return router;
	}

	view (response, out = 'json', filter = null) {
		const keys = filter || this._keys().join('|');
		const accept = keys.split('|');
		Render[out](this.res, Projector.select(response, accept));
	}

	_keys () {
		return ['id'];
	}

	_routes () {
		return [
			{
				method: 'get',
				on: 'index',
				path: '/.:ext(json|csv)',
				args: ['params.ext', 'query.filter']
			},
			{
				method: 'get',
				on: 'show',
				path: '/:id([\\d]+).:ext(json|csv)',
				args: ['params.id', 'params.ext', 'query.filter']
			},
			{
				method: 'delete',
				on: 'destroy',
				path: '/:id([\\d]+).:ext(json|csv)',
				args: ['params.id', 'params.ext', 'query.filter']
			},
		];
	}

	_dispatch (on, argKeys, req, res) {
		this.req = req;
		this.res = res;
		const args = this._parseArgs(argKeys, this.req);
		console.log('Dispached.', on, args);
		this[on](...args);
	}

	_parseArgs (argKeys, req) {
		let args = [];
		let curr = null;
		for (const keys of argKeys) {
			curr = req;
			for (const key of keys.split('.')) {
				if (key in curr) {
					curr = curr[key];
				} else {
					curr = req;
					break;
				}
			}
			if (curr !== req) {
				args.push(curr);
			}
		}
		return args;
	}
}

module.exports = Router;
