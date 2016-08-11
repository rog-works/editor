'use strict';

let Entity = require('../entities/entry');
let Router = require('../components/router');

const PATH_REGULAR = '[\\w\\-.%]+';

class EntryController extends Router {
	constructor () {
		super();
	}
	
	_keys () {
		return Entity.keys();
	}
	
	_routes () {
		return [
			{
				method: 'get',
				path: '/',
				on: 'index',
				args: ['query.dir']
			},
			{
				method: 'get',
				path: `/:path(${PATH_REGULAR})`,
				on: 'show',
				args: ['params.path']
			},
			{
				method: 'post',
				path: '/',
				on: 'create',
				args: ['body.path']
			},
			{
				method: 'put',
				path: `/:path(${PATH_REGULAR})`,
				on: 'update',
				args: ['params.path', 'body.content']
			},

		];
	}

	index (dir = '') {
		this.view(Entity.entries(dir));
	}

	show (path) {
		this.view(Entity.at(path));
	}

	create (path) {
		this.view(Entity.create(req.body.path));
	}

	update (path, content) {
		thiw.view(Entity.update(req.params.path, req.body.content));
	});

router.put(`/:path(${PATH_REGULAR})/rename`, (req, res) => {
	console.log(`rename able!! ${req.params.path} ${req.query.to}`);
	Render.json(res, Entity.rename(req.params.path, req.query.to));
});

router.delete(`/:path(${PATH_REGULAR})`, (req, res) => {
	console.log('destroy able!!', req.params.path);
	Render.json(res, Entity.destroy(req.params.path));
});

module.exports = (new EntryController()).bind();
