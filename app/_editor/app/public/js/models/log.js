'use strict';
class Log extends _Log {
	constructor () {
		super();
		this.socket = null;
	}

	static init (id = 'log-main') {
		let self = new Log();
		// XXX
		APP.ws.on('message', self._onMessage);
		ko.applyBindings(self, document.getElementById(id));
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

	_onMessage (msg) {
		let [tag, data] = msg;
		if (tag === 'editor.access-log') {
			return APP.log.on(data);
		}
		return true;
	}
}

