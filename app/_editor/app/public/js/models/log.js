'use strict';

class Log extends _Log {
	constructor () {
		super();
		this.socket = null;
	}

	static init (id = 'page-log') {
		const self = new Log();
		// XXX depends on APP...
		APP.ws.on('message', (msg) => { return self._onMessage(msg); });
		// ko.applyBindings(self, document.getElementById(id));
		return self;
	}

	on (msg) {
		return this.line(this._parseLine(msg));
	}

	_parseLine (msg) {
		let line = '';
		let delimiter = '';
		for (let key in msg) {
			line += delimiter + msg[key];
			delimiter = ' ';
		}
		return line;
	}

	_onMessage ([tag, data]) {
		if (tag === 'editor.access-log') {
			return this.on(data);
		}
		return true;
	}
}

