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
		console.log(msg);
		super.on(this._parseLine(msg));
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

	_onMessage (res) {
		let [tag, msg] = JSON.parse(res.data);
		if (tag === 'editor.access-log') {
			APP.log.on(msg);
		}
	}
}

