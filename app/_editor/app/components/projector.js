'use strict';

let Projector = {
	select: (body, keys) => {
		if (Array.isArray(body)) {
			return body.map((self) => {
					return Projector._select(self, keys);
				});
		} else if (typeof body === 'object') {
			return Projector._select(body, keys);
		} else {
			return body;
		}
	},
	_select: (obj, keys) => {
		let ret = {};
		for (let key of keys) {
			if (key.indexOf('.') === -1) {
				if (key in obj) {
					ret[key] = obj[key];
				}
			} else {
				let [to, from] = key.split('.');
				if (to in obj) {
					ret[to] = Projector.select(obj[to], from.split(','));
				}
			}
		}
		return ret;
	}
};

module.exports = Projector;